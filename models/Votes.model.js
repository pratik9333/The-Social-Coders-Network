require("dotenv").config();
const mongoose = require("mongoose");

const votingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.ObjectId, ref: "User" },
    voter: { type: mongoose.Schema.ObjectId, ref: "User" },
    status: {
      type: Number,
      enums: [
        1, //Upvote
        -1, //Downvote
      ],
      default: 0,
    },
    expiryTime: { type: Number },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Vote", votingSchema);
