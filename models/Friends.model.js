require("dotenv").config();
const mongoose = require("mongoose");

const friendSchema = new mongoose.Schema(
  {
    requester: { type: Schema.Types.ObjectId, ref: "users" },
    recipient: { type: Schema.Types.ObjectId, ref: "users" },
    status: {
      type: Number,
      enums: [
        0, //'add friend', -> rejected
        1, //'requested',
        2, //'pending',
        3, //'friends' ->   accepted
      ],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Friend", friendSchema);
