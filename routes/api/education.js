const express = require("express");
// const auth = require("../../middleware/auth");

const router = express.Router();

//Education Model
const Education = require("../../models/Education");

//@route GET api/user/education
//@desc Get User's Educations
//access Private
router.get("/:id", (req, res) => {
  Education.find({ userId: req.params.id })
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      res.status(404).json({ msg: "Something went wrong" });
    });
});

router.post("/:id", async (req, res) => {
  const newEducation = req.body.education;
  newEducation.userId = req.params.id;

  try {
    if (!newEducation.endDate) {
      newEducation.present = true;
    }
    if (!newEducation.startDate) {
      res.status(404).json({ msg: "Please Add a start date" });
    } else {
      const education = new Education(newEducation);
      await education.save();
      res.send(education);
    }
  } catch (err) {
    res.status(404).json({ msg: "Unable to Add Education" });
  }
});

router.put("/:id", async (req, res) => {
  Education.updateOne({ _id: req.params.id }, { $set: req.body.education })
    .then((result) => {
      res.status(200).send({ msg: "Education Updated Successfully" });
    })
    .catch((err) =>
      res.status(404).json({ msg: "Unable to Update Education" })
    );
});

// @route DELETE api/jobs
// @desc  Delete an Job
// @access Private
router.delete("/:id", async (req, res) => {
  await Education.findById(req.params.id)
    .then((exp) =>
      exp
        .remove()
        .then(() => res.json({ msg: "Education Deleted Successfully" }))
    )
    .catch((err) =>
      res.status(404).json({ msg: "Unable to Delete Education" })
    );
});

module.exports = router;
