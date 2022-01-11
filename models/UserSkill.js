const mongoose = require("mongoose");

//Create Schema
const UserSkillSchema = mongoose.Schema({
  id: {
    type: mongoose.ObjectId,
  },
  skills: {
    type: Array,
  },
  userId: mongoose.Schema.Types.ObjectId,
});

module.exports = UserSkill = mongoose.model("userSkills", UserSkillSchema);
