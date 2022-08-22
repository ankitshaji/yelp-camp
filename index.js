//main file of this app that gets other npm package modules or user created modules

//RESTful webApi - using REST principles
const express = require("express"); //functionObject //express module
const path = require("path"); //pathObject //path module
const app = express(); //appObject
//mongoose ODM - has callback but also supports promises-ie returns promiseObject (pending,undefined) to -resove(value)(fullfulled,value) or reject(errorMessage)(rejected,errorMessage)
const mongoose = require("mongoose"); //mongooseObject //mongoose module
const Campground = require("./models/campground"); //campgroundtClassObject(ie Model) //self created module/file needs "./"
const methodOverride = require("method-override"); //functionObject //method-override module
const ejsMateEngine = require("ejs-mate"); //functionObject(ie ejsEngine) //ejs-mate module

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

//selecting one of many engines(non default) used to parse/make sense of ejs templating langauge
//ejsMate engine lets us use function layout("pathToBoilerplate.ejs")
//we create a layouts directory in views directry for our boilerplate.ejs file
app.engine("ejs", ejsMateEngine);

//when view engine is used express assumes our views ie ejs templates
//exist in a (default)views directory
app.set("view engine", "ejs"); //auto require("ejs")
//change path to absolute path to index.js
app.set("views", path.join(__dirname, "/views"));

// *******************************************
//Middleware function expressions and methods
// *******************************************
//Accept form data - expressFunctionObject.middlewareMethod() - (http structured) POST request body parsed to req.body
//(http structure) POST request could be from browser form or postman
app.use(express.urlencoded({ extended: true })); //app.use() executes when any httpMethod/any httpStructured request arrives

//middlewareFunctionObject() - override req.method from eg.POST to value of _method key eg.PUT,PATCH,DELETE
//?queryString - (?key=value) therefore _method is key, we set value to it in html form
app.use(methodOverride("_method")); //app.use() executes when any httpMethod/any httpStructured request arrives

// *********************************************************************************************************************************************************
//RESTful webApi crud operations pattern (route/pattern matching algorithm - order matters) + MongoDB CRUD Operations using mongoose-ODM (modelClassObject)
// *********************************************************************************************************************************************************

//httpMethod=GET,path/resource-/(root) -(direct match/exact path)
//(READ) name-home,purpose-display home page
//execute callback when (http structured) request arrives
//convert (http structured) request to req jsObject + create res jsObject
app.get("/", (req, res) => {
  res.render("home"); //(ejs filePath)
  //render() - executes js - converts  ejs file into pure html
  //render() - converts and sends res jsObject as (http structure)response //content-type:text/html
});

//httpMethod=GET,path/resource-/campgrounds -(direct match/exact path)
//(READ) name-index,purpose-display all documents in (campgrounds)collection from (yelp-camp-db)db
//execute callback when (http structured) request arrives
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

//(http stuctured) GET request to form path - (http structured) response is pure html converted from form ejs file
//httpMethod=GET,path/resource-/campgrounds/new  -(direct match/exact path)
//(READ) name-new,purpose-display form to submit new document into (campgrounds)collection of (yelp-camp-db)db
//execute callback when (http structured) request arrives
//convert (http structured) request to req jsObject + create res jsObject
app.get("/campgrounds/new", (req, res) => {
  res.render("campgrounds/new"); //(ejs filePath)
  //render() - executes js - converts  ejs file into pure html
  //render() - converts and sends res jsObject as (http structure)response //content-type:text/html
});

//httpMethod=GET,path/resource-/campgrounds/:id  -(pattern match) //:id is a path variable
//(READ) name-show,purpose-display single specific document in (campgrounds)collection of (yelp-camp-db)db
//execute callback when (http structured) request arrives
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

//httpMethod=POST,path/resource-/campgrounds  -(direct match/exact path)
//(CREATE) name-create,purpose-create new document in (campgrounds)collection of (yelp-camp-db)db
//execute callback when (http structured) request arrives
//convert (http structured) request to req jsObject + create res jsObject
//http structured request body contains data - middleware parses to req.body
//async(ie continues running outside code if it hits an await inside) callback implicit returns promiseObject(resolved,undefined) - can await a promiseObject inside
//async function expression without an await is just a normal syncronous function expression
app.post("/campgrounds", async (req, res) => {
  // ***************************************************************************************
  //CREATE - creating a single new document in the (campgrounds) collection of (yelp-camp-db)db
  // ***************************************************************************************
  //modelClass
  //campgroundClassObject(objectArgument-passed to constructor method)
  //objectArgument- jsObject{key:value} ie the new document that abides to collectionSchemaInstanceObject
  //objectArgument has validations/contraints set by collectionSchemaInstanceObject
  //validations/contraints -
  //none
  //create modelInstanceObject(ie document) - with new keyword and campgroundClassObject constructor method
  const newCampground = new Campground(req.body.campground); //form data/req.body is jsObject //{groupKey:{key/name:inputValue,key/name:inputValue}}
  //modelInstance.save() returns promiseObject - pending to resolved(dataObject),rejected(errorObject) ie(breaking validation/contraints)
  //creates (campgrounds)collection in (yelp-camp-db)db if not existing already and adds (newCampground)document into the (campgrounds)collection
  const savedCampground = await newCampground.save(); //savedCampground = dataObject ie created jsObject(document)
  //fix for page refresh sending duplicate (http structured) POST request -
  res.redirect(`/campgrounds/${newCampground._id}`);
  //console.dir(res._header); //res.statusCode set to 302-found ie redirect //res.location set to /campgrounds/:id
  //converts and sends res jsObject as (http structure)response //default content-type:text/html
  //browser sees (http structured) response with headers and makes a (http structured) GET request to location ie default(get)/campgrounds/:id
});

//(http stuctured) GET request to form path - (http structured) response is pure html converted from form ejs file
//httpMethod=GET,path/resource-/campgrounds/:id/edit  -(pattern match) //:id is a path variable
//(READ) name-edit,purpose-display form to edit existing document in (campgrounds)collection of (yelp-camp-db)db
//execute callback when (http structured) request arrives
//convert (http structured) request to req jsObject + create res jsObject
//async(ie continues running outside code if it hits an await inside) callback implicit returns promiseObject(resolved,undefined) - can await a promiseObject inside
//async function expression without an await is just a normal syncronous function expression
app.get("/campgrounds/:id?/edit", async (req, res) => {
  //could use campgroundTitle if it was webSlug(url safe)
  //object keys to variable - Object destructuring
  const { id } = req.params; //pathVariablesObject
  // ***********************************************************
  //READ - querying a collection(campgrounds) for a document by id
  // ***********************************************************
  //campgroundClassObject.method(idString) ie modelClassObject.method() - same as - db.campgrounds.findOne({_id:"12345"})
  //returns thenableObject - pending to resolved(dataObject),rejected(errorObject)
  const foundCampground = await Campground.findById(id); //foundCampground = dataObject ie single first matching jsObject(document)
  //passing in foundCampground to prepoppulate form
  res.render("campgrounds/edit", { campground: foundCampground }); //(ejs filePath,renamed variable sent to ejs)
  //render() - executes js - converts  ejs file into pure html
  //render() - converts and sends res jsObject as (http structure)response //content-type:text/html
});

//httpMethod=PUT,path/resource-/campgrounds/:id  -(pattern match) //:id is a path variable
//(UPDATE) name-update,purpose-completely replace/update single specific existing document in (campgrounds)collection of (yelp-camp-db)db
//execute callback when (http structure) request arrives
//convert (http structured) request to req jsObject + create res jsObject
//(http structured) request body contains data - middleware parses to req.body
//async(ie continues running outside code if it hits an await inside) callback implicit returns promiseObject(resolved,undefined) - can await a promiseObject inside
//async function expression without an await is just a normal syncronous function expression
app.put("/campgrounds/:id", async (req, res) => {
  //object keys to variable - Object destructuring
  const { id } = req.params; //pathVariablesObject
  // **************************************************************************************************************
  //UPDATE - querying a collection(campgrounds) for a document by id then updating it + new key:value pairs neglected
  // **************************************************************************************************************
  //modelClass
  //campgroundClassObject.method(idString,updateObject,optionObject) ie modelClassObject.method() - same as - db.campgrounds.findOneAndUpdate(({_id:"12345"},{$set:{name:"x",...}},{returnNewDocument:true})
  //returns thenableObject - pending to resolved(dataObject),rejected(errorObject) ie(breaking validation/contraints)
  //To run validations/contraints when updating we need to set runValidators(key) in optionsObject
  //To get the jsObject(document) after update, we need to set new(key) in optionsObject
  //queries (campgrounds)collection of (yelp-camp-db)db for single document by idString and updates/replaces the document with new updateObject(document)
  const foundCampground = await Campground.findByIdAndUpdate(
    id,
    { ...req.body.campground }, //spreading properties into another object //form data/req.body is jsObject //{groupKey:{key/name:inputValue,key/name:inputValue}}
    {
      runValidators: true,
      new: true,
    }
  ); //foundCampground = dataObject ie single first matching jsObject(document) after it was updated
  //fix for page refresh sending duplicate (http structured) PUT request -
  res.redirect(`/campgrounds/${foundCampground._id}`);
  //console.dir(res._header); //res.statusCode set to 302-found ie redirect //res.location set to /campgrounds/:id
  //converts and sends res jsObject as (http structure)response //default content-type:text/html
  //browser sees (http structured) response with headers and makes a (http structured) get request to location ie default(get)/campgrounds/:id
});

//httpMethod=DELETE,path/resource-/campgrounds/:id  -(pattern match) //:id is a path variable
//(DELETE) name-destroy,purpose-delete single specific document in (campgrounds)collection of (yelp-camp-db)db
//execute callback when (http structure) request arrives
//convert (http structured) request to req jsObject + create res jsObject
//async(ie continues running outside code if it hits an await inside) callback implicit returns promiseObject(resolved,undefined) - can await a promiseObject inside
//async function expression without an await is just a normal syncronous function expression
app.delete("/campgrounds/:id", async (req, res) => {
  //object keys to variable - Object destructuring
  const { id } = req.params; //pathVariablesObject
  // ******************************************************************************
  //DELETE - querying a collection(campgrounds) for a document by id then deleting it
  // ******************************************************************************
  //modelClass
  //campgroundClassObject.method(idString) ie modelClassObject.method() - same as - db.campgrounds.findOneAndDelete(({_id:"12345"})
  //returns thenableObject - pending to resolved(dataObject),rejected(errorObject)
  //queries (campgrounds)collection of (yelp-camp-db)db for single document by idString and deletes the document
  const deletedCampground = await Campground.findByIdAndDelete(id); //deletedCampground = dataObject ie single first matching jsObject(document) that was deleted
  //fix for page refresh sending duplicate (http structured) DELETE request -
  res.redirect("/campgrounds");
  //console.dir(res._header); //res.statusCode set to 302-found ie redirect //res.location set to /campgrounds
  //converts and sends res jsObject as (http structure)response //default content-type:text/html
  //browser sees (http structured) response with headers and makes a (http structured) get request to location ie default(get)/campgrounds
});

//address - localhost:3000
//appObject.method(port,callback) binds app to port
//execute callback when appObject start listening for (http structured) requests at port
app.listen(3000, () => {
  console.log("Listening on port 3000");
});
