const mongoose = require("mongoose");

//Create Schema
const IndividualSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  headline: {
    type: String,
  },
  permission: {
    type: Number,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: Number,
  },
  password: {
    type: String,
    required: true,
  },
  about: {
    type: String,
  },
  requests: {
    type: Array,
  },
  connections: { type: Array },
});

IndividualSchema.index({ name: "text" });

module.exports = Individual = mongoose.model("individuals", IndividualSchema);
