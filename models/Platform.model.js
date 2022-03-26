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
  technologiesUsed: [
    {
      type: String,
      required: true,
    },
  ],
  noOfCommits: {
    type: Number,
    required: true,
  },
  noOfRepositories: {
    type: Number,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  contestParticipated: {
    type: Number,
    required: true,
  },
  noOfSubmission: {
    type: Number,
    required: true,
  },
  accuracy: {
    type: Number,
    required: true,
  },
  languageUsed: [
    {
      type: String,
      required: true,
    },
  ],
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
