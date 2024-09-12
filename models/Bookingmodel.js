const mongoose = require("mongoose");

const Bookingmodel = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    doctorId: {
      type: String,
      required: true,
    },
    doctorInfo: {
      type: String,
      required: true,
    },
    userInfo: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true, // approved or rejected status of booking request.
      default: "pending",
    },
    time: {
      type: String,
      required: true, // default time is 00:00 if not provided by user.
    },
  },
  { timestamps: true }
);

const Bookingmodels = mongoose.model("Appointment", Bookingmodel);

module.exports = Bookingmodels;
