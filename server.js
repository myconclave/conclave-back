const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const config = require("config");
const cors = require("cors");

const app = express();

app.use(cors());
//For Body Parsing
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// DB Config
const db = config.get("mongoURI");

//Connect To Mongo
mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("DB CONNECTED!!!!!!");
  })
  .catch((err) => console.log(err));

//Use Routes
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/download", require("./routes/api/download"));
app.use("/api/education", require("./routes/api/education"));
app.use("/api/experience", require("./routes/api/experience"));
app.use("/api/jobs", require("./routes/api/jobs"));
app.use("/api/network", require("./routes/api/network"));
app.use("/api/paths", require("./routes/api/paths"));
app.use("/api/search", require("./routes/api/search"));
app.use("/api/skills", require("./routes/api/skills"));
app.use("/api/upload", require("./routes/api/upload"));
app.use("/api/users", require("./routes/api/users"));
app.use("/api/userSkills", require("./routes/api/userSkills"));
app.use("/api/profile", require("./routes/api/profile"));
app.use("/api/notifications", require("./routes/api/notifications"));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  res.status(404).send("Sorry can't find that!");
});

// Server Static if in production
if (process.env.NODE_ENV === "production") {
  // Set static folder
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server Started on port: ${port}`);
});
