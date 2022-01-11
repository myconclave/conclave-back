const mongoose = require("mongoose");

//Create Schema
const EducationSchema = mongoose.Schema({
  id: {
    type: mongoose.ObjectId,
  },
  school: { type: String },
  degree: { type: String },
  studyArea: { type: String },
  location: { type: Object },
  startDate: { type: Date },
  endDate: { type: Date },
  userId: mongoose.Schema.Types.ObjectId,
  present: { type: Boolean },
});

module.exports = Education = mongoose.model("education", EducationSchema);
