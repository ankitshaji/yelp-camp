//main file that gets passed in other npm package modules or user created modules
const express = require("express"); //functionObject //express module
const path = require("path"); //pathObject //path module
const app = express(); //appObject
// ********************************************************************************
//main express application/appObject - (RESTful) webApi - webApi using REST principles
// *******************************************************************************
//mongoose ODM - has callback but also supports promises-ie returns promiseObject (pending,undefined) to -resove(value)(fullfulled,value) or reject(errorMessage)(rejected,errorMessage)
const mongoose = require("mongoose"); //mongooseObject //mongoose module
const CampgroundClassObject = require("./models/campground"); //CampgroundtClassObject(ie Model) //self created module/file needs "./"
const ReviewClassObject = require("./models/review"); //ReviewClassObject(ie Model) //self created module/file needs "./"
const methodOverride = require("method-override"); //functionObject //method-override module
const ejsMateEngine = require("ejs-mate"); //functionObject(ie ejsEngine) //ejs-mate module
const CustomErrorClassObject = require("./utils/CustomError"); //CustomErrorClassObject //self created module/file needs "./"
const catchAsync = require("./utils/catchAsync"); //functionObject //self create modeul/file needs "./"
const {
  joiCampgroundSchemaObject,
  joiReviewSchemaObject,
} = require("./joiSchemas"); //exportObject.property //self create modeul/file needs "./"
const campgroundsRoutes = require("./routes/campgrounds"); //custom routerObject //self created module/file needs "./"

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

// ****************************************************************************************************************************************************************************************
//(Third party)middleware(hook) function expressions and (express built-in) middleware(hook)methods and (custom) middleware(hook)function expressions - Order matters for next() execution
// ****************************************************************************************************************************************************************************************
//(Application-level middleware) - bind middlewareCallback to appObject with app.use() or app.method()
//case 1  - app.use(middlewareCallback) lets us execute middlewareCallback on any http method/every (http structured) request to any path
//case 2 - app.use("pathString"-ie /resource,middlewareCallback) lets us execute middlewareCallback on any http method/every (http structured) request to specific path/resource
//case 3 - app.use("pathPrefixString",custom routerObject(ie middlewareCallback)) lets us execute custom routerObject(ie middelwareCallback) on any http method/every (http structured) request to specific path/resource

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
const validateReview = (req, res, next) => {
  //req.body.review can have undefined value if sent from postman
  //server side validation check - (import joiReviewSchemaObject)

  //passing reqBodyObject through joiReviewSchemaObject
  //joiReviewSchemaObject.method(reqBodyObject) creates object
  //key to variable - no property/undefined if no validation error - object destructuring
  const { error } = joiReviewSchemaObject.validate(req.body);
  if (error) {
    //error.details is an objectArrayObject//objectArrayObject.map(callback)->stringArrayObject.join("seperator")->string
    const msg = error.details.map((el) => el.message).join(",");
    //explicitly throw new CustomErrorClassObject("message",statusCode)
    throw new CustomErrorClassObject(msg, 400);
    //implicite next(customErrorClassInstanceObject) passes customErrorClassInstanceObject to next errorHandlerMiddlewareCallback
  }
  next(); //passing to next middlewareCallback
};

// ***************************************************************************************************************************************************************
//Using RESTful webApi crud operations pattern (route/pattern matching algorithm - order matters) + MongoDB CRUD Operations using mongoose-ODM (modelClassObject)
// ***************************************************************************************************************************************************************

//***************************************************************************************************************************************************
//Grouping diffrent sets of routes using custom routerObject (ie middlewareCallback) - combining mini express application/routerObject to main express application/appObject
//***************************************************************************************************************************************************

//**********************************
//Grouped set of CAMPGROUNDS ROUTES
//**********************************
//httpMethod=All,path/resource-/campgrounds -(direct match/exact path)
//appObject.use("pathPrefixString",custom routerObject(ie middlewareCallback)) lets us execute custom routerObject(middlewareCallback) on any http method/every (http structured) request to specific path/resource
//execute custom routerObject(ie middlewareCallback) if (http structured) ALL request arrives at path /campgrounds
//arguments passed in to custom routerObject(ie middlewareCallback) -
//-if not already converted convert (http structured) request to req jsObject
//-if not already created create res jsObject
//-nextCallback
app.use("/campgrounds", campgroundsRoutes);

//***********
//ROOT ROUTE
//***********
//route root
//httpMethod=GET,path/resource-/(root) -(direct match/exact path)
//(READ) name-home,purpose-display home page
//appObject.method(pathString ,handlerMiddlewareCallback) lets us execute handlerMiddlewareCallback on specifid http method/every (http structured) request to specified path/resource
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

//********************************************************************************************************
//REVIEWS ROUTES using NESTED ROUTING - more than one dynamic variable in path - used to send campground_id
//********************************************************************************************************
//route1
//httpMethod=POST,path/resource-/campgrounds/:id/reviews  -(pattern match) //:id is a path variable
//(CREATE) name-create,purpose-create new document in (reviews)collection of (yemp-camp-db)db
//appObject.method(pathString ,createMiddlewareCallback(async handlerMiddlewareCallback)) lets us execute handlerMiddlewareCallback on specifid http method/every (http structured) request to specified path/resource
//execute handlerMiddlwareCallback if (http structured) POST request arrives at path /campgrounds/:id/reviews
//arguments passed in to handlerMiddlewareCallback -
//-already converted (http structured) request to req jsObject - (http structured) request body contained form data,previous middlewareCallback parsed it to req.body
//-if not already created create res jsObject
//-nextCallback
//async(ie continues running outside code if it hits an await inside) handlerMiddlwareCallback implicit returns promiseObject(resolved,undefined) - can await a promiseObject inside
//async function expression without an await is just a normal syncronous function expression
app.post(
  "/campgrounds/:id/reviews",
  validateReview,
  catchAsync(async (req, res) => {
    //object keys to variable - Object destructuring
    const { id } = req.params; //pathVariablesObject
    // *************************************************
    //READ - querying a collection for a document by id
    // *************************************************
    const foundCampground = await CampgroundClassObject.findById(id);
    // ***************************************************************************************
    //CREATE - creating a single new document in the (reviews) collection of (yelp-camp-db)db
    // ***************************************************************************************
    //modelClass
    //ReviewClassObject(objectArgument-passed to constructor method)
    //objectArgument- jsObject{key:value} ie the new document that abides to collectionSchemaInstanceObject
    //objectArgument has validations/contraints set by collectionSchemaInstanceObject
    //validations/contraints -
    //none
    //create modelInstanceObject(ie document) - with new keyword and ReviewClassObject constructor method
    const newReview = new ReviewClassObject(req.body.review); //form data/req.body is jsObject //{groupKey:{key/name:inputValue,key/name:inputValue}}
    // ****************************************************************************************************************
    //UPDATE - updating foundCampground (ie document)  - ie associate newReview to foundCampground through referencing
    // ****************************************************************************************************************
    //modelInstanceObject.property = arrayObject.push(newReview) //newReview has validations/contraints
    //Seems like pushing on entire newReview(ie document), but we only push on the ID's to arrayObject
    foundCampground.reviews.push(newReview);
    //modelInstance.save() returns promiseObject - pending to resolved(dataObject),rejected(errorObject) ie(breaking validation/contraints)
    //creates (reviews)collection in (yelp-camp-db)db if not existing already and adds (newReview)document into the (reviews)collection
    //implicitly throws new Error("messageFromMongoose") - break validation contraints
    const savedReview = await newReview.save(); //savedReview = dataObject ie created jsObject(document)
    //updates (foundCampground)document in the (campgrounds) collection
    //implicitly throws new Error("messageFromMongoose") - break validation contraints
    const updatedCampground = await foundCampground.save(); //updatedCampground = dataObject ie updated jsObject(document)
    //fix for page refresh sending duplicate (http structured) POST request -
    res.redirect(`/campgrounds/${updatedCampground._id}`);
    //responseObject.redirect("showPath") updates res.header, sets res.statusCode to 302-found ie-redirect ,sets res.location to /campgrounds/:id
    //responseObject.redirect("showPath") - converts and sends res jsObject as (http structure)response // default content-type:text/html
    //thus ending request-response cycle
    //browser sees (http structured) response with headers and makes a (http structured) GET request to location ie default(get)/campgrounds/:id
  })
);

//route2
//httpMethod=DELETE,path/resource-/campgrounds/:id/reviews/:reviewId  -(pattern match) //:id and :reviewId are path variables
//(DELETE) name-destroy,purpose-delete single specific document in (reviews)collection of (yelp-camp-db)db
//appObject.method(pathString ,createMiddlewareCallback(async handlerMiddlewareCallback)) lets us execute handlerMiddlewareCallback on specifid http method/every (http structured) request to specified path/resource
//execute handlerMiddlwareCallback if (http structured) DELETE request arrives at path /campgrounds/:id/reviews/:reviewId
//arguments passed in to handlerMiddlewareCallback -
//-already converted (http structured) request to req jsObject - previous middlewareCallback sets req.method from POST to DELETE and called nextCallback
//-if not already created create res jsObject
//-nextCallback
//async(ie continues running outside code if it hits an await inside) handlerMiddlwareCallback implicit returns promiseObject(resolved,undefined) - can await a promiseObject inside
//async function expression without an await is just a normal syncronous function expression
app.delete(
  "/campgrounds/:id/reviews/:reviewId",
  catchAsync(async (req, res) => {
    //object keys to variable - Object destructuring
    const { id, reviewId } = req.params; //pathVariablesObject
    // ****************************************************************************************************************************************************************************************
    //UPDATE - querying a collection(campgrounds) for a document by id then updating it - ie deleting reviewModeInstance id reference in campgroundModelInstances reviews arrayObject property
    // ****************************************************************************************************************************************************************************************
    //modelClass
    //campgroundClassObject.method(idString,updateObject,optionObject) ie modelClassObject.method() - same as - db.campgrounds.findOneAndUpdate(({_id:ObjectId("12345")},{$pull:{reviews:ObjectId("123123"),...}},{returnNewDocument:true})
    //returns thenableObject - pending to resolved(dataObject),rejected(errorObject) ie(breaking validation/contraints)
    //To run validations/contraints when updating we need to set runValidators(key) in optionsObject
    //To get the jsObject(document) after update, we need to set new(key) in optionsObject
    //queries (campgrounds)collection of (yelp-camp-db)db for single document by idString and updates/replaces the document with updateObject(document)
    //updateObject contains updateOperator - $pull - removes from existing reviews array all instances of reviewId
    //implicitly throws new Error("messageFromMongoose") - invalid ObjectId format/length or break validation constraints
    const updatedCampground = await CampgroundClassObject.findByIdAndUpdate(
      id,
      {
        $pull: { reviews: reviewId },
      },
      { runValidators: true, new: true }
    ); //updatedCampground = dataObject ie single first matching jsObject(document) after it was updated
    // ******************************************************************************
    //DELETE - querying a collection(reviews) for a document by id then deleting it
    // ******************************************************************************
    //modelClass
    //ReviewClassObject.method(idString) ie modelClassObject.method() - same as - db.reviews.findOneAndDelete({_id:ObjectId("12345")})
    //returns thenableObject - pending to resolved(dataObject),rejected(errorObject)
    //queries (reviews)collection of (yelp-camp-db)db for single document by idString and deletes the document
    //implicitly throws new Error("messageFromMongoose") - invalid ObjectId format/length or break validation constraints
    const deletedReview = await ReviewClassObject.findByIdAndDelete(reviewId); //deletedReview = dataObject ie single first matching jsObject(document) that was deleted
    //fix for page refresh sending duplicate (http structured) DELETE request -
    res.redirect(`/campgrounds/${updatedCampground._id}`);
    //responseObject.redirect("showPath") updates res.header, sets res.statusCode to 302-found ie-redirect ,sets res.location to /campgrounds/:id
    //responseObject.redirect("showPath") - converts and sends res jsObject as (http structure)response // default content-type:text/html
    //thus ending request-response cycle
    //browser sees (http structured) response with headers and makes a (http structured) GET request to location ie default(get)/campgrounds/:id
  })
);

//***********
//LAST ROUTE
//***********
//route last
//catch all route - no routes before this was hit or was hit but didnt end req-res cycle
//appObject.use(pathString,handlerMiddlewareCallback) lets us execute handlerMiddlewareCallback on all http method/every (http structured) request to any path/resource
app.all("*", (req, res, next) => {
  next(new CustomErrorClassObject("Page Not Found", 404));
  //pass customErrorClaassInstanceObject to next customErrorHandlerMiddlewareCallback
});

// ************************************
//customErrorHandlerMiddlewareCallback
// ************************************
//appObject.use(customErrorHandlerMiddlewareCallback)
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
