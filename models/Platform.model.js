require("dotenv").config();
const mongoose = require("mongoose");

const platformSchema = new mongoose.Schema({
  name: {
    type: String,
    maxlength: [40, "Platform name is too long"],
    required: [true, "Platform name is required"],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  contest: {
    attended: { type: Number },
    rating: { type: Number },
    totalParticipants: { type: Number },
    topPercentage: { type: Number },
  },
  noOfSubmission: {
    type: Number,
    required: true,
  },

  languageUsed: [],
  noSolvedQuestions: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Platform", platformSchema);
