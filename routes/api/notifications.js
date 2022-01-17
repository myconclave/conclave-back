const express = require("express");
const _ = require("lodash");
const Individuals = require("../../models/Individuals");

const router = express.Router();

router.get("/:id", async (req, res) => {
  Individuals.findOne({ _id: req.params.id }).then((result) => {
    const unSeen = _.filter(result.requests, { seen: false });
    res.status(200).json(unSeen);
  });
});

module.exports = router;
