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

// ****************************************************************************************************************************************************************************************
//(Third party)middleware(hook) function expressions and (express built-in) middleware(hook)methods and (custom) middleware(hook)function expressions - Order matters for next() execution
// ****************************************************************************************************************************************************************************************
//(Router-level middleware) - bind middlewareCallback to routerObject with router.use() or router.method()
//case 1  - router.use(middlewareCallback) lets us execute middlewareCallback on any http method/every (http structured) request to any path
//case 2 - router.use("pathString"-ie /resource,middlewareCallback) lets us execute middlewareCallback on any http method/every (http structured) request to specific path/resource

//(custom middlewareCallback)
//-refactored to customMiddlewareCallbacks module

// *********************************************************************************************************************************************************
//Using RESTful webApi crud operations pattern (route/pattern matching algorithm - order matters) + MongoDB CRUD Operations using mongoose-ODM (modelClassObject)
// *********************************************************************************************************************************************************

//*******************
//CAMPGROUNDS ROUTES
//*******************

//route1
//httpMethod=GET,path/resource- (pathPrefixString) + / -(direct match/exact path)
//(READ) name-index,purpose-display all documents in (campgrounds)collection from (yelp-camp-db)db
//router.method(pathString ,createMiddlewareCallback(named async handlerMiddlewareCallback)) lets us execute handlerMiddlewareCallback on specifid http method/every (http structured) request to specified path/resource
//execute handlerMiddlwareCallback if (http structured) GET request arrives at path (pathPrefixString) + /
//arguments passed in to handlerMiddlewareCallback -
//-if not already converted convert (http structured) request to req jsObject
//-if not already created create res jsObject
//-nextCallback
//async(ie continues running outside code if it hits an await inside) handlerMiddlwareCallback implicit returns promiseObject(resolved,undefined) - can await a promiseObject inside
//async function expression without an await is just a normal syncronous function expression
router.get("/", catchAsync(campgroundsControllerObject.index));

//route2
//httpMethod=GET,path/resource- (pathPrefixString) + /new  -(direct match/exact path)
//(READ) name-new,purpose-display form to submit new document into (campgrounds)collection of (yelp-camp-db)db
//router.method(pathString ,customMiddlewareCallback,named handlerMiddlewareCallback) lets us execute handlerMiddlewareCallback on specifid http method/every (http structured) request to specified path/resource
//execute handlerMiddlwareCallback if (http structured) GET request arrives at path (pathPrefixString) + /new
//arguments passed in to handlerMiddlewareCallback -
//-if not already converted convert (http structured) request to req jsObject
//-if not already created create res jsObject
//-nextCallback
router.get("/new", checkLoggedIn, campgroundsControllerObject.renderNewForm);

//route3
//httpMethod=GET,path/resource- (pathPrefixString) + /:id  -(pattern match) //:id is a path variable
//(READ) name-show,purpose-display single specific document in (campgrounds)collection of (yelp-camp-db)db
//router.method(pathString ,createMiddlewareCallback(named async handlerMiddlewareCallback)) lets us execute handlerMiddlewareCallback on specifid http method/every (http structured) request to specified pathPrefixString/resource
//execute handlerMiddlwareCallback if (http structured) GET request arrives at path (pathPrefixString) + /:id
//arguments passed in to handlerMiddlewareCallback -
//-if not already converted convert (http structured) request to req jsObject
//-if not already created create res jsObject
//-nextCallback
//async(ie continues running outside code if it hits an await inside) handlerMiddlwareCallback implicit returns promiseObject(resolved,undefined) - can await a promiseObject inside
//async function expression without an await is just a normal syncronous function expression
router.get("/:id", catchAsync(campgroundsControllerObject.showCampground));

//route4
//httpMethod=POST,path/resource- (pathPrefixString) + /  -(direct match/exact path)
//(CREATE) name-create,purpose-create new document in (campgrounds)collection of (yelp-camp-db)db
//router.method(pathString ,customMiddlewareCallback,customMiddlewareCallback,createMiddlewareCallback(named async handlerMiddlewareCallback)) lets us execute handlerMiddlewareCallback on specifid http method/every (http structured) request to specified path/resource
//execute handlerMiddlwareCallback if (http structured) POST request arrives at path (pathPrefixString) + /
//arguments passed in to handlerMiddlewareCallback -
//-already converted (http structured) request to req jsObject - (http structured) request body contained form data,previous middlewareCallback parsed it to req.body
//-if not already created create res jsObject
//-nextCallback
//async(ie continues running outside code if it hits an await inside) handlerMiddlwareCallback implicit returns promiseObject(resolved,undefined) - can await a promiseObject inside
//async function expression without an await is just a normal syncronous function expression
router.post(
  "/",
  checkLoggedIn,
  validateCampground,
  catchAsync(campgroundsControllerObject.createCampground)
);

//route5
//httpMethod=GET,path/resource- (pathPrefixString) + /:id/edit  -(pattern match) //:id is a path variable
//(READ) name-edit,purpose-display form to edit existing document in (campgrounds)collection of (yelp-camp-db)db
//router.method(pathString ,customMiddlewareCallback,createMiddlewareCallback(async customMiddlewareCallback),createMiddlewareCallback(named async handlerMiddlewareCallback)) lets us execute handlerMiddlewareCallback on specifid http method/every (http structured) request to specified path/resource
//execute handlerMiddlwareCallback if (http structured) GET request arrives at path (pathPrefixString) + /:id/edit
//arguments passed in to handlerMiddlewareCallback -
//-if not already converted convert (http structured) request to req jsObject
//-if not already created create res jsObject
//-nextCallback
router.get(
  "/:id?/edit",
  checkLoggedIn,
  catchAsync(verifyAuthor),
  catchAsync(campgroundsControllerObject.renderEditForm)
);

//route6
//httpMethod=PUT,path/resource- (pathPrefixString) + /:id  -(pattern match) //:id is a path variable
//(UPDATE) name-update,purpose-completely replace/update single specific existing document in (campgrounds)collection of (yelp-camp-db)db
//router.method(pathString ,customMiddlewareCallback,createMiddlewareCallback(async customMiddlewareCallback),customMiddlewareCallback,createMiddlewareCallback(named async handlerMiddlewareCallback)) lets us execute handlerMiddlewareCallback on specifid http method/every (http structured) request to specified path/resource
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
  checkLoggedIn,
  catchAsync(verifyAuthor),
  validateCampground,
  catchAsync(campgroundsControllerObject.updateCampground)
);

//route7
//httpMethod=DELETE,path/resource- (pathPrefixString) + /:id  -(pattern match) //:id is a path variable
//(DELETE) name-destroy,purpose-delete single specific document in (campgrounds)collection of (yelp-camp-db)db
//router.method(pathString ,customMiddlewareCallback,createMiddlewareCallback(async customMiddlewareCallback),createMiddlewareCallback(named async handlerMiddlewareCallback)) lets us execute handlerMiddlewareCallback on specifid http method/every (http structured) request to specified path/resource
//execute handlerMiddlwareCallback if (http structured) DELETE request arrives at path (pathPrefixString) + /:id
//arguments passed in to handlerMiddlewareCallback -
//-already converted (http structured) request to req jsObject - previous middlewareCallback sets req.method from POST to DELETE and called nextCallback
//-if not already created create res jsObject
//-nextCallback
//async(ie continues running outside code if it hits an await inside) handlerMiddlwareCallback implicit returns promiseObject(resolved,undefined) - can await a promiseObject inside
//async function expression without an await is just a normal syncronous function expression
router.delete(
  "/:id",
  checkLoggedIn,
  catchAsync(verifyAuthor),
  catchAsync(campgroundsControllerObject.destroyCampground)
);

//exportsObject = custom routerObject
module.exports = router;
