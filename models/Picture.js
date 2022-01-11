const mongoose = require("mongoose");

//Create Schema
const PictureSchema = mongoose.Schema({
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

module.exports = Picture = mongoose.model("pictures", PictureSchema);
