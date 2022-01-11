const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const mongoose = require("mongoose");
const User = require("../../models/User");
const Education = require("../../models/Education");
const Experience = require("../../models/Experience");
const UserSkill = require("../../models/UserSkill");
const Resume = require("../../models/Resume");
const Individuals = require("../../models/Individuals");

router.get("/:id", async (req, res) => {
  const profile = {};
  await User.findOne({ userId: req.params.id }).then((result) => {
    profile.userId = mongoose.Types.ObjectId(result.userId);
    profile.type = result.type;
  });

  if (profile.type === "individual") {
    await Individuals.findOne({ _id: profile.userId })
      .select(["-password", "-permission"])
      .then((result) => {
        profile.head = result;
      });
    await Education.find({ userId: profile.userId }).then((result) => {
      profile.education = result;
    });
    await Experience.find({ userId: profile.userId }).then((result) => {
      profile.experience = result;
    });
    await UserSkill.find({ userId: profile.userId }).then((result) => {
      profile.skills = result;
    });
    await Resume.find({ userId: profile.userId }).then((result) => {
      profile.resume = result;
    });
  }
  res.json(profile);
});

module.exports = router;
