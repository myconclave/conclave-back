const express = require("express");
// const auth = require("../../middleware/auth");

const router = express.Router();

//UserSkill Model
const UserSkill = require("../../models/UserSkill");

//@route GET api/user/userSkill
//@desc Get User's UserSkills
//access Private
router.get("/:id", (req, res) => {
  UserSkill.find({ userId: req.params.id })
    .then((result) => {
      res.json(result[0]);
    })
    .catch((err) => {
      res.status(404).json({ msg: "Something went wrong" });
    });
});

router.put("/:id", async (req, res) => {
  UserSkill.updateOne(
    { _id: req.params.id },
    { $set: { skills: req.body, userId: req.params.id } },
    { upsert: true }
  )
    .then((result) => {
      res.status(200).send({ msg: "Skill Updated Successfully" });
    })
    .catch((err) => res.status(404).json({ msg: "Unable to Update Skills" }));
});

// @route DELETE api/jobs
// @desc  Delete an Job
// @access Private
router.delete("/:id", async (req, res) => {
  await UserSkill.findById(req.params.id)
    .then((exp) => exp.remove().then(() => res.json({ success: true })))
    .catch((err) => res.status(404).json({ success: false }));
});

module.exports = router;
