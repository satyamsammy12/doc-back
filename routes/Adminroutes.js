const express = require("express");
const router = express.Router();
const authMiddle = require("../middleware/authMiddle");
const {
  getAllUsersController,
  getAllDoctorController,
  changeAccountStatus,
  rejectAccountStatus,
} = require("../controllers/adminController");

router.get("/getAllUsers", authMiddle, getAllUsersController);
router.get("/getAllDoctors", authMiddle, getAllDoctorController);
router.post("/changeAccountStatus", authMiddle, changeAccountStatus);
router.post("/rejectAccountStatus", authMiddle, rejectAccountStatus);

module.exports = router;
