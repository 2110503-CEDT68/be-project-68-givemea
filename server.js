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

// Sanitize data — ป้องกัน MongoDB injection เช่น { "$gt": "" }
// sanitize เฉพาะ body และ params เพราะ Express 5 ทำให้ req.query เป็น read-only
app.use((req, res, next) => {
  if (req.body) req.body = mongoSanitize.sanitize(req.body);
  if (req.params) req.params = mongoSanitize.sanitize(req.params);
  next();
});

// Set security HTTP headers
app.use(helmet());

// Prevent XSS attacks — ฆ่า <script> ใน input
app.use(xss());

// Rate limiting — จำกัด 100 requests ต่อ 10 นาที ต่อ IP
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100,
  message: {
    success: false,
    message: "Too many requests, please try again after 10 minutes",
  },
});
app.use(limiter);

// Enable CORS — อนุญาตให้ domain อื่นเรียก API ได้
app.use(cors());

// Prevent HTTP Parameter Pollution เช่น ?sort=name&sort=tel
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