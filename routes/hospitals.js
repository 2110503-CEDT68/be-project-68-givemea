const express = require("express");
const {
  getHospitals,
  getHospital,
  createHospital,
  updateHospital,
  deleteHospital,
} = require("../controllers/hospitals");

// Include other resource routers
const appointmentRouter = require("./appointments");

const router = express.Router();
const { protect, authorization } = require("../middleware/auth");

// Re-route into other resource routers
router.use("/:hospitalId/appointments", appointmentRouter);

router
  .route("/")
  .get(getHospitals)
  .post(protect, authorization("admin"), createHospital);
router
  .route("/:id")
  .get(getHospital)
  .put(protect, authorization("admin"), updateHospital)
  .delete(protect, authorization("admin"), deleteHospital);

module.exports = router;
