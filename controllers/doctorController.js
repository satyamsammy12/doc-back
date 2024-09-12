const docModel = require("../models/docModel");
const Bookingmodels = require("../models/Bookingmodel");

const getDoctorInfoController = async (req, res) => {
  try {
    const doc = await docModel.findOne({ userId: req.body.userId });
    res.status(200).send({
      message: "Account fetch success",
      success: true,
      data: doc,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in doc info controller",
      error,
    });
  }
};
const updateProfileController = async (req, res) => {
  try {
    const doctor = await docModel.findOneAndUpdate(
      { userId: req.body.userId },
      req.body
    );
    res.status(200).send({
      success: true,
      message: "Profile updated successfully",
      data: doctor,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in update profile controller",
      error,
    });
  }
};

const getDoctorById = async (req, res) => {
  try {
    const doc = await docModel.findById({ _id: req.body.doctorId });
    if (!doc) {
      return res.status(404).send({
        success: false,
        message: "Doctor not found",
      });
    }
    res.status(200).send({
      success: true,
      message: "Doctor fetched successfully",
      data: doc,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in get doctor by id controller",
      error,
    });
  }
};
const getDoctorAppointments = async (req, res) => {
  try {
    const doctor = await docModel.findOne({ userId: req.body.userId });
    const appointment = await Bookingmodels.find({
      doctorId: doctor._id,
    });
    res.status(200).send({
      success: true,
      message: "Doctor's appointments fetched successfully",
      data: appointment,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in get doctor appointments controller",
      error,
    });
  }
};

module.exports = {
  getDoctorInfoController,
  updateProfileController,
  getDoctorById,
  getDoctorAppointments,
};
