const mongoose = require("mongoose");

//Create Schema
const UserSchema = mongoose.Schema({
  id: {
    type: mongoose.ObjectId,
  },
  userId: {
    type: String,
    required: true,
  },
  type: {
    type: String,
  },
  userEmail: {
    type: String,
  },
});

UserSchema.index({ name: "text" });

module.exports = User = mongoose.model("user", UserSchema);
