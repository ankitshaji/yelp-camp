//main file of this app that gets other npm package modules or user created modules

//RESTful webApi - using REST principles
const express = require("express"); //functionObject //express module
const path = require("path"); //pathObject //path module
const app = express(); //appObject
//mongoose ODM - has callback but also supports promises-ie returns promiseObject (pending,undefined) to -resove(value)(fullfulled,value) or reject(errorMessage)(rejected,errorMessage)
const mongoose = require("mongoose"); //mongooseObject //mongoose module
const Campground = require("./models/campground"); //campgroundtClassObject(ie Model) //self created module/file needs "./"

// ********************************************************************************
// CONNECT - nodeJS runtime app connects to default mogod server port + creates db
// ********************************************************************************
//async(ie continues running outside code if it hits an await inside) named function expression
//implicit returns promiseObject(resolved,undefined) - can await a promiseObject inside
//async function expression without an await is just a normal syncronous function expression
async function main() {
  try {
    //mongooseObject.method(url/defaultPortNo/databaseToUse) //returns promiseObject pending
    await mongoose.connect("mongodb://localhost:27017/yelp-camp-db");
    //promisObject resolved
    console.log("Database Connected");
  } catch (err) {
    //promisObject rejected
    //catches any initial error that occure when establising connection
    console.log("Mongo intial connection error has occured");
    console.log(err);
  }
}
main(); //execute async named function expression
//Dont need to wait for promiseObject to resolve - Operation Buffering
//mongoose lets us use models immediately after,without waiting for mongoose to eastablish a connection to MongoDB

// ******************************************
//catches any error after initial connection
// ******************************************
//mongooseObject.property = connectionObject
const db = mongoose.connection; //db = connectionObject
//connectionObject.method(string,callback)
db.on("error", console.error.bind(console, "connection error:"));

//when view engine is used express assumes our views ie ejs templates
//exist in a (default)views directory
app.set("view engine", "ejs"); //auto require("ejs")
//change path to absolute path to index.js
app.set("views", path.join(__dirname, "/views"));

// *********************************************************************************************************************************************************
//RESTful webApi crud operations pattern (route/pattern matching algorithm - order matters) + MongoDB CRUD Operations using mongoose-ODM (modelClassObject)
// *********************************************************************************************************************************************************

//test
app.get("/", (req, res) => {
  res.render("home");
});

//test
app.get("/makecampground", async (req, res) => {
  //create modelInstanceObject(document)
  const camp = new Campground({
    title: "My Backyard",
    description: "cheap camping",
  });
  await camp.save(); //create collection + save to document to collection
  res.send(camp);
});

//address - localhost:3000
//appObject.method(port,callback) binds app to port
//execute callback when appObject start listening for (http structured) requests at port
app.listen(3000, () => {
  console.log("Listening on port 3000");
});
