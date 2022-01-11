const mongoose = require("mongoose");

//Create Schema
const ExperienceSchema = mongoose.Schema({
  id: {
    type: mongoose.ObjectId,
  },
  position: { type: String },
  company: { type: String },
  location: { type: Object },
  startDate: { type: Date },
  endDate: { type: Date },
  userId: mongoose.Schema.Types.ObjectId,
  present: { type: Boolean },
});

module.exports = Experience = mongoose.model("experience", ExperienceSchema);
