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

//httpMethod=GET,path/resource-/(root) -(direct match/exact path)
//(READ) name-home,purpose-display home page
//execute callback when http structure request arrives
//convert (http structured) request to req jsObject + create res jsObject
app.get("/", (req, res) => {
  res.render("home"); //(ejs filePath)
  //render() - executes js - converts  ejs file into pure html
  //render() - converts and sends res jsObject as (http structure)response //content-type:text/html
});

//httpMethod=GET,path/resource-/campgrounds -(direct match/exact path)
//(READ) name-index,purpose-display all documents in (campgrounds)collection from (yelp-camp-db)db
//execute callback when http structure request arrives
//convert (http structured) request to req jsObject + create res jsObject
//async(ie continues running outside code if it hits an await inside) callback implicit returns promiseObject(resolved,undefined) - can await a promiseObject inside
//async function expression without an await is just a normal syncronous function expression
app.get("/campgrounds", async (req, res) => {
  // *****************************************************
  //READ - querying a collection for a document/documents
  // *****************************************************
  //campgroundClassObject.method(queryObject) ie modelClassObject.method() - same as - db.campgrounds.find({})
  //returns thenableObject - pending to resolved(dataObject),rejected(errorObject)
  const campgrounds = await Campground.find({}); //campgrounds = dataObject ie array of all jsObjects(documents)
  res.render("campgrounds/index", { campgrounds: campgrounds }); //(ejs filePath,variable sent to ejs)
  //render() - executes js - converts  ejs file into pure html
  //render() - converts and sends res jsObject as (http structure)response //content-type:text/html
});

//httpMethod=GET,path/resource-/campgrounds/:id  -(pattern match) //:id is a path variable
//(READ) name-show,purpose-display single specific document in (campgrounds)collection of (yelp-camp-db)db
//execute callback when http structure request arrives
//convert (http structured) request to req jsObject + create res jsObject
//async(ie continues running outside code if it hits an await inside) callback implicit returns promiseObject(resolved,undefined) - can await a promiseObject inside
//async function expression without an await is just a normal syncronous function expression
app.get("/campgrounds/:id", async (req, res) => {
  //could use campgroundTitle if it was webSlug(url safe)
  //object keys to variable - Object destructuring
  const { id } = req.params; //pathVariablesObject
  // *************************************************
  //READ - querying a collection for a document by id
  // *************************************************
  //campgroundClassObject.method(idString) ie modelClassObject.method() - same as - db.campgrounds.findOne({_id:"12345"})
  //returns thenableObject - pending to resolved(dataObject),rejected(errorObject)
  const campground = await Campground.findById(id); //campground = dataObject ie single first matching jsObject(document)
  res.render("campgrounds/show", { campground: campground }); //(ejs filePath,variable sent to ejs)
  //render() - executes js - converts  ejs file into pure html
  //render() - converts and sends res jsObject as (http structure)response //content-type:text/html
});

//address - localhost:3000
//appObject.method(port,callback) binds app to port
//execute callback when appObject start listening for (http structured) requests at port
app.listen(3000, () => {
  console.log("Listening on port 3000");
});
