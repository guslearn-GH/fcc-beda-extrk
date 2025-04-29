const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
require("dotenv").config({ path: __dirname + "/process.env" });
const mongoose = require("mongoose");
mongoose.connect(process.env.MONGO_URI, {
  useNewParser: true,
  useUnifiedTopology: true,
});
let dbConn = mongoose.Connection;
dbConn.once("open", () => Console.log("Connected!!! Exercise NOW!!!"));

let userSchema = mongoose.Schema({
  username: { type: String, required: true },
});
let User = mongoose.model("User", userSchema);

let exerciseSchema = mongoose.Schema({
  username: userSchema.username,
  description: { type: String, required: true },
  duration: { type: Number, required: true },
  date: { type: String, required: false },
});
let Exercise = mongoose.model("Exercise", exerciseSchema);

let logSchema = mongoose.Schema({
  username: userSchema.username,
  count: this.log.length,
  log: [
    {
      description: exerciseSchema.description,
      duration: exerciseSchema.duration,
      date: exerciseSchema.date,
    },
  ],
});

let Log = mongoose.model("Log", logSchema);

app.use(cors());
app.use(express.static("public"));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app
  .route("/api/users")
  .post((req, res) => {
    console.log("CREATE New User!!!");
    console.log("New user: " + req.body.username);
    console.log(User.countDocuments({}));
  })
  .get((req, res) => {
    console.log("LIST ALL users!!!");
  });

app.post("/api/users/:_id/exercises", (req, res) => {
  console.log("CREATE User LOG!!!");
});

app.get("/api/users/:_id/logs", (req, res) => {
  console.log("LIST ALL LOGS of ONE USER!!!");
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
