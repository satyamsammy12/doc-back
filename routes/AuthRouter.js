const express = require("express");
const {
  login,
  register,
  authController,
  docController,
  GetAllDoctorController,
  getAllNotificationController,
  deleteAllNotificationController,
  bookAppointmentController,
  bookingAvaibilityController,
  UsersappointmentsController,
} = require("../controllers/userController");
const authMiddle = require("../middleware/authMiddle");

const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.post("/getuserdata", authMiddle, authController);
router.post("/apply-doctor", authMiddle, docController);
router.post("/get-all-notification", authMiddle, getAllNotificationController);
router.post(
  "/delete-all-notification",
  authMiddle,
  deleteAllNotificationController
);

router.get("/getAllDoctors", authMiddle, GetAllDoctorController);
router.post("/book-appointment", authMiddle, bookAppointmentController);
router.post("/booking-availability", authMiddle, bookingAvaibilityController);
router.get("/user-appointments", authMiddle, UsersappointmentsController);

module.exports = router;
