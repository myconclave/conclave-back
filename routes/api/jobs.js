const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const mongoose = require("mongoose");

//Job Model
const Job = require("../../models/Jobs");
const Company = require("../../models/Company");
const UserApplication = require("../../models/UserApplication");
const JobApplications = require("../../models/JobApplications");

// @route GET api/jobs
// @desc Get all Jobs
// @access Public
router.get("/", (req, res) => {
  Job.find({}).then((job) => {
    return res.json(job);
  });
});

// @route GET api/jobs/:id
// @desc Get all Jobs for particular company(by id)
// @access Public
router.get("/:id", (req, res) => {
  Job.aggregate([
    {
      $match: {
        postedBy: mongoose.Types.ObjectId(req.params.id),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "postedBy",
        foreignField: "_id",
        as: "company",
      },
    },
    {
      $unset: ["company.password", "company.email", "postedBy"],
    },
  ]).then((job) => res.json(job));
});

// @route GET api/jobs/:id
// @desc Get all Jobs for particular company(by id)
// @access Public
router.get("/job/:id", async (req, res) => {
  Job.findOne({ _id: mongoose.Types.ObjectId(req.params.id) }).then((result) =>
    res.json(result)
  );
});

router.put("/apply/:id", (req, res) => {
  UserApplication.updateOne(
    { userId: req.body.userId },
    { $addToSet: { jobs: req.params.id } },
    { upsert: true }
  )
    .then(() => {
      JobApplications.updateOne(
        { jobId: req.params.id },
        { $addToSet: { users: req.body.userId } },
        { upsert: true }
      ).then((result) => {
        return res.status(200).send({ msg: "Job Application Successful" });
      });
    })
    .catch((err) =>
      returnres.status(404).json({ msg: "Unable to Apply to this Job" })
    );
});

router.get("/applied/:id", async (req, res) => {
  const jobs = [];

  await UserApplication.findOne({ userId: req.params.id }).then((data) => {
    if (data) {
      data.jobs.map((job) => {
        jobs.push(mongoose.Types.ObjectId(job));
      });
    }
  });

  await Job.aggregate([
    {
      $match: {
        _id: {
          $in: jobs,
        },
      },
    },
  ])
    .then((result) => {
      return res.status(200).json(result);
    })
    .catch((err) => {
      res.status(404).json({ msg: "No jobs available" });
    });
});

// @route POST api/jobs
// @desc  Create new Jobs
// @access Private
router.post("/:id", auth, (req, res) => {
  const {
    role,
    expertise,
    skills,
    duration,
    details,
    location,
    addedBy,
    userName,
  } = req.body;
  if (
    !role ||
    !expertise ||
    !skills ||
    !duration ||
    !details ||
    !location.country
  )
    return res.status(400).json({ msg: "Please enter all fields." });

  if (skills.length > 5)
    return res.status(400).json({ msg: "Only 5 skills can be added" });

  if (details.split(".").length > 5)
    return res.status(400).json({ msg: "Too much details. Please shorten." });

  let jobDetails = {
    role,
    skills: skills.map((skill) => skill.label),
    expertise: expertise.label,
    duration: duration.label,
    location,
    details: details.split(".").map((detail) => detail && detail.trim()),
    company: { id: addedBy, name: userName },
  };

  const newJob = new Job(jobDetails);
  newJob
    .save()
    .then((job) => {
      Company.updateOne(
        { _id: req.params.id },
        { $addToSet: { jobs: job._id } }
      ).then((company) => {
        return;
      });
      return res.status(200).json({
        jobId: job._id,
        msg: "Job Added Successfully",
      });
    })
    .catch((err) => {
      return res.status(200).json({
        msg: "Unable To add the Job",
      });
    });
});

// @route DELETE api/jobs
// @desc  Delete an Job
// @access Private
router.delete("/:id", auth, (req, res) => {
  Job.findById(req.params.id)
    .then((job) => job.remove().then(() => res.json({ success: true })))
    .catch((err) => res.status(404).json({ success: false }));
});

module.exports = router;
