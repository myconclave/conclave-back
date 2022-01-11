const mongoose = require("mongoose");

//Create Schema
const NotificationSchema = mongoose.Schema({
  id: {
    type: mongoose.ObjectId,
  },
  userId: { type: mongoose.ObjectId },
  requests: { type: Array },
  posts: { type: Array },
});

module.exports = Notification = mongoose.model(
  "notifications",
  NotificationSchema
);
