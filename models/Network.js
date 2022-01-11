const mongoose = require("mongoose");

//Create Schema
const NetworkSchema = mongoose.Schema({
  id: {
    type: mongoose.ObjectId,
  },
  userId: {
    type: String,
    required: true,
  },
  network: {
    type: Array,
  },
});

module.exports = Network = mongoose.model("networks", NetworkSchema);
