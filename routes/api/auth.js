const express = require("express");
const bcrypt = require("bcryptjs");
const config = require("config");
const jwt = require("jsonwebtoken");
const auth = require("../../middleware/auth");

const router = express.Router();

//User Model
const User = require("../../models/User");
const Individuals = require("../../models/Individuals");
const Company = require("../../models/Company");

// @route POST api/auth
// @desc Auth user
// @access Public
router.post("/", (req, res) => {
  const { email, password } = req.body;
  // Validation
  if (!email || !password) {
    return res.status(400).json({ msg: "Please enter all fields." });
  }

  // Check for existing user
  User.findOne({ userEmail: email }).then((user) => {
    if (!user) return res.status(400).json({ msg: "User Does not exists" });
    if (user.type === "company") {
      Company.findOne({ email }).then((company) => {
        bcrypt.compare(password, company.password).then((isMatch) => {
          if (!isMatch) {
            return res.status(400).json({ msg: "Invalid Credentials" });
          }
          jwt.sign(
            { id: company._id },
            config.get("jwtSecret"),
            {
              expiresIn: 36000,
            },
            (err, token) => {
              if (err) throw err;
              res.json({
                token,
                user: {
                  _id: company._id,
                  name: company.name,
                  email: company.email,
                  permission: 0,
                },
              });
            }
          );
        });
      });
    } else if (user.type === "individual") {
      Individuals.findOne({ email }).then((individual) => {
        bcrypt.compare(password, individual.password).then((isMatch) => {
          if (!isMatch)
            return res.status(400).json({ msg: "Invalid Credentials" });
          jwt.sign(
            { id: individual.id },
            config.get("jwtSecret"),
            {
              expiresIn: 36000,
            },
            (err, token) => {
              if (err) throw err;
              res.json({
                token,
                user: {
                  _id: individual._id,
                  name: individual.name,
                  email: individual.email,
                  permission: 1,
                },
              });
            }
          );
        });
      });
    } else {
      res.json({ msg: "No User Found" });
    }
  });
});

// @route GET api/auth/user
// @desc Get User Data
// @access Private
router.get("/user", auth, (req, res) => {
  User.findOne({ userId: req.user.id }).then((user) => {
    if (user.type === "company") {
      Company.findOne({ _id: req.user.id })
        .select(["-password"])
        .then((company) => {
          return res.json(company);
        });
    } else if (user.type === "individual") {
      Individual.findOne({ _id: req.user.id })
        .select(["-password"])
        .then((individual) => {
          return res.json(individual);
        });
    }
  });
});

module.exports = router;
