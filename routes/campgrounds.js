//user created module file - can contain functionObjects,variable,classObjects etc which we can export
const express = require("express"); //functionObject //express module
const router = express.Router(); //functionObject.method() //routerObject
// ******************************************************************************************
//mini express appliation/routerObject - mini (RESTful) webApi - webApi using REST principles
// *******************************************************************************************
//routerObject is an isolated instance of middlwareCallbacks and routes - (mini express application/routerObject)
const catchAsync = require("../utils/catchAsync"); //functionObject //self create modeul/file needs "./" //going back a directory ..
const CustomErrorClassObject = require("../utils/CustomError"); //CustomErrorClassObject //self created module/file needs "./" //going back a directory ..
const CampgroundClassObject = require("../models/campground"); //CampgroundtClassObject(ie Model) //self created module/file needs "./" //going back a directory ..
const { joiCampgroundSchemaObject } = require("../joiSchemas"); //exportObject.property //self create modeul/file needs "./" //going back a directory ..

// ****************************************************************************************************************************************************************************************
//(Third party)middleware(hook) function expressions and (express built-in) middleware(hook)methods and (custom) middleware(hook)function expressions - Order matters for next() execution
// ****************************************************************************************************************************************************************************************
//(Router-level middleware) - bind middlewareCallback to routerObject with router.use() or router.method()
//case 1  - router.use(middlewareCallback) lets us execute middlewareCallback on any http method/every (http structured) request to any path
//case 2 - router.use("pathString"-ie /resource,middlewareCallback) lets us execute middlewareCallback on any http method/every (http structured) request to specific path/resource

//(custom middlewareCallback)
//use in specific routes ie specific method and specific path
const validateCampground = (req, res, next) => {
  //req.body.campground can have undefined value if sent from postman
  //server side validation check - (import joiCampgroundSchemaObject)

  //passing reqBodyObject through joiCampgroundSchemaObject
  //joiCampgroundSchemaObject.method(reqBodyObject) creates object
  //key to variable - no property/undefined if no validation error - object destructuring
  const { error } = joiCampgroundSchemaObject.validate(req.body);
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
//Using RESTful webApi crud operations pattern (route/pattern matching algorithm - order matters) + MongoDB CRUD Operations using mongoose-ODM (modelClassObject)
// *********************************************************************************************************************************************************

//*******************
//CAMPGROUNDS ROUTES
//*******************

//route1
//httpMethod=GET,path/resource- (pathPrefixString) + / -(direct match/exact path)
//(READ) name-index,purpose-display all documents in (campgrounds)collection from (yelp-camp-db)db
//router.method(pathString ,createMiddlewareCallback(async handlerMiddlewareCallback)) lets us execute handlerMiddlewareCallback on specifid http method/every (http structured) request to specified path/resource
//execute handlerMiddlwareCallback if (http structured) GET request arrives at path (pathPrefixString) + /
//arguments passed in to handlerMiddlewareCallback -
//-if not already converted convert (http structured) request to req jsObject
//-if not already created create res jsObject
//-nextCallback
//async(ie continues running outside code if it hits an await inside) handlerMiddlwareCallback implicit returns promiseObject(resolved,undefined) - can await a promiseObject inside
//async function expression without an await is just a normal syncronous function expression
router.get(
  "/",
  catchAsync(async (req, res) => {
    // *****************************************************
    //READ - querying a collection for a document/documents
    // *****************************************************
    //campgroundClassObject.method(queryObject) ie modelClassObject.method() - same as - db.campgrounds.find({})
    //returns thenableObject - pending to resolved(dataObject),rejected(errorObject)
    //implicitly throws new Error("messageFromMongoose")
    const campgrounds = await CampgroundClassObject.find({}); //campgrounds = dataObject ie array of all jsObjects(documents)
    res.render("campgrounds/index", { campgrounds: campgrounds });
    //responseObject.render(ejs filePath,variableObject) - sends variable to ejs file - executes js - converts  ejs file into pure html
    //resObjects header contains signed cookie created/set by express-sessions middlewareCallback
    //responseObject.render() - converts and sends res jsObject as (http structure)response //content-type:text/html
    //thus ending request-response cycle
  })
);

//route2
//httpMethod=GET,path/resource- (pathPrefixString) + /new  -(direct match/exact path)
//(READ) name-new,purpose-display form to submit new document into (campgrounds)collection of (yelp-camp-db)db
//router.method(pathString ,handlerMiddlewareCallback) lets us execute handlerMiddlewareCallback on specifid http method/every (http structured) request to specified path/resource
//execute handlerMiddlwareCallback if (http structured) GET request arrives at path (pathPrefixString) + /new
//arguments passed in to handlerMiddlewareCallback -
//-if not already converted convert (http structured) request to req jsObject
//-if not already created create res jsObject
//-nextCallback
router.get("/new", (req, res) => {
  res.render("campgrounds/new");
  //render(ejs filePath) - executes js - converts  ejs file into pure html
  //resObjects header contains signed cookie created/set by express-sessions middlewareCallback
  //responseObject.render() - converts and sends res jsObject as (http structure)response //content-type:text/html
  //thus ending request-response cycle
});

//route3
//httpMethod=GET,path/resource- (pathPrefixString) + /:id  -(pattern match) //:id is a path variable
//(READ) name-show,purpose-display single specific document in (campgrounds)collection of (yelp-camp-db)db
//router.method(pathString ,createMiddlewareCallback(async handlerMiddlewareCallback)) lets us execute handlerMiddlewareCallback on specifid http method/every (http structured) request to specified pathPrefixString/resource
//execute handlerMiddlwareCallback if (http structured) GET request arrives at path (pathPrefixString) + /:id
//arguments passed in to handlerMiddlewareCallback -
//-if not already converted convert (http structured) request to req jsObject
//-if not already created create res jsObject
//-nextCallback
//async(ie continues running outside code if it hits an await inside) handlerMiddlwareCallback implicit returns promiseObject(resolved,undefined) - can await a promiseObject inside
//async function expression without an await is just a normal syncronous function expression
router.get(
  "/:id",
  catchAsync(async (req, res) => {
    //could use campgroundTitle if it was webSlug(url safe)
    //object keys to variable - Object destructuring
    const { id } = req.params; //pathVariablesObject
    // *************************************************
    //READ - querying a collection for a document by id
    // *************************************************
    //ModelClassObject.method(idString) - same as - db.campgrounds.findOne({_id:ObjectId("12345")})
    //find modelInstanceObject(ie document) that matches id -> CampgroundClassObject.findById(id) -> returns thenableObject(pending,undefined)
    //thenableObject(resolved,valueObject).queryBuilderMethod("reviews") = new thenableObject(pending,undefined)
    //new thenableObject(pending,undefined) -> finds all modelInstanceObjects(ie documents) from reviews(collection) that have matching id in reviews property
    //the populate("reviews")(queryBuilderMedthod()) then combines its valueObject with the previousValueObject to create the newValueObject
    //thus newValueObject is the output of populating the array of ID's from the previousValueObjects reviews property with the documents in the currentValueObject
    //NOTE - can populate only specific piece of document instead of entire document
    //implicitly throws new Error("messageFromMongoose") - invalid ObjectId format/length
    const foundCampground = await CampgroundClassObject.findById(id).populate(
      "reviews"
    ); //foundCampground = dataObject ie single first matching jsObject(document)
    res.render("campgrounds/show", { campground: foundCampground }); //passing in foundCampground with reviews property populated
    //responseObject.render(ejs filePath,variableObject) - sends variable to ejs file - executes js - converts  ejs file into pure html
    //resObjects header contains signed cookie created/set by express-sessions middlewareCallback
    //responseObject.render() - converts and sends res jsObject as (http structure)response //content-type:text/html
    //thus ending request-response cycle
  })
);

//route4
//httpMethod=POST,path/resource- (pathPrefixString) + /  -(direct match/exact path)
//(CREATE) name-create,purpose-create new document in (campgrounds)collection of (yelp-camp-db)db
//router.method(pathString ,createMiddlewareCallback(async handlerMiddlewareCallback)) lets us execute handlerMiddlewareCallback on specifid http method/every (http structured) request to specified path/resource
//execute handlerMiddlwareCallback if (http structured) POST request arrives at path (pathPrefixString) + /
//arguments passed in to handlerMiddlewareCallback -
//-already converted (http structured) request to req jsObject - (http structured) request body contained form data,previous middlewareCallback parsed it to req.body
//-if not already created create res jsObject
//-nextCallback
//async(ie continues running outside code if it hits an await inside) handlerMiddlwareCallback implicit returns promiseObject(resolved,undefined) - can await a promiseObject inside
//async function expression without an await is just a normal syncronous function expression
router.post(
  "/",
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
    const newCampground = new CampgroundClassObject(req.body.campground); //form data/req.body is jsObject //{groupKey:{key/name:inputValue,key/name:inputValue}}
    //auto creates empty reviews arrayObject property
    //modelInstance.save() returns promiseObject - pending to resolved(dataObject),rejected(errorObject) ie(breaking validation/contraints)
    //creates (campgrounds)collection in (yelp-camp-db)db if not existing already and adds (newCampground)document into the (campgrounds)collection
    //implicitly throws new Error("messageFromMongoose") - break validation contraints
    const savedCampground = await newCampground.save(); //savedCampground = dataObject ie created jsObject(document)
    req.flash("success", "Successfully made a new campground!"); //stores the "messageValue" in an arrayObject in the flash property of current sessoinObject under the key "categoryKey"
    //fix for page refresh sending duplicate (http structured) POST request -
    res.redirect(`/campgrounds/${newCampground._id}`);
    //responseObject.redirect("showPath") updates res.header, sets res.statusCode to 302-found ie-redirect ,sets res.location to /campgrounds/:id
    //resObjects header contains signed cookie created/set by express-sessions middlewareCallback
    //responseObject.redirect("showPath") - converts and sends res jsObject as (http structure)response // default content-type:text/html
    //thus ending request-response cycle
    //browser sees (http structured) response with headers and makes a (http structured) GET request to location ie default(get)/campgrounds/:id
  })
);

//route5
//httpMethod=GET,path/resource- (pathPrefixString) + /:id/edit  -(pattern match) //:id is a path variable
//(READ) name-edit,purpose-display form to edit existing document in (campgrounds)collection of (yelp-camp-db)db
//router.method(pathString ,createMiddlewareCallback(async handlerMiddlewareCallback)) lets us execute handlerMiddlewareCallback on specifid http method/every (http structured) request to specified path/resource
//execute handlerMiddlwareCallback if (http structured) GET request arrives at path (pathPrefixString) + /:id/edit
//arguments passed in to handlerMiddlewareCallback -
//-if not already converted convert (http structured) request to req jsObject
//-if not already created create res jsObject
//-nextCallback
router.get(
  "/:id?/edit",
  catchAsync(async (req, res) => {
    //could use campgroundTitle if it was webSlug(url safe)
    //object keys to variable - Object destructuring
    const { id } = req.params; //pathVariablesObject
    // ***********************************************************
    //READ - querying a collection(campgrounds) for a document by id
    // ***********************************************************
    //campgroundClassObject.method(idString) ie modelClassObject.method() - same as - db.campgrounds.findOne({_id:ObjectId("12345")})
    //returns thenableObject - pending to resolved(dataObject),rejected(errorObject)
    //implicitly throws new Error("messageFromMongoose") - invalid ObjectId format/length
    const foundCampground = await CampgroundClassObject.findById(id); //foundCampground = dataObject ie single first matching jsObject(document)
    //passing in foundCampground to prepoppulate form
    res.render("campgrounds/edit", { campground: foundCampground });
    //responseObject.render(ejs filePath,variableObject) - sends renamed variable to ejs file - executes js - converts  ejs file into pure html
    //resObjects header contains signed cookie created/set by express-sessions middlewareCallback
    //responseObject.render() - converts and sends res jsObject as (http structure)response //content-type:text/html
    //thus ending request-response cycle
  })
);

//route6
//httpMethod=PUT,path/resource- (pathPrefixString) + /:id  -(pattern match) //:id is a path variable
//(UPDATE) name-update,purpose-completely replace/update single specific existing document in (campgrounds)collection of (yelp-camp-db)db
//router.method(pathString ,createMiddlewareCallback(async handlerMiddlewareCallback)) lets us execute handlerMiddlewareCallback on specifid http method/every (http structured) request to specified path/resource
//execute handlerMiddlwareCallback if (http structured) PUT request arrives at path (pathPrefixString) + /:id
//arguments passed in to handlerMiddlewareCallback -
//-already converted (http structured) request to req jsObject
//ie.(http structured) request body contained form data,the before previous middlewareCallback parsed it to req.body then called next middlewareCallback
//that middlewareCallback ie.previous sets req.method from POST to PUT and called nextCallback
//-if not already created create res jsObject
//-nextCallback
//async(ie continues running outside code if it hits an await inside) handlerMiddlwareCallback implicit returns promiseObject(resolved,undefined) - can await a promiseObject inside
//async function expression without an await is just a normal syncronous function expression
router.put(
  "/:id",
  validateCampground,
  catchAsync(async (req, res) => {
    //object keys to variable - Object destructuring
    const { id } = req.params; //pathVariablesObject
    // **************************************************************************************************************
    //UPDATE - querying a collection(campgrounds) for a document by id then updating it + new key:value pairs neglected
    // **************************************************************************************************************
    //modelClass
    //campgroundClassObject.method(idString,updateObject,optionObject) ie modelClassObject.method() - same as - db.campgrounds.findOneAndUpdate(({_id:ObjectId("12345")},{$set:{name:"x",...}},{returnNewDocument:true})
    //returns thenableObject - pending to resolved(dataObject),rejected(errorObject) ie(breaking validation/contraints)
    //To run validations/contraints when updating we need to set runValidators(key) in optionsObject
    //To get the jsObject(document) after update, we need to set new(key) in optionsObject
    //queries (campgrounds)collection of (yelp-camp-db)db for single document by idString and updates/replaces the document with new updateObject(document)
    //implicitly throws new Error("messageFromMongoose") - invalid ObjectId format/length or break validation constraints
    const updatedCampground = await CampgroundClassObject.findByIdAndUpdate(
      id,
      { ...req.body.campground }, //spreading properties into another object //form data/req.body is jsObject //{groupKey:{key/name:inputValue,key/name:inputValue}}
      {
        runValidators: true,
        new: true,
      }
    ); //updatedCampground = dataObject ie single first matching jsObject(document) after it was updated
    //fix for page refresh sending duplicate (http structured) PUT request -
    res.redirect(`/campgrounds/${updatedCampground._id}`);
    //responseObject.redirect("showPath") updates res.header, sets res.statusCode to 302-found ie-redirect ,sets res.location to /campgrounds/:id
    //resObjects header contains signed cookie created/set by express-sessions middlewareCallback
    //responseObject.redirect("showPath") - converts and sends res jsObject as (http structure)response // default content-type:text/html
    //thus ending request-response cycle
    //browser sees (http structured) response with headers and makes a (http structured) GET request to location ie default(get)/campgrounds/:id
  })
);

//route7
//httpMethod=DELETE,path/resource- (pathPrefixString) + /:id  -(pattern match) //:id is a path variable
//(DELETE) name-destroy,purpose-delete single specific document in (campgrounds)collection of (yelp-camp-db)db
//router.method(pathString ,createMiddlewareCallback(async handlerMiddlewareCallback)) lets us execute handlerMiddlewareCallback on specifid http method/every (http structured) request to specified path/resource
//execute handlerMiddlwareCallback if (http structured) DELETE request arrives at path (pathPrefixString) + /:id
//arguments passed in to handlerMiddlewareCallback -
//-already converted (http structured) request to req jsObject - previous middlewareCallback sets req.method from POST to DELETE and called nextCallback
//-if not already created create res jsObject
//-nextCallback
//async(ie continues running outside code if it hits an await inside) handlerMiddlwareCallback implicit returns promiseObject(resolved,undefined) - can await a promiseObject inside
//async function expression without an await is just a normal syncronous function expression
router.delete(
  "/:id",
  catchAsync(async (req, res) => {
    //object keys to variable - Object destructuring
    const { id } = req.params; //pathVariablesObject
    // ******************************************************************************
    //DELETE - querying a collection(campgrounds) for a document by id then deleting it
    // ******************************************************************************
    //modelClass
    //campgroundClassObject.method(idString) ie modelClassObject.method() - same as - db.campgrounds.findOneAndDelete(({_id:ObjectId("12345")})
    //returns thenableObject - pending to resolved(dataObject),rejected(errorObject)
    //queries (campgrounds)collection of (yelp-camp-db)db for single document by idString and deletes the document
    //implicitly throws new Error("messageFromMongoose") - invalid ObjectId format/length or break validation constraints
    const deletedCampground = await CampgroundClassObject.findByIdAndDelete(id); //deletedCampground = dataObject ie single first matching jsObject(document) that was deleted
    //exectues post async queryMiddlewareCallback when await/.then() is called on queryFunction - (mongooseMethod)
    //post async queryMiddlewareCallback gets passed in the deletedCampground as argument from here
    //we use the passed in deletedCampground(ie document)argument to find and delete all assosiated documents in the reviews array property of deletedCampground(ie document)
    //fix for page refresh sending duplicate (http structured) DELETE request -
    res.redirect("/campgrounds");
    //responseObject.redirect("indexPath") updates res.header, sets res.statusCode to 302-found ie-redirect ,sets res.location to /campgrounds
    //resObjects header contains signed cookie created/set by express-sessions middlewareCallback
    //responseObject.redirect("indexPath") - converts and sends res jsObject as (http structure)response // default content-type:text/html
    //thus ending request-response cycle
    //browser sees (http structured) response with headers and makes a (http structured) GET request to location ie default(get)/campgrounds
  })
);

//exportsObject = custom routerObject
module.exports = router;
