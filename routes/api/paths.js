const express = require("express");
const auth = require("../../middleware/auth");

const router = express.Router();

//Path Model
const User = require("../../models/User");

router.get("/:id", auth, (req, res) => {
  User.aggregate([
    {
      $match: {
        userId: req.params.id,
      },
    },
    {
      $lookup: {
        from: "routes",
        localField: "type",
        foreignField: "userType",
        as: "paths",
      },
    },
    {
      $unset: [
        "type",
        "userEmail",
        "userId",
        "_id",
        "paths._id",
        "paths.userType",
        "__v",
      ],
    },
  ]).then((route) => {
    res.json(route[0].paths[0].routes);
  });
});

module.exports = router;
