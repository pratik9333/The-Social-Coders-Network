require("dotenv").config();
const mongoose = require("mongoose");

const friendSchema = new mongoose.Schema(
  {
    requester: { type: mongoose.Schema.ObjectId, ref: "User" },
    recipient: { type: mongoose.Schema.ObjectId, ref: "User" },
    status: {
      type: Number,
      enums: [
        1, //'requested',
        2, //'pending',
        3, //'friends' ->   accepted
      ],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Friend", friendSchema);
