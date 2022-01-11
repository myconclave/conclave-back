const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();

//Network Model
const Network = require("../../models/Network");

//@route GET api/user/network
//@desc Get User's Networks
//access Private
router.get("/:id", async (req, res) => {
  const knownUsers = [];
  await Network.find({ userId: req.params.id })
    .select(["-_id", "-userId"])
    .then((result) => {
      result && knownUsers.push(...result[0].network);
    });

  User.aggregate([
    {
      $match: {
        _id: {
          $in: knownUsers,
        },
      },
    },
    {
      $lookup: {
        from: "experiences",
        localField: "_id",
        foreignField: "userId",
        as: "company",
      },
    },
    {
      $unset: [
        "password",
        "email",
        "permission",
        "company.startDate",
        "company.userId",
        "company.__v",
      ],
    },
  ]).then((job) => res.json(job));
});

router.put("/", async (req, res) => {
  Network.updateOne(
    { userId: req.body.userId },
    { $addToSet: { network: mongoose.Types.ObjectId(req.body.newMemberId) } },
    { upsert: true }
  )
    .then((result) => {
      res.status(200).send({ msg: "Member Added Successfully" });
    })
    .catch((err) => res.status(404).json({ msg: "Unable to Update Network" }));
});

// @route DELETE api/jobs
// @desc  Delete an Job
// @access Private
router.delete("/:id", async (req, res) => {
  await Network.findById(req.params.id)
    .then((exp) =>
      exp.remove().then(() => res.json({ msg: "Network Deleted Successfully" }))
    )
    .catch((err) => res.status(404).json({ msg: "Unable to Delete Network" }));
});

module.exports = router;
