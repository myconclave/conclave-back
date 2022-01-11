const mongoose = require("mongoose");

//Create Schema
const JobsSchema = mongoose.Schema({
  role: { type: String },
  duration: { type: Object },
  expertise: { type: Object },
  skills: { type: Array },
  location: { type: Object },
  details: { type: Array },
  postedOn: { type: Date, default: Date.now },
  company: { type: Object },
});

module.exports = Job = mongoose.model("job", JobsSchema);
