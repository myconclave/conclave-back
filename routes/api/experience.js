const express = require("express");
// const auth = require("../../middleware/auth");

const router = express.Router();

//Experience Model
const Experience = require("../../models/Experience");

//@route GET api/user/experience
//@desc Get User's Experiences
//access Private
router.get("/:id", (req, res) => {
  Experience.find({ userId: req.params.id })
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      res.status(404).json({ msg: "Something went wrong" });
    });
});

//@route PUT api/user/experience
//@desc Edit Experience Experience
//access Private
router.post("/:id", async (req, res) => {
  const newExperience = req.body.experience;
  newExperience.userId = req.params.id;

  try {
    if (!newExperience.endDate) {
      newExperience.present = true;
    }
    if (!newExperience.startDate) {
      res.status(404).json({ msg: "Please Add a start date" });
    } else {
      const experience = new Experience(newExperience);
      await experience.save();
      res.send(experience);
    }
  } catch (err) {
    res.status(404).json({ msg: "Unable to Update Experience" });
  }
});

router.put("/:id", async (req, res) => {
  Experience.updateOne({ _id: req.params.id }, { $set: req.body.experience })
    .then((result) => {
      res.status(200).send({ msg: "Experience Updated Successfully" });
    })
    .catch((err) =>
      res.status(404).json({ msg: "Unable to Update Experience" })
    );
});

// @route DELETE api/jobs
// @desc  Delete an Job
// @access Private
router.delete("/:id", async (req, res) => {
  await Experience.findById(req.params.id)
    .then((exp) => exp.remove().then(() => res.json({ success: true })))
    .catch((err) => res.status(404).json({ success: false }));
});

module.exports = router;
