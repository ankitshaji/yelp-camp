//user created module file - can contain functionObjects,variable,classObjects etc which we can export
const express = require("express"); //functionObject //express module
const router = express.Router(); //functionObject.method() //routerObject
// ******************************************************************************************
//mini express appliation/routerObject - mini (RESTful) webApi - webApi using REST principles
// *******************************************************************************************
//routerObject is an isolated instance of middlwareCallbacks and routes - (mini express application/routerObject)
const catchAsync = require("../utils/catchAsync"); //functionObject //self create modeul/file needs "./" //going back a directory ..
const CampgroundClassObject = require("../models/campground"); //CampgroundtClassObject(ie Model) //self created module/file needs "./" //going back a directory ..
const {
  checkLoggedIn,
  verifyAuthor,
  validateCampground,
} = require("../customMiddlewareCallbacks"); //exportObject destructured ie exportObject.method is customMiddlewareCallback //self created module/file needs "./" //going back a directory ..
const campgroundsControllerObject = require("../controllers/campgrounds"); //exportObject //exportObject.method is named (async)handlerMiddlewareCallback //self created module/file needs "./" //going back a directory ..
const multer = require("multer"); //multerFunctionObject //multer module
const {
  cloudinary,
  cloudinaryStorageInstanceObject,
} = require("../cloudinary"); //exportObject.property //self created module/file needs "./" //going back a directory .. //index.js is auto found ny node
const upload = multer({ storage: cloudinaryStorageInstanceObject }); //multerObject = multerFunctionObject(optionsObject) -
//optionsObject -
//case 1 - {dest: "uploads/"} - the method execution -
// - creates directory specified in optionsObject + sets upload.storage property to DiskStorageObject - when images arrive store them here
//case 2 - {storage:cloudinaryStorageInstanceObject} - the method execution -
// - helps multerObject connect to cloudinaryObject instance + sets upload.storage property to be CloudinaryStorageObject - when images arrive store them here

// ****************************************************************************************************************************************************************************************
//(Third party)middleware(hook) function expressions and (express built-in) middleware(hook)methods and (custom) middleware(hook)function expressions - Order matters for next() execution
// ****************************************************************************************************************************************************************************************
//(Router-level middleware) - bind middlewareCallback to routerObject with router.use() or router.method()
//case 1  - router.use(middlewareCallback) lets us execute middlewareCallback on any http method/every (http structured) request to any path
//case 2 - router.use("pathString"-ie /resource,middlewareCallback) lets us execute middlewareCallback on any http method/every (http structured) request to specific path/resource
//case 3 - router.method("pathPostfixString",handlerMiddlewareCallback) lets us execute handlerMiddlewareCallback on specified http method/every (http structured) request to specified path/resource
//note - method() execution adds httpMethod and their handlerMiddlewareCallback into routerObject

//(Third party)
//multerObject.middlewareCreationMethod(argument) - argument is stringObject refering to the value of the name attribute of input element of type=file
//multerObject.single(argument)/multerObject.array(argument) - middlewareCreationMethod execution creates middlewareCallback
//middlewareCallback - Purpose:
//case 1 -  {dest: "uploads/"} //optionsObject during multerObject creation
// -  Accept multipart form form data - (http structured) POST request body parsed to req.body and req.file/req.files before moving to next middlewareCallback
// -  store the received file in specified local storage directory ie uploads
//case 2 -  {storage:cloudinaryStorageInstanceObject} //optionsObject during multerObject creation
// - it creates the media folder set in cloudinaryObject instance on the cloudinary website + adds the mutipart form form data images into it after changing image name to unique name
//ie. it sends a POST request contaning the recived image from multi form to cloudinary webApi/server , it then sends image to its own database after changing image name to unique name
//the reponse contain the url of a GET request to the cloudinary webApi/server endpoint to retrive the image
// - it Accepts multipart form form data - (http structured) POST request body parsed to req.body and req.file/req.files before moving to next middlewareCallback
//   but in this case the parses multi form data in req.files/req.file path property contains the GET request URL for the cloudinary webApi/server endpoint
//sidenode - (http structure) POST request could be from browser form or postman
//middlewareCallback calls next() inside it to move to next middlewareCallback

//(custom middlewareCallback)
//-refactored to customMiddlewareCallbacks module

// *********************************************************************************************************************************************************
//Using RESTful webApi crud operations pattern (route/pattern matching algorithm - order matters) + MongoDB CRUD Operations using mongoose-ODM (modelClassObject)
// *********************************************************************************************************************************************************

//*******************
//CAMPGROUNDS ROUTES
//*******************
//******************************************************************************************************************************************
//GROUPING same pathString using router.routeMethod(pathString) //routerObject
//method chaining - adding diffrent httpMethods and their middlewareCallbacks into routeObject //therefore into routerObject //routerObject.methodOne(middlewareCallbacks).methodTwo(middlewareCallbacks)
//******************************************************************************************************************************************
//route1
//httpMethod=GET,path/resource- (pathPrefixString) + / -(direct match/exact path)
//(READ) name-index,purpose-display all documents in (campgrounds)collection from (yelp-camp-db)db
//router.routeMethod(pathString).methodOne(createMiddlewareCallback(named async handlerMiddlewareCallback)) -
// - lets us execute specific handlerMiddlewareCallback + middlewareCallabacks on specified http method/every (http structured) request to specified path/resource
// - execute specific handlerMiddlwareCallback + middlewareCallabacks if (http structured) GET request arrives at path (pathPrefixString) + /
//arguments passed in to handlerMiddlewareCallback -
// - if not already converted convert (http structured) request to req jsObject
// - if not already created create res jsObject
// - nextCallback
//async(ie continues running outside code if it hits an await inside) handlerMiddlwareCallback implicit returns promiseObject(resolved,undefined) - can await a promiseObject inside
//async function expression without an await is just a normal syncronous function expression

//route2
//httpMethod=POST,path/resource- (pathPrefixString) + /  -(direct match/exact path)
//(CREATE) name-create,purpose-create new document in (campgrounds)collection of (yelp-camp-db)db
//router.routeMethod(pathString).methodOne(middlewareCallbacks).methodTwo(customMiddlewareCallback,customMiddlewareCallback,createMiddlewareCallback(named async handlerMiddlewareCallback)) -
// - lets us execute specific handlerMiddlewareCallback + middlewareCallabacks on specified http method/every (http structured) request to specified path/resource
// - execute specific handlerMiddlwareCallback + middlewareCallabacks if (http structured) POST request arrives at path (pathPrefixString) + /
//arguments passed in to handlerMiddlewareCallback -
// - already converted (http structured) request to req jsObject - (http structured) request body contained form data,previous middlewareCallback parsed it to req.body
// - if not already created create res jsObject
// - nextCallback
//async(ie continues running outside code if it hits an await inside) handlerMiddlwareCallback implicit returns promiseObject(resolved,undefined) - can await a promiseObject inside
//async function expression without an await is just a normal syncronous function expression
router
  .route("/")
  .get(catchAsync(campgroundsControllerObject.index))
  // .post(
  //   checkLoggedIn,
  //   validateCampground,
  //   catchAsync(campgroundsControllerObject.createCampground)
  // );
  .post(upload.array("image"), (req, res) => {
    res.send(req.files);
  });

//route3
//httpMethod=GET,path/resource- (pathPrefixString) + /new  -(direct match/exact path)
//(READ) name-new,purpose-display form to submit new document into (campgrounds)collection of (yelp-camp-db)db
//router.method(pathString ,customMiddlewareCallback,named handlerMiddlewareCallback) -
// - lets us execute handlerMiddlewareCallback + middlewareCallbacks on specified http method/every (http structured) request to specified path/resource
// - execute handlerMiddlwareCallback + middlewareCallbacks if (http structured) GET request arrives at path (pathPrefixString) + /new
//arguments passed in to handlerMiddlewareCallback -
// - if not already converted convert (http structured) request to req jsObject
// - if not already created create res jsObject
// - nextCallback
router.get("/new", checkLoggedIn, campgroundsControllerObject.renderNewForm);

//route4
//httpMethod=GET,path/resource- (pathPrefixString) + /:id/edit  -(pattern match) //:id is a path variable
//(READ) name-edit,purpose-display form to edit existing document in (campgrounds)collection of (yelp-camp-db)db
//router.method(pathString ,customMiddlewareCallback,createMiddlewareCallback(async customMiddlewareCallback),createMiddlewareCallback(named async handlerMiddlewareCallback)) -
// - lets us execute handlerMiddlewareCallback + middlewareCallbacks on specified http method/every (http structured) request to specified path/resource
// - execute handlerMiddlwareCallback + middlewareCallbacks if (http structured) GET request arrives at path (pathPrefixString) + /:id/edit
//arguments passed in to handlerMiddlewareCallback -
// - if not already converted convert (http structured) request to req jsObject
// - if not already created create res jsObject
// - nextCallback
router.get(
  "/:id?/edit",
  checkLoggedIn,
  catchAsync(verifyAuthor),
  catchAsync(campgroundsControllerObject.renderEditForm)
);

//******************************************************************************************************************************************
//GROUPING same pathString using router.routeMethod(pathString) //routerObject
//method chaining - adding diffrent httpMethods and their middlewareCallbacks into routeObject //therefore into routerObject //routerObject.methodOne(middlewareCallbacks).methodTwo(middlewareCallbacks)
//******************************************************************************************************************************************
//route5
//httpMethod=GET,path/resource- (pathPrefixString) + /:id  -(pattern match) //:id is a path variable
//(READ) name-show,purpose-display single specific document in (campgrounds)collection of (yelp-camp-db)db
//router.routeMethod(pathString).methodOne(createMiddlewareCallback(named async handlerMiddlewareCallback)) -
// - lets us execute specific handlerMiddlewareCallback + middlewareCallabacks on specified http method/every (http structured) request to specified pathPrefixString/resource
// - execute specific handlerMiddlwareCallback + middlewareCallabacks if (http structured) GET request arrives at path (pathPrefixString) + /:id
//arguments passed in to handlerMiddlewareCallback -
//-if not already converted convert (http structured) request to req jsObject
//-if not already created create res jsObject
//-nextCallback
//async(ie continues running outside code if it hits an await inside) handlerMiddlwareCallback implicit returns promiseObject(resolved,undefined) - can await a promiseObject inside
//async function expression without an await is just a normal syncronous function expression

//route6
//httpMethod=PUT,path/resource- (pathPrefixString) + /:id  -(pattern match) //:id is a path variable
//(UPDATE) name-update,purpose-completely replace/update single specific existing document in (campgrounds)collection of (yelp-camp-db)db
//router.routeMethod(pathString).methodOne(middlewareCallbacks).methodTwo(pathString ,customMiddlewareCallback,createMiddlewareCallback(async customMiddlewareCallback),customMiddlewareCallback,createMiddlewareCallback(named async handlerMiddlewareCallback)) -
// - lets us execute specific handlerMiddlewareCallback + middlewareCallbacks on specified http method/every (http structured) request to specified path/resource
// - execute specific handlerMiddlwareCallback + middlewareCallbacks if (http structured) PUT request arrives at path (pathPrefixString) + /:id
//arguments passed in to handlerMiddlewareCallback -
// - already converted (http structured) request to req jsObject
//ie.(http structured) request body contained form data,the before previous middlewareCallback parsed it to req.body then called next middlewareCallback
//that middlewareCallback ie.previous sets req.method from POST to PUT and called nextCallback
// - if not already created create res jsObject
// - nextCallback
//async(ie continues running outside code if it hits an await inside) handlerMiddlwareCallback implicit returns promiseObject(resolved,undefined) - can await a promiseObject inside
//async function expression without an await is just a normal syncronous function expression

//route7
//httpMethod=DELETE,path/resource- (pathPrefixString) + /:id  -(pattern match) //:id is a path variable
//(DELETE) name-destroy,purpose-delete single specific document in (campgrounds)collection of (yelp-camp-db)db
//router.routeMethod(pathString).methodOne(middlewareCallbacks).methodTwo(middlewareCallbacks).methodThree(customMiddlewareCallback,createMiddlewareCallback(async customMiddlewareCallback),createMiddlewareCallback(named async handlerMiddlewareCallback)) -
// - lets us execute specific handlerMiddlewareCallback + middlewareCallabacks on specified http method/every (http structured) request to specified path/resource
// - execute specific handlerMiddlwareCallback + middlewareCallabacks if (http structured) DELETE request arrives at path (pathPrefixString) + /:id
//arguments passed in to handlerMiddlewareCallback -
// - already converted (http structured) request to req jsObject - previous middlewareCallback sets req.method from POST to DELETE and called nextCallback
// - if not already created create res jsObject
// - nextCallback
//async(ie continues running outside code if it hits an await inside) handlerMiddlwareCallback implicit returns promiseObject(resolved,undefined) - can await a promiseObject inside
//async function expression without an await is just a normal syncronous function expression
router
  .route("/:id")
  .get(catchAsync(campgroundsControllerObject.showCampground))
  .put(
    checkLoggedIn,
    catchAsync(verifyAuthor),
    validateCampground,
    catchAsync(campgroundsControllerObject.updateCampground)
  )
  .delete(
    checkLoggedIn,
    catchAsync(verifyAuthor),
    catchAsync(campgroundsControllerObject.destroyCampground)
  );

//exportsObject = custom routerObject
module.exports = router;
