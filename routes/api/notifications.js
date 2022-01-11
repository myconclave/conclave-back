const express = require("express");
const mongoose = require("mongoose");
const Company = require("../../models/Company");
const Individuals = require("../../models/Individuals");
const Notifications = require("../../models/Notifications");

const router = express.Router();

router.get("/:id", async (req, res) => {
  console.log(req.params.id);
});

module.exports = router;
