const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
require("dotenv").config({ path: __dirname + "/process.env" });
const bodyParser = require("body-parser");

const mongoose = require("mongoose");
mongoose.connect(
  process.env.MONGO_URI
  //{useNewUrlParser: true,useUnifiedTopology: true}
);
const dbConn = mongoose.connection;
dbConn.once("open", () => console.log("Connected!!! Exercise NOW!!!"));

let userSchema = mongoose.Schema({
  username: { type: String, required: true },
});
let User = mongoose.model("User", userSchema);

let exerciseSchema = mongoose.Schema({
  username: { type: String, required: true }, //.username,
  description: { type: String, required: true },
  duration: { type: Number, required: true },
  date: { type: String, required: false },
});
let Exercise = mongoose.model("Exercise", exerciseSchema);

// let logSchema = mongoose.Schema({
//   username: userSchema, //.username,
//   count: this.log.count,
//   log:
//     ([
//       exerciseSchema,
//       // {
//       //   description: exerciseSchema.description,
//       //   duration: exerciseSchema.duration,
//       //   date: exerciseSchema.date,
//       // },
//     ],
//     { type: Array, required: true }),
// });

// let Log = mongoose.model("Log", logSchema);

app.use(cors());
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app
  .route("/api/users")
  .post((req, res) => {
    console.log(req.body);
    console.log("New user: " + req.body.username);
    console.log("CREATE New User!!!");
  })
  .get((req, res) => {
    console.log("LIST ALL users!!!");
  });

app.post("/api/users/:_id/exercises", (req, res) => {
  console.log("Params: " + JSON.stringify(req.params));
  console.log("Body: " + JSON.stringify(req.body));
  console.log("CREATE User LOG!!!");
});

app.get("/api/users/:_id/logs", (req, res) => {
  //query to find all exercises of given user, put logs together
  console.log("Params: " + JSON.stringify(req.params));
  console.log("Body: " + JSON.stringify(req.body));
  console.log("LIST ALL LOGS of ONE USER!!!");
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
