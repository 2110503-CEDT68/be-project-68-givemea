const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const { xss } = require("express-xss-sanitizer");
const rateLimit = require("express-rate-limit");
const cors = require("cors");
const hpp = require("hpp");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

// Load env vars
dotenv.config({ path: "./config/config.env" });

// Connect to database
connectDB();

const app = express();
app.set("query parser", "extended");

// Swagger setup
const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Job Fair Booking API",
      version: "1.0.0",
      description: "API for managing companies and interview session bookings",
    },
    servers: [
      {
        url: "http://localhost:5000/api/v1",
      },
    ],
  },
  apis: ["./routes/*.js"],
};
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Cookie parser
app.use(cookieParser());

// Body parser
app.use(express.json());

// Sanitize data
app.use(
  mongoSanitize({
    // workaround to log sanitized keys for debugging
    onSanitize: ({ req, key }) => {
      console.warn(`Sanitized key: ${key} from request`);
    },
  })
);

// Set security HTTP headers
app.use(helmet());

// Prevent XSS attacks
app.use(xss());

// Rate limiting - limit each IP to 100 requests per 10 minutes
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100,
  message: {
    success: false,
    message: "Too many requests, please try again after 10 minutes",
  },
});
app.use(limiter);

// Enable CORS for all routes (you can restrict this in production)
app.use(cors());

// Prevent HTTP Parameter Pollution attacks
app.use(hpp());

// Route files
const companies = require("./routes/companies");
const auth = require("./routes/auth");
const bookings = require("./routes/bookings");

app.use("/api/v1/companies", companies);
app.use("/api/v1/auth", auth);
app.use("/api/v1/bookings", bookings);

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});