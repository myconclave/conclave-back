const express = require("express");
const bcrypt = require("bcryptjs");
const config = require("config");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const mongoose = require("mongoose");
// const auth = require("../../middleware/auth");

const router = express.Router();

//User Model
const Users = require("../../models/User");
const Network = require("../../models/Network");
const Education = require("../../models/Education");
const Experience = require("../../models/Experience");
const Company = require("../../models/Company");
const Individuals = require("../../models/Individuals");

// @route GET All api/users
// @desc Get all Users
// @access Public
router.get("/:type/:id", async (req, res) => {
  const currentUserId = req.params.id;
  const excludeUser = [mongoose.Types.ObjectId(currentUserId)];
  await Network.findOne({ userId: currentUserId }).then((res) => {
    res &&
      res.network.forEach((data) => {
        excludeUser.push(data);
      });
  });
  if (req.params.type === "individuals") {
    Individuals.aggregate([
      {
        $match: {
          _id: {
            $nin: excludeUser,
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
  }
  if (req.params.type === "companies") {
    Company.aggregate([
      {
        $match: {
          _id: {
            $nin: excludeUser,
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
  }
});

// @route POST api/users
// @desc Register User
// @access Public
router.post("/", (req, res) => {
  const {
    name,
    email,
    password,
    registerAs,
    status,
    headline,
    company,
    position,
    institute,
    field,
    degree,
  } = req.body;

  //Company Registration
  if (registerAs === "company") {
    if (!name || !email || !password || !headline) {
      return res.status(400).json({ msg: "Please enter all fields." });
    }
    Company.findOne({ email }).then((company) => {
      if (company)
        return res.status(400).json({ msg: "Company already exists" });
    });
    const newCompany = new Company({
      name,
      email,
      password,
      permission: 0,
      headline,
    });

    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newCompany.password, salt, (err, hash) => {
        if (err) throw err;
        newCompany.password = hash;
        newCompany.save().then((company) => {
          const newUser = new Users({
            userEmail: email,
            type: "company",
            userId: company._id,
          });
          newUser.save().then((res) => {
            return;
          });
          jwt.sign(
            { id: company._id },
            config.get("jwtSecret"),
            {
              expiresIn: 3600,
            },
            (err, token) => {
              if (err) throw err;
              res.json({
                token,
                company: {
                  id: company._id,
                  name: company.name,
                  email: company.email,
                },
              });
            }
          );
        });
      });
    });
  }

  //User Registration
  if (registerAs === "individual") {
    // Validation
    if (!name || !email || !password || !status || !headline) {
      return res.status(400).json({ msg: "Please enter all fields." });
    }
    if (status === "working") {
      if (!company || !position) {
        return res.status(400).json({ msg: "Please enter all fields." });
      }
    }

    if (status === "studying") {
      if (!institute || !degree || !field) {
        return res.status(400).json({ msg: "Please enter all fields." });
      }
    }
    //Check for existing user
    Individuals.findOne({ email }).then((user) => {
      if (user) return res.status(400).json({ msg: "User already exists" });
      const newIndividual = new Individuals({
        name,
        email,
        password,
        permission: 1,
        headline,
      });

      //Create salt & hash
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newIndividual.password, salt, (err, hash) => {
          if (err) throw err;
          newIndividual.password = hash;
          newIndividual.save().then((user) => {
            const newUser = new Users({
              userEmail: email,
              type: "individual",
              userId: user._id,
            });
            newUser.save().then((res) => {
              return;
            });
            if (status === "studying") {
              const newEducation = new Education({
                userId: user.id,
                school: institute,
                degree,
                studyArea: field,
              });

              newEducation
                .save()
                .then(() => {
                  return;
                })
                .catch((err) => {
                  return res.status(400).json({ msg: "Education Invalid" });
                });
            }
            if (status === "working") {
              const newExperience = new Experience({
                userId: user.id,
                position,
                company,
              });
              newExperience
                .save()
                .then(() => {
                  return;
                })
                .catch((err) => {
                  return res.status(400).json({ msg: "Experience Invalid" });
                });
            }

            jwt.sign(
              { id: user.id },
              config.get("jwtSecret"),
              {
                expiresIn: 3600,
              },
              (err, token) => {
                if (err) throw err;
                res.json({
                  token,
                  user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                  },
                });
              }
            );
          });
        });
      });
    });
  }
});

//@route PUT api/user/skill
//@desc Edit User Skills
//access Private
router.put("/skill", async (req, res) => {
  Individuals.updateOne(
    { _id: req.body.id },
    { $set: { skills: req.body.data } },
    { upsert: true }
  )
    .then((result) => {
      res.status(200).send({ msg: "Skills Updated Successfully" });
    })
    .catch((err) => res.status(404).json({ msg: "Unable to Update Skills" }));
});

//@route PUT api/user/about
//@desc Edit User About
//access Private
router.put("/about", async (req, res) => {
  Individuals.updateOne(
    { _id: req.body.id },
    { $set: { about: req.body.data } },
    { upsert: true }
  )
    .then((result) => {
      res.status(200).send({ msg: "About Updated Successfully" });
    })
    .catch((err) => res.status(404).json({ msg: "Unable to Update About" }));
});

//@route PUT api/user
//@desc Edit User
//access Private
router.put("/:id", async (req, res) => {
  Individuals.updateOne({ _id: req.params.id }, { $set: req.body })
    .then((result) => {
      res.status(200).send({ msg: "Updated Successfully " });
    })
    .catch((err) => res.status(404).json({ success: false }));
});

module.exports = router;
