//user created module file - can contain functionObjects,variable,Class's etc which we can export
const express = require("express"); //functionObject //express module
const router = express.Router({ mergeParams: true }); //functionObject.method() //routerObject
//allow retriving path variable from appObjects created req.params for its middlewareCalbacks by adding optionsObject argument to Router method
// ******************************************************************************************
//mini express appliation/routerObject - mini (RESTful) webApi - webApi using REST principles
// *******************************************************************************************
//routerObject is an isolated instance of middlwareCallbacks and routes - (mini express application/routerObject)
const catchAsync = require("../utils/catchAsync"); //functionObject //self create modeul/file needs "./" //going back a directory ..
const {
  validateReview,
  checkLoggedIn,
  verifyReviewAuthor,
} = require("../customMiddlewareCallbacks"); //exportObject destructured ie exportObject.method is customMiddlewareCallback //self created module/file needs "./" //going back a directory ..
const reviewsControllerObject = require("../controllers/reviews"); //exportObject //exportObject.method is named (async)handlerMiddlewareCallback //self created module/file needs "./" //going back a directory ..

// ****************************************************************************************************************************************************************************************
//(Third party)middleware(hook) function expressions and (express built-in) middleware(hook)methods and (custom) middleware(hook)function expressions - Order matters for next() execution
// ****************************************************************************************************************************************************************************************
//(Router-level middleware) - bind middlewareCallback to routerObject with router.use() or router.method()
//case 1  - router.use(middlewareCallback) lets us execute middlewareCallback on any http method/every (http structured) request to any path
//case 2 - router.use("pathString"-ie /resource,middlewareCallback) lets us execute middlewareCallback on any http method/every (http structured) request to specific path/resource
//case 3 - router.method("pathPostfixString",handlerMiddlewareCallback) lets us execute handlerMiddlewareCallback on specified http method/every (http structured) request to specified path/resource
//note - method() execution adds httpMethod and their handlerMiddlewareCallback into routerObject

//(custom middlewareCallback)
//-refactored to customMiddlewareCallbacks module

// *********************************************************************************************************************************************************
//Using RESTful webApi crud operations pattern (route/pattern matching algorithm - order matters) + MongoDB CRUD Operations using mongoose-ODM (modelClassObject)
// *********************************************************************************************************************************************************

//**********************************************************************************************************
//REVIEWS ROUTES using NESTED ROUTING - more than one dynamic variable in path - used to send campground_id
//**********************************************************************************************************
//route1
//httpMethod=POST,path/resource- (pathPrefixString) + /  -(direct match/exact path) //:id is a path variable //:id needs to be retrived from appObjects created req.params for its middlewareCalbacks
//(CREATE) name-create,purpose-create new document in (reviews)collection of (yemp-camp-db)db
//routerObject.method(pathString ,customMiddlewareCallback,customMiddlewareCallback,createMiddlewareCallback(named async handlerMiddlewareCallback)) -
// - lets us execute handlerMiddlewareCallback on specified http method/every (http structured) request to specified path/resource
// - execute handlerMiddlwareCallback if (http structured) POST request arrives at path (pathPrefixString) + /
//arguments passed in to handlerMiddlewareCallback -
// - already converted (http structured) request to req jsObject - (http structured) request body contained form data,previous middlewareCallback parsed it to req.body
// - if not already created create res jsObject
// - nextCallback
//async(ie continues running outside code if it hits an await inside) handlerMiddlwareCallback implicit returns promiseInstObj(resolved,undefined) - can await a promiseObject inside
//async function expression without an await is just a normal syncronous function expression
router.post(
  "/",
  checkLoggedIn,
  validateReview,
  catchAsync(reviewsControllerObject.createReview)
);

//route2
//httpMethod=DELETE,path/resource- (pathPrefixString) + /:reviewId  -(pattern match) //:id and :reviewId are path variables //:id needs to be retrived from appObjects created req.params for its middlewareCalbacks
//(DELETE) name-destroy,purpose-delete single specific document in (reviews)collection of (yelp-camp-db)db
//routerObject.method(pathString ,customMiddlewareCallback,createMiddlewareCallback(named async customMiddlewareCallback),createMiddlewareCallback(async handlerMiddlewareCallback)) -
// - lets us execute handlerMiddlewareCallback + middlewareCallbacks on specified http method/every (http structured) request to specified path/resource
// - execute handlerMiddlwareCallback + middlewareCallbacks if (http structured) DELETE request arrives at path (pathPrefixString) + /:reviewId
//arguments passed in to handlerMiddlewareCallback -
// - already converted (http structured) request to req jsObject - previous middlewareCallback sets req.method from POST to DELETE and called nextCallback
// - if not already created create res jsObject
// - nextCallback
//async(ie continues running outside code if it hits an await inside) handlerMiddlwareCallback implicit returns promiseInstObj(resolved,undefined) - can await a promiseObject inside
//async function expression without an await is just a normal syncronous function expression
router.delete(
  "/:reviewId",
  checkLoggedIn,
  catchAsync(verifyReviewAuthor),
  catchAsync(reviewsControllerObject.deleteReview)
);

//exportsObject = custom routerObject
module.exports = router;
