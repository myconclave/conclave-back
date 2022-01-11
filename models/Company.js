const mongoose = require("mongoose");

//Create Schema
const CompanySchema = mongoose.Schema({
  id: {
    type: mongoose.ObjectId,
  },
  name: { type: String, required: true },
  email: { type: String, required: true },
  headline: { type: String, required: true },
  password: { type: String, required: true },
  jobs: { type: Array },
  employees: { type: Array },
});

module.exports = Company = mongoose.model("company", CompanySchema);
