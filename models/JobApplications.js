const mongoose = require("mongoose");

//Create Schema
const JobApplicationSchema = mongoose.Schema({
  id: {
    type: mongoose.ObjectId,
  },
  jobId: {
    type: String,
    required: true,
  },
  users: { type: Array },
});

module.exports = JobApplication = mongoose.model(
  "jobApplication",
  JobApplicationSchema
);
