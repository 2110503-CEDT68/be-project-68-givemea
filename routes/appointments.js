const express = require("express");
const { getAppointments , getAppointment , addAppointment ,updateAppointment , deleteAppointment} = require("../controllers/appointments");

const router = express.Router({mergeParams: true});

const { protect , authorization } = require("../middleware/auth");

router.route("/").get(protect, getAppointments).post(protect, authorization("admin , user"), addAppointment);
router.route("/:id").get(protect, getAppointment).put(protect, authorization("admin , user"), updateAppointment).delete(protect, authorization("admin , user"), deleteAppointment);

module.exports = router;