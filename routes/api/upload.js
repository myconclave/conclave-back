const express = require("express");
const router = express.Router();
const mongoDB = require("mongodb");
const config = require("config");
const multer = require("multer");
const { Readable } = require("stream");
const Resume = require("../../models/Resume");
const Picture = require("../../models/Picture");
const uri = config.get("mongoURI");

const storage = multer.memoryStorage();
const uploads = multer({
  storage: storage,
  limits: { fields: 1, fileSize: 6000000, files: 1, parts: 2 },
});

router.get("/:type/:id", (req, res) => {
  if (req.params.type === "resume") {
    Resume.findOne({ userId: req.params.id }).then((result) => {
      res.json(result);
    });
  }
  if (req.params.type === "picture") {
    Picture.findOne({ userId: req.params.id }).then((result) => {
      res.json(result);
    });
  }
});

router.put("/:type/:id", uploads.single("media_file"), async (req, res) => {
  let fileName = req.file.originalname;

  const readableFileStream = new Readable();
  readableFileStream.push(req.file.buffer);
  readableFileStream.push(null);

  mongoDB.MongoClient.connect(uri, function (error, database) {
    var bucket = new mongoDB.GridFSBucket(database.db("jobber"), {
      bucketName: req.params.type,
    });
    let uploadStream = bucket.openUploadStream(fileName);
    let id = uploadStream.id;
    readableFileStream.pipe(uploadStream);

    uploadStream.on("error", () => {
      return res.status(500).json({ msg: "Error uploading file" });
    });

    if (req.params.type === "picture") {
      Picture.updateOne(
        { userId: req.params.id },
        {
          $set: {
            userId: req.params.id,
            fileId: id,
            fileName: req.file.originalname,
            fileType: req.file.mimetype,
          },
        },
        { upsert: true }
      ).then((result) => {
        return;
      });
    }
    if (req.params.type === "resume") {
      Resume.updateOne(
        { userId: req.params.id },
        {
          $set: {
            userId: req.params.id,
            fileId: id,
            fileName: req.file.originalname,
            fileType: req.file.mimetype,
          },
        },
        { upsert: true }
      ).then((result) => {
        return;
      });
    }

    uploadStream.on("finish", () => {
      return res.status(201).json({
        msg: fileName + " uploaded successfully",
      });
    });
  });
});

module.exports = router;
