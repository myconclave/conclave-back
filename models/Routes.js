const mongoose = require("mongoose");

//Create Schema
const RoutesSchema = mongoose.Schema({
  id: { type: mongoose.ObjectId },
  routes: { type: Array },
  permission: Number,
});

module.exports = Routes = mongoose.model("routes", RoutesSchema);
