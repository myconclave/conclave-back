const mongoose = require("mongoose");

//Create Schema
const UserApplicationSchema = mongoose.Schema({
  id: {
    type: mongoose.ObjectId,
  },
  userId: {
    type: String,
    required: true,
  },
  jobs: { type: Array },
});

module.exports = UserApplication = mongoose.model(
  "userApplication",
  UserApplicationSchema
);
