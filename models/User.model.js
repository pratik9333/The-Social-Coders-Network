require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jsonwebtoken = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      maxlength: [40, "User name is too long"],
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Email is required"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      select: false,
      minlength: [6, "Password should be atleast 6 char"],
    },
    photo: { id: { type: String }, url: { type: String } },
    social: {
      githubProfile: {
        username: { type: String },
        publicRepos: { type: String },
        followers: { type: String },
        following: { type: String },
      },
      leetcodeProfile: {
        username: { type: String },
        rating: { type: Number },
        contest: { attended: { type: Number }, rating: { type: Number } },
        solvedQuestions: { type: Number },
        submissions: { type: Number },
        languagesUsed: [],
      },
      codechefProfile: {
        username: { type: String },
        rating: { type: Number },
        division: { type: Number },
        globalRank: { type: Number },
        countryRank: { type: Number },
        solvedQuestions: { type: Number },
        partiallySolved: { type: Number },
      },
      codeforcesProfile: {
        username: { type: String },
        rating: { type: Number },
        contest: { attended: { type: Number }, rating: { type: Number } },
        solvedQuestions: { type: Number },
        submissions: { type: Number },
        languagesUsed: [],
      },
    },
    upvotes: { type: Number, default: 0, select: false },
    downvotes: { type: Number, default: 0, select: false },
    nextUpdateCycle: { type: Number, select: false },
    rating: { type: Number, default: 0 },
    friends: [{ type: mongoose.Schema.ObjectId, ref: "Friend", select: false }],
  },
  { timestamps: true }
);

//encrypt password before save - hooks
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

//create and return JWT token
userSchema.methods.getJwtToken = function () {
  return jsonwebtoken.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};

module.exports = mongoose.model("User", userSchema);
