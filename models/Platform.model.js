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
  username: {
    type: String,
    required: true,
  },
  publicRepos: {
    type: Number,
  },
  followers: {
    type: Number,
  },
  following: {
    type: Number,
  },
  userRating: {
    type: Number,
  },
  contest: {
    attended: { type: Number },
    rating: { type: Number },
  },
  noOfSubmission: {
    type: Number,
  },
  languageUsed: [],
  noSolvedQuestions: {
    type: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Platform", platformSchema);
