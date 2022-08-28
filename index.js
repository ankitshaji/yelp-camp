//main file of this app that gets other npm package modules or user created modules
// ********************************************************************************
//RESTful webApi - using REST principles
// ********************************************************************************
const express = require("express"); //functionObject //express module
const path = require("path"); //pathObject //path module
const app = express(); //appObject
//mongoose ODM - has callback but also supports promises-ie returns promiseObject (pending,undefined) to -resove(value)(fullfulled,value) or reject(errorMessage)(rejected,errorMessage)
const mongoose = require("mongoose"); //mongooseObject //mongoose module
const Campground = require("./models/campground"); //campgroundtClassObject(ie Model) //self created module/file needs "./"
const methodOverride = require("method-override"); //functionObject //method-override module
const ejsMateEngine = require("ejs-mate"); //functionObject(ie ejsEngine) //ejs-mate module
const CustomErrorClassObject = require("./utils/CustomError"); //CustomErrorClassObject //self created module/file needs "./"
const catchAsync = require("./utils/catchAsync"); //functionObject //self create modeul/file needs "./"
const { campgroundSchemaObject } = require("./schemas"); //exportObject.property //self create modeul/file needs "./"

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
//Catch errors after initial connection
// ******************************************
//mongooseObject.property = connectionObject
const db = mongoose.connection; //db = connectionObject
//connectionObject.method(string,callback)
db.on("error", console.error.bind(console, "connection error:"));

// ******************************************
//Other initializations
// ******************************************
//selecting one of many engines(non default) used to parse/make sense of ejs templating langauge
//ejsMate engine lets us use function expression layout("pathToBoilerplate.ejs")
//we create a layouts directory in views directry for our boilerplate.ejs file
app.engine("ejs", ejsMateEngine);

//when view engine is used express assumes our views ie ejs templates
//exist in a (default)views directory
app.set("view engine", "ejs"); //auto require("ejs")
//change path to absolute path to index.js
app.set("views", path.join(__dirname, "/views"));

// *************************************************************************************************************************************
//(Third party)middleware(hook) function expressions and (express built-in) middleware(hook)methods - Order matters for next() execution
// *************************************************************************************************************************************
//(Application-level middleware) - bind middlewareCallback to appObject with app.use() or app.method()
//app.use(middlewareCallback) - argument is middlewareCallback

//(express built-in)
//expressFunctionObject.middlewareCreationMethod(argument) - argument is object
//middlewareCreationMethod execution creates middlewareCallback
//middlewareCallback - Purpose: Accept form data - (http structured) POST request body parsed to req.body before before moving to next middlewareCallback
//sidenode - (http structure) POST request could be from browser form or postman
app.use(express.urlencoded({ extended: true })); //app.use(middlewareCallback) //app.use() lets us execute middlewareCallback on any http method/every (http structured) request to any path
//middlewareCallback calls next() inside it to move to next middlewareCallback

//(Third party)
//middlewareCreationFunctionObject(argument) - argument is key to look for
//middlewareCreationFunctionObject execution creates middlewareCallback
//middlewareCallback  - Purpose: sets req.method from eg.POST to value of _method key eg.PUT,PATCH,DELETE before moving to next middlewareCallback
//sidenote - ?queryString is (?key=value), therefore _method is key, we set value to it in html form
app.use(methodOverride("_method")); //app.use(middlewareCallback) //app.use() lets us execute middlewareCallback on any http method/every (http structured) request to any path
//middlewareCallback calls next() inside it to move to next middlewareCallback

//(custom middlewareCallback)
//use in specific routes ie specific method and specific path
const validateCampground = (req, res, next) => {
  //req.body.campground can have undefined value if sent from postman
  //server side validation check - (import campgroundSchemaObject)

  //passing reqBodyObject through campgroundSchemaObject
  //campgroundSchemaObject.method(reqBodyObject) creates object
  //key to variable - no property/undefined if no validation error - object destructuring
  const { error } = campgroundSchemaObject.validate(req.body);
  if (error) {
    //error.details is an objectArrayObject//objectArrayObject.map(callback)->stringArrayObject.join("seperator")->string
    const msg = error.details.map((el) => el.message).join(",");
    //explicitly throw new CustomErrorClassObject("message",statusCode)
    throw new CustomErrorClassObject(msg, 400);
    //implicite next(customErrorClassInstanceObject) passes customErrorClassInstanceObject to next errorHandlerMiddlewareCallback
  }
  next(); //passing to next middlewareCallback
};

// *********************************************************************************************************************************************************
//RESTful webApi crud operations pattern (route/pattern matching algorithm - order matters) + MongoDB CRUD Operations using mongoose-ODM (modelClassObject)
// *********************************************************************************************************************************************************

//route1
//httpMethod=GET,path/resource-/(root) -(direct match/exact path)
//(READ) name-home,purpose-display home page
//app.method(pathString ,handlerMiddlewareCallback) lets us execute handlerMiddlewareCallback on specifid http method/every (http structured) request to specified path/resource
//execute handlerMiddlwareCallback if (http structured) GET request arrives at path /
//arguments passed in to handlerMiddlewareCallback -
//-if not already converted convert (http structured) request to req jsObject
//-if not already created create res jsObject
//-nextCallback
app.get("/", (req, res) => {
  res.render("home");
  //render(ejs filePath) - executes js - converts  ejs file into pure html
  //responseObject.render() - converts and sends res jsObject as (http structure)response //content-type:text/html
  //thus ending request-response cycle
});

//route2
//httpMethod=GET,path/resource-/campgrounds -(direct match/exact path)
//(READ) name-index,purpose-display all documents in (campgrounds)collection from (yelp-camp-db)db
//app.method(pathString ,createMiddlewareCallback(async handlerMiddlewareCallback)) lets us execute handlerMiddlewareCallback on specifid http method/every (http structured) request to specified path/resource
//execute handlerMiddlwareCallback if (http structured) GET request arrives at path /campgrounds
//arguments passed in to handlerMiddlewareCallback -
//-if not already converted convert (http structured) request to req jsObject
//-if not already created create res jsObject
//-nextCallback
//async(ie continues running outside code if it hits an await inside) handlerMiddlwareCallback implicit returns promiseObject(resolved,undefined) - can await a promiseObject inside
//async function expression without an await is just a normal syncronous function expression
app.get(
  "/campgrounds",
  catchAsync(async (req, res) => {
    // *****************************************************
    //READ - querying a collection for a document/documents
    // *****************************************************
    //campgroundClassObject.method(queryObject) ie modelClassObject.method() - same as - db.campgrounds.find({})
    //returns thenableObject - pending to resolved(dataObject),rejected(errorObject)
    //implicitly throws new Error("messageFromMongoose")
    const campgrounds = await Campground.find({}); //campgrounds = dataObject ie array of all jsObjects(documents)
    res.render("campgrounds/index", { campgrounds: campgrounds });
    //responseObject.render(ejs filePath,variableObject) - sends variable to ejs file - executes js - converts  ejs file into pure html
    //responseObject.render() - converts and sends res jsObject as (http structure)response //content-type:text/html
    //thus ending request-response cycle
  })
);

//route3
//httpMethod=GET,path/resource-/campgrounds/new  -(direct match/exact path)
//(READ) name-new,purpose-display form to submit new document into (campgrounds)collection of (yelp-camp-db)db
//app.method(pathString ,handlerMiddlewareCallback) lets us execute handlerMiddlewareCallback on specifid http method/every (http structured) request to specified path/resource
//execute handlerMiddlwareCallback if (http structured) GET request arrives at path /campgrounds/new
//arguments passed in to handlerMiddlewareCallback -
//-if not already converted convert (http structured) request to req jsObject
//-if not already created create res jsObject
//-nextCallback
app.get("/campgrounds/new", (req, res) => {
  res.render("campgrounds/new");
  //render(ejs filePath) - executes js - converts  ejs file into pure html
  //responseObject.render() - converts and sends res jsObject as (http structure)response //content-type:text/html
  //thus ending request-response cycle
});

//route4
//httpMethod=GET,path/resource-/campgrounds/:id  -(pattern match) //:id is a path variable
//(READ) name-show,purpose-display single specific document in (campgrounds)collection of (yelp-camp-db)db
//app.method(pathString ,createMiddlewareCallback(async handlerMiddlewareCallback)) lets us execute handlerMiddlewareCallback on specifid http method/every (http structured) request to specified path/resource
//execute handlerMiddlwareCallback if (http structured) GET request arrives at path /campgrounds/:id
//arguments passed in to handlerMiddlewareCallback -
//-if not already converted convert (http structured) request to req jsObject
//-if not already created create res jsObject
//-nextCallback
//async(ie continues running outside code if it hits an await inside) handlerMiddlwareCallback implicit returns promiseObject(resolved,undefined) - can await a promiseObject inside
//async function expression without an await is just a normal syncronous function expression
app.get(
  "/campgrounds/:id",
  catchAsync(async (req, res) => {
    //could use campgroundTitle if it was webSlug(url safe)
    //object keys to variable - Object destructuring
    const { id } = req.params; //pathVariablesObject
    // *************************************************
    //READ - querying a collection for a document by id
    // *************************************************
    //campgroundClassObject.method(idString) ie modelClassObject.method() - same as - db.campgrounds.findOne({_id:"12345"})
    //returns thenableObject - pending to resolved(dataObject),rejected(errorObject)
    //implicitly throws new Error("messageFromMongoose") - invalid ObjectId format/length
    const campground = await Campground.findById(id); //campground = dataObject ie single first matching jsObject(document)
    res.render("campgrounds/show", { campground: campground });
    //responseObject.render(ejs filePath,variableObject) - sends variable to ejs file - executes js - converts  ejs file into pure html
    //responseObject.render() - converts and sends res jsObject as (http structure)response //content-type:text/html
    //thus ending request-response cycle
  })
);

//route5
//httpMethod=POST,path/resource-/campgrounds  -(direct match/exact path)
//(CREATE) name-create,purpose-create new document in (campgrounds)collection of (yelp-camp-db)db
//app.method(pathString ,createMiddlewareCallback(async handlerMiddlewareCallback)) lets us execute handlerMiddlewareCallback on specifid http method/every (http structured) request to specified path/resource
//execute handlerMiddlwareCallback if (http structured) POST request arrives at path /campgrounds
//arguments passed in to handlerMiddlewareCallback -
//-already converted (http structured) request to req jsObject - (http structured) request body contained form data,previous middlewareCallback parsed it to req.body
//-if not already created create res jsObject
//-nextCallback
//async(ie continues running outside code if it hits an await inside) handlerMiddlwareCallback implicit returns promiseObject(resolved,undefined) - can await a promiseObject inside
//async function expression without an await is just a normal syncronous function expression
app.post(
  "/campgrounds",
  validateCampground,
  catchAsync(async (req, res, next) => {
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
    //implicitly throws new Error("messageFromMongoose") - break validation contraints
    const savedCampground = await newCampground.save(); //savedCampground = dataObject ie created jsObject(document)
    //fix for page refresh sending duplicate (http structured) POST request -
    res.redirect(`/campgrounds/${newCampground._id}`);
    //responseObject.redirect("showPath") updates res.header, sets res.statusCode to 302-found ie-redirect ,sets res.location to /campgrounds/:id
    //responseObject.redirect("showPath") - converts and sends res jsObject as (http structure)response // default content-type:text/html
    //thus ending request-response cycle
    //browser sees (http structured) response with headers and makes a (http structured) GET request to location ie default(get)/campgrounds/:id
  })
);

//route6
//httpMethod=GET,path/resource-/campgrounds/:id/edit  -(pattern match) //:id is a path variable
//(READ) name-edit,purpose-display form to edit existing document in (campgrounds)collection of (yelp-camp-db)db
//app.method(pathString ,createMiddlewareCallback(async handlerMiddlewareCallback)) lets us execute handlerMiddlewareCallback on specifid http method/every (http structured) request to specified path/resource
//execute handlerMiddlwareCallback if (http structured) GET request arrives at path /campgrounds/:id/edit
//arguments passed in to handlerMiddlewareCallback -
//-if not already converted convert (http structured) request to req jsObject
//-if not already created create res jsObject
//-nextCallback
app.get(
  "/campgrounds/:id?/edit",
  catchAsync(async (req, res) => {
    //could use campgroundTitle if it was webSlug(url safe)
    //object keys to variable - Object destructuring
    const { id } = req.params; //pathVariablesObject
    // ***********************************************************
    //READ - querying a collection(campgrounds) for a document by id
    // ***********************************************************
    //campgroundClassObject.method(idString) ie modelClassObject.method() - same as - db.campgrounds.findOne({_id:"12345"})
    //returns thenableObject - pending to resolved(dataObject),rejected(errorObject)
    //implicitly throws new Error("messageFromMongoose") - invalid ObjectId format/length
    const foundCampground = await Campground.findById(id); //foundCampground = dataObject ie single first matching jsObject(document)
    //passing in foundCampground to prepoppulate form
    res.render("campgrounds/edit", { campground: foundCampground });
    //responseObject.render(ejs filePath,variableObject) - sends renamed variable to ejs file - executes js - converts  ejs file into pure html
    //responseObject.render() - converts and sends res jsObject as (http structure)response //content-type:text/html
    //thus ending request-response cycle
  })
);

//route7
//httpMethod=PUT,path/resource-/campgrounds/:id  -(pattern match) //:id is a path variable
//(UPDATE) name-update,purpose-completely replace/update single specific existing document in (campgrounds)collection of (yelp-camp-db)db
//app.method(pathString ,createMiddlewareCallback(async handlerMiddlewareCallback)) lets us execute handlerMiddlewareCallback on specifid http method/every (http structured) request to specified path/resource
//execute handlerMiddlwareCallback if (http structured) PUT request arrives at path /campgrounds/:id
//arguments passed in to handlerMiddlewareCallback -
//-already converted (http structured) request to req jsObject
//ie.(http structured) request body contained form data,the before previous middlewareCallback parsed it to req.body then called next middlewareCallback
//that middlewareCallback ie.previous sets req.method from POST to PUT and called nextCallback
//-if not already created create res jsObject
//-nextCallback
//async(ie continues running outside code if it hits an await inside) handlerMiddlwareCallback implicit returns promiseObject(resolved,undefined) - can await a promiseObject inside
//async function expression without an await is just a normal syncronous function expression
app.put(
  "/campgrounds/:id",
  validateCampground,
  catchAsync(async (req, res) => {
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
    //implicitly throws new Error("messageFromMongoose") - invalid ObjectId format/length or break validation constraints
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
    //responseObject.redirect("showPath") updates res.header, sets res.statusCode to 302-found ie-redirect ,sets res.location to /campgrounds/:id
    //responseObject.redirect("showPath") - converts and sends res jsObject as (http structure)response // default content-type:text/html
    //thus ending request-response cycle
    //browser sees (http structured) response with headers and makes a (http structured) GET request to location ie default(get)/campgrounds/:id
  })
);

//route8
//httpMethod=DELETE,path/resource-/campgrounds/:id  -(pattern match) //:id is a path variable
//(DELETE) name-destroy,purpose-delete single specific document in (campgrounds)collection of (yelp-camp-db)db
//app.method(pathString ,createMiddlewareCallback(async handlerMiddlewareCallback)) lets us execute handlerMiddlewareCallback on specifid http method/every (http structured) request to specified path/resource
//execute handlerMiddlwareCallback if (http structured) DELETE request arrives at path /campgrounds/:id
//arguments passed in to handlerMiddlewareCallback -
//-already converted (http structured) request to req jsObject - previous middlewareCallback sets req.method from POST to PUT and called nextCallback
//-if not already created create res jsObject
//-nextCallback
//async(ie continues running outside code if it hits an await inside) handlerMiddlwareCallback implicit returns promiseObject(resolved,undefined) - can await a promiseObject inside
//async function expression without an await is just a normal syncronous function expression
app.delete(
  "/campgrounds/:id",
  catchAsync(async (req, res) => {
    //object keys to variable - Object destructuring
    const { id } = req.params; //pathVariablesObject
    // ******************************************************************************
    //DELETE - querying a collection(campgrounds) for a document by id then deleting it
    // ******************************************************************************
    //modelClass
    //campgroundClassObject.method(idString) ie modelClassObject.method() - same as - db.campgrounds.findOneAndDelete(({_id:"12345"})
    //returns thenableObject - pending to resolved(dataObject),rejected(errorObject)
    //queries (campgrounds)collection of (yelp-camp-db)db for single document by idString and deletes the document
    //implicitly throws new Error("messageFromMongoose") - invalid ObjectId format/length or break validation constraints
    const deletedCampground = await Campground.findByIdAndDelete(id); //deletedCampground = dataObject ie single first matching jsObject(document) that was deleted
    //fix for page refresh sending duplicate (http structured) DELETE request -
    res.redirect("/campgrounds");
    //responseObject.redirect("indexPath") updates res.header, sets res.statusCode to 302-found ie-redirect ,sets res.location to /campgrounds
    //responseObject.redirect("indexPath") - converts and sends res jsObject as (http structure)response // default content-type:text/html
    //thus ending request-response cycle
    //browser sees (http structured) response with headers and makes a (http structured) GET request to location ie default(get)/campgrounds
  })
);

//route9
//catch all route - no routes before this was hit or was hit but didnt end req-res cycle
//app.method(pathString,handlerMiddlewareCallback) lets us execute handlerMiddlewareCallback on all http method/every (http structured) request to any path/resource
app.all("*", (req, res, next) => {
  next(new CustomErrorClassObject("Page Not Found", 404));
  //pass customErrorClaassInstanceObject to next customErrorHandlerMiddlewareCallback
});

// ************************************
//customErrorHandlerMiddlewareCallback
// ************************************
//app.use(customErrorHandlerMiddlewareCallback)
//customErrorHandlerMiddlewareCallback takes in 4 arguments -(errorClassInstanceObject/customErrorClassInstanceObject,resObject,reqObject,nextCallback)
app.use((err, req, res, next) => {
  //customeErrorClassInstanceObject has property statusCode, errorClassInstanceObject's statusCode property is undefined
  //both instances have a message property + other methods and properties such as stack
  //key to variable + set default values if undefined - object destructuring
  const { statusCode = 500 } = err; //errorClassInstanceObject
  // res.statusMessage = "I can edit this instead of being auto set from status";
  res.status(statusCode).render("error", { err: err });
  //responseObject.render(ejs filePath,variableObject) - sends variable to ejs file - executes js - converts ejs file into pure html
  //responseObject.render() - converts and sends res jsObject as (http structured) response //content-type:text/html
  //thus ending request-response cycle
  //next(errorClassInstanceObject); //could pass errorClassInstanceObject to defaultErrorHandlerMiddlewareCallback(invisible)
});

//**************************************************
//INVISIBLE - defaultErrorHandlerMiddlewareCallback
//**************************************************

//address - localhost:3000
//appObject.method(port,callback) binds app to port
//execute callback when appObject start listening for (http structured) requests at port
app.listen(3000, () => {
  console.log("Listening on port 3000");
});
