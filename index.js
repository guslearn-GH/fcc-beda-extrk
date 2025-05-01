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

//gus-note:go back and store user object id as required value?
let exerciseSchema = mongoose.Schema({
  username: { type: String, required: true }, 
  description: { type: String, required: true },
  duration: { type: Number, required: true },
  date: { type: Date, required: false, min:'1901-01-01'},
});
let Exercise = mongoose.model("Exercise", exerciseSchema);


app.use(cors());
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app
  .route("/api/users")
  .post((req, res) => {
    // console.log(req.body);
    // console.log("New user: " + req.body.username);
    //var newUser = 
    User.create({username:req.body.username}).then((data)=>{
      res.json({username:req.body.username, _id:data.id})
    }).catch((err)=>{
      console.error(err);
    })
    console.log("CREATE New User!!!--->DONE");
  })
  .get((req, res) => {
    User.find().then((data) =>{
        res.json(data);
      }).catch((err)=>{if(err){console.error(err);}})    
    console.log("LIST ALL users!!!--->DONE");
  });

app.post("/api/users/:_id/exercises", (req, res) => {
  //example return: {"_id":"68129bb2509d2d00132fcee4","username":"user1","date":"Wed Apr 30 2025","duration":65,"description":"test"}
  User.findById({_id:req.params._id}).then((data)=>{
    console.log(data);
    Exercise.create({username:data.username, 
      description:req.body.description, 
      duration:req.body.duration, 
      date:req.body.date ? new Date(req.body.date) : new Date(), _id : req.params.id})
      .then((created)=>{
        res.json({
          username:data.username, 
          description: created.description,
          duration: Number(created.duration), 
          date: new Date(created.date).toDateString(), 
          _id:req.params.id, 
        })
      }).catch((createErr)=>{console.error(createErr)});
  }).catch((findErr)=>{console.error(findErr);})
  // console.log("Params: " + JSON.stringify(req.params));
  // console.log("Body: " + JSON.stringify(req.body));
  console.log("CREATE User Exercise!!!--->DONE");
});

app.get("/api/users/:_id/logs", (req, res) => {
  //query to find all exercises of given user, put logs together
  var fromDate = req.query.from ? req.query.from : '1900-01-01'
  var toDate = req.query.to ? req.query.to : new Date();
  var limitNum = req.query.limit? req.query.limit : 0;
  console.log("Query: " + JSON.stringify(req.query));

  User.findById({_id:req.params._id}).then((userData)=>{
    Exercise.find({username:userData.username, 
      date:{$gte: new Date(fromDate).toISOString(), $lte: new Date(toDate).toISOString()}})
      .limit(limitNum)
      .then((exerData)=>{
      let resLog = []
      for(var ex of exerData){
        resLog.push({description:ex.description, 
          duration:ex.duration, date:new Date(ex.date).toDateString()})
      }
      res.json({username:userData.username, 
        count:resLog.length, 
        _id:userData.id, 
        log:resLog})
    }).catch((exerErr)=>{if(exerErr){console.error(exerErr)}})
  }).catch((userErr)=>{if(userErr){console.error(userErr)}})
  console.log("Params: " + JSON.stringify(req.params));
  console.log("Query: " + JSON.stringify(req.query));
  console.log("Body: " + JSON.stringify(req.body));
  console.log("LIST ALL LOGS of ONE USER!!!");
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
