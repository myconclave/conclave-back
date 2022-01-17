const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();

//Network Model
const Network = require("../../models/Network");
const Individuals = require("../../models/Individuals");

router.get("/individuals/:id", async (req, res) => {
  const knownUsers = [mongoose.Types.ObjectId(req.params.id)];

  //find requested connections from Network collection as per userId
  await Network.findOne({
    userId: mongoose.Types.ObjectId(req.params.id),
  }).then((result) => {
    if (result) {
      result.network.forEach((user) =>
        knownUsers.push(mongoose.Types.ObjectId(user.id))
      );
    }
  });

  //find accepted connections from Individual collection as per userId
  await Individuals.findOne({
    _id: mongoose.Types.ObjectId(req.params.id),
  }).then((result) => {
    if (result) {
      result.connections.forEach((connection) =>
        knownUsers.push(mongoose.Types.ObjectId(connection))
      );
    }
  });

  //Aggregate them and give the final result
  Individuals.aggregate([
    {
      $match: {
        _id: {
          $nin: knownUsers,
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
  ]).then((individual) => res.json(individual));
});

//List all companies
router.get("/companies/:id", async (req, res) => {
  const currentCompanyId = req.params.id;
  const excludeCompany = [];

  await Network.findOne({ userId: currentCompanyId }).then((res) => {
    res &&
      res.network.forEach((data) => {
        excludeCompany.push(data);
      });
  });

  Company.aggregate([
    {
      $match: {
        _id: {
          $nin: excludeCompany,
        },
      },
    },
    {
      $unset: ["password", "email", "permission", "jobs"],
    },
  ]).then((company) => {
    company.map((cmp) => {
      cmp.employees = cmp.employees.length;
    });

    return res.json(company);
  });
});

//@route GET api/user/network
//@desc Get User's Networks
//access Private

//Send a Connection Request
router.put("/individual", async (req, res) => {
  //Update the Network Collection with userId and the requested Id
  Network.updateOne(
    { userId: mongoose.Types.ObjectId(req.body.userId) },
    {
      $addToSet: {
        network: {
          id: mongoose.Types.ObjectId(req.body.newMemberId),
          confirmed: false,
        },
      },
    },
    { upsert: true }
  ).then((result) => {
    return;
  });

  //Add To Individual's collection as per user Id in the requests array
  Individual.updateOne(
    { _id: req.body.newMemberId },
    {
      $addToSet: {
        requests: {
          id: mongoose.Types.ObjectId(req.body.userId),
          name: req.body.userName,
          seen: false,
        },
      },
    },
    { upsert: true }
  )
    .then((result) => {
      res.status(200).send({ msg: "Request Sent Successfully" });
    })
    .catch((err) => res.status(404).json({ msg: "Unable to Send Request" }));
});

//Add as a connection

router.put("/accept", async (req, res) => {
  await Network.updateOne(
    { userId: mongoose.Types.ObjectId(req.body.acceptId) },
    { $pull: { network: { id: mongoose.Types.ObjectId(req.body.userId) } } }
  ).then((result) => {
    return;
  });

  await Individual.updateOne(
    { _id: mongoose.Types.ObjectId(req.body.userId) },
    { $pull: { requests: { id: mongoose.Types.ObjectId(req.body.acceptId) } } },
    { upsert: true }
  )
    .then((result) => {
      return;
    })
    .catch((err) => {
      res.status(400).json({ msg: "Sorry !! Unable to Add" });
    });

  await Individual.updateOne(
    { _id: mongoose.Types.ObjectId(req.body.acceptId) },
    {
      $addToSet: {
        connections: { id: mongoose.Types.ObjectId(req.body.userId) },
      },
    },
    { upsert: true }
  )
    .then((result) => {
      return;
    })
    .catch((err) => {
      res.status(400).json({ msg: "Sorry !! Unable to Add" });
    });

  await Individual.updateOne(
    { _id: mongoose.Types.ObjectId(req.body.userId) },
    { $addToSet: { connections: mongoose.Types.ObjectId(req.body.acceptId) } },
    { upsert: true }
  )
    .then((result) => {
      res.status(200).json({ msg: "User Added Successfully." });
    })
    .catch((err) => {
      res.status(400).json({ msg: "Sorry !! Unable to Add." });
    });
});

router.put("/reject", (req, res) => {});

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
