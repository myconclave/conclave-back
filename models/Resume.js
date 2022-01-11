const mongoose = require("mongoose");

//Create Schema
const ResumeSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  fileName: {
    type: String,
  },
  fileType: {
    type: String,
  },
  fileId: {
    required: true,
    type: String,
  },
  createdAt: {
    default: Date.now(),
    type: Date,
  },
});

module.exports = Resume = mongoose.model("resumes", ResumeSchema);
