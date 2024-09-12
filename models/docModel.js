const mongoose = require("mongoose");

const docSchema = new mongoose.Schema({
  userId: {
    type: String,
  },
  firstname: {
    type: String,
    required: [true, "First name is required"],
  },
  lastname: {
    type: String,
    required: [true, "Last name is required"],
  },
  phone: {
    type: String,
    required: [true, "Phone number is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
  },
  website: {
    type: String,
  },
  address: {
    type: String,
    required: [true, "Address is required"],
  },
  specialization: {
    type: String,
    required: [true, "Specialization is required"],
  },
  experience: {
    type: String,
    required: [true, "Experience is required"],
  },
  feesPerConsultation: {
    type: Number,
    required: [true, "Fees per consultation is required"],
  },
  status: {
    type: String,
    default: "pending",
  },
  timing: {
    type: Object,
    required: [true, "Timing is required"],
  },
});

const docModel = mongoose.model("doctors", docSchema);

module.exports = docModel;
