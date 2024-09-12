const express = require("express");
const router = express.Router();
const authMiddle = require("../middleware/authMiddle");
const {
  getDoctorInfoController,
  updateProfileController,
  getDoctorById,
  getDoctorAppointments,
} = require("../controllers/doctorController");

router.post("/getDoctorInfo", authMiddle, getDoctorInfoController);
router.post("/updateProfile", authMiddle, updateProfileController);
router.post("/getDoctorById", authMiddle, getDoctorById);
router.get("/doctor-appointments", authMiddle, getDoctorAppointments);

module.exports = router;
