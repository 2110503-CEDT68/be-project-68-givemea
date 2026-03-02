const express = require("express");
const {
  getCompanies,
  getCompany,
  createCompany,
  updateCompany,
  deleteCompany,
} = require("../controllers/companies");

// Include other resource routers
const bookingRouter = require("./bookings");

const router = express.Router();
const { protect, authorization } = require("../middleware/auth");

// Re-route into other resource routers
router.use("/:companyId/bookings", bookingRouter);

router
  .route("/")
  .get(getCompanies)
  .post(protect, authorization("admin"), createCompany);
router
  .route("/:id")
  .get(getCompany)
  .put(protect, authorization("admin"), updateCompany)
  .delete(protect, authorization("admin"), deleteCompany);

module.exports = router;
