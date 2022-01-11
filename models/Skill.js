const mongoose = require("mongoose");

//Create Schema
const SkillSchema = mongoose.Schema({
  skill: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Skill = mongoose.model("skills", SkillSchema);
