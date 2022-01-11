const express = require("express");

const router = express.Router();

//Path Model
const User = require("../../models/User");

router.get("/:text", (req, res) => {
  User.aggregate([
    {
      $search: {
        index: "user-search",
        text: {
          query: req.params.text,
          path: "name",
        },
      },
    },
    { $project: { _id: 1, name: 1 } },
  ])
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;
