const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const moment = require("moment");
const BookingModels = require("../models/Bookingmodel");
const docModel = require("../models/docModel");
const jwt = require("jsonwebtoken");
const register = async (req, res) => {
  try {
    const existingUser = await userModel.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(200).send({
        success: false,
        message: "Email already exists",
      });
    }
    const password = req.body.password;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new userModel({
      email: req.body.email,
      password: hashedPassword,
      name: req.body.name,
    });
    await newUser.save();
    res.status(201).send({
      success: true,
      message: "User registered successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: `register controller ${error.message}`,
    });
  }
};
const login = async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.body.email });
    if (!user) {
      return res.status(200).send({
        success: false,
        message: "User not found",
      });
    }
    const isMatched = await bcrypt.compare(req.body.password, user.password);
    if (!isMatched) {
      return res.status(200).send({
        success: false,
        message: "Invalid email or password",
      });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.status(200).send({ message: "login success", success: true, token });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: `login controller ${error.message}`,
    });
  }
};

const authController = async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.body.userId });
    user.password = undefined;
    if (!user) {
      return res.status(200).send({ success: false, message: "Unauthorized" });
    } else {
      res.status(200).send({
        success: true,
        data: user,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: `authController ${error.message}`,
    });
  }
};
const docController = async (req, res) => {
  try {
    const newDoc = await docModel({ ...req.body, status: "pending" });
    await newDoc.save();
    const adminUser = await userModel.findOne({ isAdmin: true });
    const notification = adminUser.notification;
    notification.push({
      type: "apply-doctor-request",
      message: `${newDoc.firstname} ${newDoc.lastname} has applied for Doctor Account`,
      data: {
        doctorId: newDoc._id,
        name: newDoc.firstname + " " + newDoc.lastname,
        onClickPath: "/admin/doctors",
      },
    });
    await userModel.findByIdAndUpdate(adminUser._id, { notification });
    res.status(201).send({
      success: true,
      message: "Doctor Account Applied Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: `docController ${error.message}`,
      error,
    });
  }
};
const getAllNotificationController = async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.body.userId });
    const seennotification = user.seenNotification;
    const notification = user.notification;
    seennotification.push(...notification);
    user.notification = [];
    user.seennotification = notification;
    const updatedUser = await user.save();
    res.status(200).send({
      success: true,
      message: "all notification marked as read",
      data: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Notification",
      error,
    });
  }
};

const deleteAllNotificationController = async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.body.userId });
    user.notification = [];
    user.seenNotification = [];
    const updatedUser = await user.save();
    updatedUser.password = undefined;
    res.status(200).send({
      success: true,
      message: "All notification deleted successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Uable to delete all notification",
      error,
    });
  }
};

const GetAllDoctorController = async (req, res) => {
  try {
    const docs = await docModel.find({ status: "approved" });
    res.status(200).send({
      success: true,
      message: "Doctors fetched successfully",
      data: docs,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: true,
      message: "Failed  to fectch doctors",
    });
  }
};

const bookAppointmentController = async (req, res) => {
  try {
    req.body.date = moment(req.body.date, "DD-MM-YYYY").toISOString();
    req.body.time = moment(req.body.time, "HH:mm").toISOString();

    // Create a new booking entry
    const newBooking = new BookingModels(req.body);

    await newBooking.save();

    // Fetch the user and update notifications
    const user = await userModel.findById({ _id: req.body.doctorInfo.userId });

    // Add the notification to the user's notifications
    user.notification.push({
      type: "book-appointment",
      message: `You have booked an appointment with Dr. ${req.body.userInfo.name} at ${req.body.time}`,
      onClickPath: "/user/appointments",
    });

    await user.save(); // Ensure the user document is updated

    res.status(200).send({
      success: true,
      message: "Appointment booked successfully",
    });
  } catch (error) {
    console.error("Error booking appointment:", error);
    res.status(500).send({
      success: false,
      message: "Failed to book appointment",
      error: error.message,
    });
  }
};

const bookingAvaibilityController = async (req, res) => {
  try {
    const date = moment(req.body.date, "DD-MM-YY").toISOString();
    const fromTime = moment(req.body.time, "HH:mm")
      .subtract(1, "hours")
      .toISOString();
    const toTime = moment(req.body.time, "HH:mm").add(1, "hours").toISOString();
    const doctorId = req.body.doctorId;
    const appointment = await BookingModels.find({
      doctorId,
      date,
      time: {
        $gte: fromTime,
        $lte: toTime,
      },
    });
    if (appointment.length > 0) {
      res.status(200).send({
        success: true,
        message: "Doctor is busy on this time",
      });
      return;
    } else {
      res.status(200).send({
        success: true,
        message: "Doctor is available on this time",
      });
      return;
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Failed to check booking availability",
      error,
    });
  }
};
const UsersappointmentsController = async (req, res) => {
  try {
    const userAppointments = await BookingModels.find({
      userId: req.body.userId,
    });
    res.status(200).send({
      success: true,
      message: "User's appointments fetched successfully",
      data: userAppointments,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Failed to fetch user's appointments",
      error,
    });
  }
};

module.exports = {
  login,
  register,
  authController,
  docController,
  bookAppointmentController,
  GetAllDoctorController,
  getAllNotificationController,
  deleteAllNotificationController,
  bookingAvaibilityController,
  UsersappointmentsController,
};
