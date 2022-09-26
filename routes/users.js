//user created module file - can contain functionObjects,variable,classObjects etc which we can export
const express = require("express"); //functionObject //express module
const router = express.Router(); //functionObject.method() //routerObject
// ******************************************************************************************
//mini express appliation/routerObject - mini (RESTful) webApi - webApi using REST principles
// *******************************************************************************************
//routerObject is an isolated instance of middlwareCallbacks and routes - (mini express application/routerObject)
const catchAsync = require("../utils/catchAsync"); //functionObject //self create modeul/file needs "./" //going back a directory ..
const UserClassObject = require("../models/user"); //UserClassObject(ie Model) //self created module/file needs "./" //going back a directory ..
const passport = require("passport"); //passportObject //passport module
const usersControllerObject = require("../controllers/users"); //exportObject //exportObject.method is named (async)handlerMiddlewareCallback //self created module/file needs "./" //going back a directory ..

// ****************************************************************************************************************************************************************************************
//(Third party)middleware(hook) function expressions and (express built-in) middleware(hook)methods and (custom) middleware(hook)function expressions - Order matters for next() execution
// ****************************************************************************************************************************************************************************************
//(Router-level middleware) - bind middlewareCallback to routerObject with router.use() or router.method()
//case 1  - router.use(middlewareCallback) lets us execute middlewareCallback on any http method/every (http structured) request to any path
//case 2 - router.use("pathString"-ie /resource,middlewareCallback) lets us execute middlewareCallback on any http method/every (http structured) request to specific path/resource
//case 3 - router.method("pathPostfixString",handlerMiddlewareCallback) lets us execute handlerMiddlewareCallback on specified http method/every (http structured) request to specified path/resource
//note - method() execution adds httpMethod and their handlerMiddlewareCallback into routerObject

// *********************************************************************************************************************************************************
//Using RESTful webApi crud operations pattern (route/pattern matching algorithm - order matters) + MongoDB CRUD Operations using mongoose-ODM (modelClassObject)
// *********************************************************************************************************************************************************

//*******************
//USERS ROUTES
//*******************
//******************************************************************************************************************************************
//GROUPING same pathString using router.routeMethod(pathString) //routerObject
//method chaining - adding diffrent httpMethods and their middlewareCallbacks into routeObject //therefore into routerObject //routerObject.methodOne(middlewareCallbacks).methodTwo(middlewareCallbacks)
//******************************************************************************************************************************************
//route1
//httpMethod=GET,path/resource- (pathPrefixString) + /register  -(direct match/exact path)
//(READ) name-new,purpose-display form to submit new document into (users)collection of (yelp-camp-db)db
//router.routeMethod(pathString).methodOne(named handlerMiddlewareCallback) -
// - lets us execute specific handlerMiddlewareCallback + middlewareCallbacks on specified http method/every (http structured) request to specified path/resource
// - execute specific handlerMiddlwareCallback + middlewareCallabacks if (http structured) GET request arrives at path (pathPrefixString) + /register
//arguments passed in to handlerMiddlewareCallback -
// - if not already converted convert (http structured) request to req jsObject
// - if not already created create res jsObject
// - nextCallback

//route2
//httpMethod=POST,path/resource- (pathPrefixString) + /register  -(direct match/exact path)
//(CREATE) name-create,purpose-create new document in (users)collection of (yelp-camp-db)db
//router.routeMethod(pathString).methodOne(middlewareCallabacks).methodTwo(pathString ,createMiddlewareCallback(named async handlerMiddlewareCallback)) -
// - lets us execute specific handlerMiddlewareCallback + middlewareCallbacks on specified http method/every (http structured) request to specified path/resource
// - execute specific handlerMiddlwareCallback + middlewareCallbacks if (http structured) POST request arrives at path (pathPrefixString) + /
//arguments passed in to handlerMiddlewareCallback -
// - already converted (http structured) request to req jsObject - (http structured) request body contained form data,previous middlewareCallback parsed it to req.body
// - if not already created create res jsObject
// - nextCallback
//async(ie continues running outside code if it hits an await inside) handlerMiddlwareCallback implicit returns promiseObject(resolved,undefined) - can await a promiseObject inside
//async function expression without an await is just a normal syncronous function expression
router
  .route("/register")
  .get(usersControllerObject.renderRegisterForm)
  .post(catchAsync(usersControllerObject.createUser));

//******************************************************************************************************************************************
//GROUPING same pathString using router.routeMethod(pathString) //routerObject
//method chaining - adding diffrent httpMethods and their middlewareCallbacks into routeObject //therefore into routerObject //routerObject.methodOne(middlewareCallbacks).methodTwo(middlewareCallbacks)
//******************************************************************************************************************************************
//route3
//httpMethod=GET,path/resource- (pathPrefixString) + /login  -(direct match/exact path)
//(READ) name-check,purpose-display form to submit username and password into /login post route
//router.routeMethod(pathString).methodOne(pathString ,named handlerMiddlewareCallback) -
// - lets us execute specific handlerMiddlewareCallback + middlewareCallbacks on specifid http method/every (http structured) request to specified path/resource
// - execute specific handlerMiddlwareCallback + middlewareCallbacks if (http structured) GET request arrives at path (pathPrefixString) + /login
//arguments passed in to handlerMiddlewareCallback -
// - if not already converted convert (http structured) request to req jsObject
// - if not already created create res jsObject
// - nextCallback

//route4
//httpMethod=POST,path/resource- /login  -(direct match/exact path)
//(CREATE) name-compare,purpose-compare and serialize existing document in (users)collection of (yelp-camp-db)db
//router.routeMethod(pathString).methodOne(middlewareCallback).methodTwo(pathString ,async customAuthenticationMiddlewareCallback, named handlerMiddlewareCallback) -
// - lets us execute specific handlerMiddlewareCallback + middlewareCallbacks on specifid http method/every (http structured) request to specified path/resource
// - execute specific handlerMiddlwareCallback + middlewareCallbacks if (http structured) POST request arrives at path /login
//arguments passed in to handlerMiddlewareCallback -
// - already converted (http structured) request to req jsObject - (http structured) request body contained form data,previous middlewareCallback parsed it to req.body
// - if not already created create res jsObject
// - nextCallback
router
  .route("/login")
  .get(usersControllerObject.renderLoginForm)
  .post(
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login",
      keepSessionInfo: true,
    }),
    usersControllerObject.authenticatedUserRedirect
  );
//not exact - but basic idea
//passportObject.method(authenticationStrategyNameString,optionsObject)
//creates a async customAuthenticationMiddlewareCallback that executes the async verifyCallback inside
//customAuthenticationMiddlewareCallback retrives form data from req.body - username,password and passes it as parameters to async verifyCallback execution
//verifyCallback - contains logic for authenticating a user
// ***********************************************************
//READ - querying a collection(users) for a document by username
// ***********************************************************
//it calls async mongoosemMethod findOne on UserClassObject with queryObject containing recieved username -
// - queries (users)collection of (yelp-camp-db)db for first matching single document by queryObject and returns foundUser
// - async mongooseMethod can implicitly throw new Error("messageFromMongoose") - if validation/contraints broken
// - async mongooseMethod can return null or foundUser
//if the async mongooseMethod implicitly throws new Error("messageFromMongoose")) -
// - async verifyCallback catches that errorInstanceObject and throws its own new Error("messageFromPassportLocalMongoose")
// - async customAuthenticationMiddlewareCallback catches the thrown new Error("messageFromPassportLocalMongoose") and adds a req.flash("error",e.message) and ends res-req cycle by calling res.ridirect("/login")
//if async mongooseMethod returns null -
// - async verifyCallback explicitly throw new Error("messageFromPassportLocalMongoose")
// - async customAuthenticationMiddlewareCallback catches the thrown new Error("messageFromPassportLocalMongoose") and adds a req.flash("error",e.message) and ends res-req cycle by calling res.ridirect("/login")
//if async mongooseMethod returns foundUser -
// - async verifyCallback creates a hashValue using the retrived passwordString combined with the foundUsers saltValue - hashing SaltedPasswordString using Pbkdf2 hashFunction
// - if the created hashValue matches the foundUsers hashValue
//    -  user credentials match a registered user / therefore they are authenticated
//    - async verifyCallback returns the foundUser into the customMiddlewareCallback
//    - async customAuthenticationMiddlewareCallback implicitly execectues req.login(foundUser,callback)
//    - req.login(foundUser,callback) serializes the foundUser into one value and stores it into temporary data store , making foundUser retrivable through deserializing the one value into req.user
//    - async customAuthenticationMiddlewareCallback calls next() to move onto next middlewareCallback
// - if the created hashValue does not match the foundUsers hashValue
//   - user is not a registed user / therefore they are not authenticated
//   - async verifyCallback explicitly throws new Error("messageFromPassportLocalMongoose")
//   - customAuthenticationMiddlewareCallback catches the thrown new Error("messageFromPassportLocalMongoose") and adds a req.flash("error",e.message) and ends res-req cycle by calling res.ridirect("/login")

//route5
//httpMethod=POST,path/resource- /logout  -(direct match/exact path)
//(CREATE) name-clear,purpose- clear req.user is current sessionObject
//router.method(pathString ,named handlerMiddlewareCallback) -
// - lets us execute handlerMiddlewareCallback + middlewareCallbacks on specified http method/every (http structured) request to specified path/resource
// - execute handlerMiddlwareCallback + middlewareCallbacks if (http structured) POST request arrives at path /logout
//arguments passed in to handlerMiddlewareCallback -
// - if not already converted convert (http structured) request to req jsObject
// - if not already created create res jsObject
// - nextCallback
router.post("/logout", usersControllerObject.logoutUser);

//exportsObject = custom routerObject
module.exports = router;
