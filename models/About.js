const mongoose = require("mongoose");

//Create Schema
const AboutSchema = mongoose.Schema({
  id: { type: mongoose.ObjectId },
  about: { type: String },
  userId: mongoose.Schema.Types.ObjectId,
});

module.exports = About = mongoose.model("abouts", AboutSchema);
