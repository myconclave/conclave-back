const express = require("express");
const config = require("config");
const mongoose = require("mongoose");
const router = express.Router();
const mongoDB = require("mongodb");
const uri = config.get("mongoURI");
const Grid = require("gridfs-stream");
eval(
  `Grid.prototype.findOne = ${Grid.prototype.findOne
    .toString()
    .replace("nextObject", "next")}`
);

router.get("/:type/:id", (req, res) => {
  mongoDB.MongoClient.connect(uri, function (error, database) {
    const fileId = mongoose.Types.ObjectId(req.params.id);
    res.set("content-type", "application/pdf");
    res.set("accept-ranges", "bytes");
    var bucket = new mongoDB.GridFSBucket(database.db("jobber"), {
      bucketName: req.params.type,
    });

    const readStream = bucket.openDownloadStream(fileId);

    readStream.on("error", (err) => {
      // report stream error
      console.log(err);
    });
    // the response will be the file itself.
    readStream.pipe(res);
  });
});

module.exports = router;
