const express = require("express");
const userModel = require("../models/userModel");
const docModel = require("../models/docModel");

const getAllUsersController = async (req, res) => {
  try {
    const users = await userModel.find({});
    res.status(200).send({
      success: true,
      message: "Users fetched successfully",
      data: users,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "error while fetching users",
      error,
    });
  }
};
const getAllDoctorController = async (req, res) => {
  try {
    const docs = await docModel.find();
    res.status(200).send({
      success: true,
      message: "Doctors fetched successfully",
      data: docs,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "error while fetching doctors",
      error,
    });
  }
};

const changeAccountStatus = async (req, res) => {
  try {
    const { doctorId, status } = req.body;
    const doctor = await docModel.findByIdAndUpdate(doctorId, { status });
    const user = await userModel.findOne({ _id: doctor.userId });
    const notification = user.notification;
    notification.push({
      type: "doctor-account-request-updated",
      message: `Your Doctor Account Request Has ${status}`,
      onClickPath: "/notification",
    });
    user.isDoctor = status === "approved" ? true : false;
    await user.save();
    res.status(201).send({
      success: true,
      message: "Account status Updated",
      data: doctor,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Account Status",
      error,
    });
  }
};

const rejectAccountStatus = async (req, res) => {
  try {
    const { doctorId, status } = req.body;

    // Check if doctorId and status are provided
    if (!doctorId || !status) {
      return res.status(400).send({
        success: false,
        message: "Doctor ID and status are required",
      });
    }

    // Update doctor's status
    const doctor = await docModel.findByIdAndUpdate(
      doctorId,
      { status },
      { new: true }
    );

    // Check if doctor was found and updated
    if (!doctor) {
      return res.status(404).send({
        success: false,
        message: "Doctor not found",
      });
    }

    // Find the associated user
    const user = await userModel.findById(doctor.userId);

    // Check if user exists
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    // Update user's notifications and status
    user.notification.push({
      type: "doctor-account-request-updated",
      message: `Your Doctor Account Request Has ${status}`,
      onClickPath: "/notification",
    });
    user.isDoctor = status === "approved";
    await user.save();

    // Send success response
    res.status(200).send({
      success: true,
      message: "Account status updated",
      data: doctor,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error updating account status",
      error: error.message,
    });
  }
};

module.exports = {
  getAllUsersController,
  getAllDoctorController,
  changeAccountStatus,
  rejectAccountStatus,
};
