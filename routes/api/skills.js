const express = require("express");
const router = express.Router();

//Skill Model
const Skill = require("../../models/Skill");

//@route GET api/user/education
//@desc Get User's Educations
//access Private
router.get("/:id", (req, res) => {
  Skill.find({ userId: req.params.id })
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      res.status(404).json({ msg: "Something went wrong" });
    });
});

// @route GET api/skills
// @desc Get All Skills
// @access Private
router.get("/", (req, res) => {
  Skill.find()
    .sort({ date: -1 })
    .then((skills) => res.json(skills));
});

// @route POST api/skills
// @desc  Create new Skills
// @access Private
router.post("/", (req, res) => {
  const newSkill = new Skill({
    skill: req.body.skill,
  });

  newSkill.save().then((item) => res.json(item));
});

// @route DELETE api/skills
// @desc  Delete an Skill
// @access Private
router.delete("/:id", (req, res) => {
  Skill.findById(req.params.id)
    .then((item) => item.remove().then(() => res.json({ success: true })))
    .catch((err) => res.status(404).json({ success: false }));
});

module.exports = router;
