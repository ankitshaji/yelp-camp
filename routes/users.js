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

//route1
//httpMethod=GET,path/resource- (pathPrefixString) + /register  -(direct match/exact path)
//(READ) name-new,purpose-display form to submit new document into (users)collection of (yelp-camp-db)db
//router.method(pathString ,handlerMiddlewareCallback) lets us execute handlerMiddlewareCallback on specifid http method/every (http structured) request to specified path/resource
//execute handlerMiddlwareCallback if (http structured) GET request arrives at path (pathPrefixString) + /register
//arguments passed in to handlerMiddlewareCallback -
//-if not already converted convert (http structured) request to req jsObject
//-if not already created create res jsObject
//-nextCallback
router.get("/register", (req, res) => {
  res.render("users/register");
  //render(ejs filePath) - executes js - converts  ejs file into pure html
  //resObjects header contains signed cookie created/set by express-sessions middlewareCallback
  //responseObject.render() - converts and sends res jsObject as (http structure)response //content-type:text/html
  //thus ending request-response cycle
});

//route2
//httpMethod=POST,path/resource- (pathPrefixString) + /register  -(direct match/exact path)
//(CREATE) name-create,purpose-create new document in (users)collection of (yelp-camp-db)db
//router.method(pathString ,createMiddlewareCallback(async handlerMiddlewareCallback)) lets us execute handlerMiddlewareCallback on specifid http method/every (http structured) request to specified path/resource
//execute handlerMiddlwareCallback if (http structured) POST request arrives at path (pathPrefixString) + /
//arguments passed in to handlerMiddlewareCallback -
//-already converted (http structured) request to req jsObject - (http structured) request body contained form data,previous middlewareCallback parsed it to req.body
//-if not already created create res jsObject
//-nextCallback
//async(ie continues running outside code if it hits an await inside) handlerMiddlwareCallback implicit returns promiseObject(resolved,undefined) - can await a promiseObject inside
//async function expression without an await is just a normal syncronous function expression
router.post(
  "/register",
  catchAsync(async (req, res) => {
    try {
      //object keys to variable - Object destructuring
      const { email, username, password } = req.body; //form data/req.body is jsObject //{key/name:inputValue,key/name:inputValue}}
      // ***************************************************************************************
      //CREATE - creating a single new document in the (users) collection of (yelp-camp-db)db
      // ***************************************************************************************
      //modelClass
      //UserClassObject(objectArgument-passed to constructor method)
      //objectArgument- jsObject{key:value} ie the new document that abides to collectionSchemaInstanceObject
      //objectArgument has validations/contraints set by collectionSchemaInstanceObject
      //validations/contraints -
      //email cannot be empty + other validations/constraints set by passport-local-mongoose for its fields
      //create modelInstanceObject(ie document) - with new keyword and UserClassObject constructor method
      const newUser = new UserClassObject({ email: email, username: username });
      //UserClassObject.customStaticMethod(newUser,"passwordString")
      //customStaticMethod on UserClassObject - async register()
      //creates salt property on newUser and adds random saltValue
      //creates hash property on newUser and adds hashValue - hashValue created by adding random saltValue to passwordString then hashing SaltedPasswordString using Pbkdf2 hashFunction
      //calls async mongoosemMethod save on newUser - creating users collection in yelp-camp-db and or adding newUser document into users collection - can implicitly throw new Error("messageFromMongoose") - if validation/contraints broken
      //if async mongooseMethod implicity throws Error("messageFromMongoose") inside async customStaticMethod , it catches that errorInstanceObject and throws its own new Error("messageFromPassportLocalMongoose")
      //async customStaticMethod returns the savedUser
      const savedUser = await UserClassObject.register(newUser, password); //savedUser = dataObject ie created jsObject(document)
      req.flash("success", "Welcome to Yelp Camp!"); //stores the "messageValue" in an arrayObject in the flash property of current sessoinObject under the key "categoryKey"
      //fix for page refresh sending duplicate (http structured) POST request -
      res.redirect("/campgrounds");
      //responseObject.redirect("indexPath") updates res.header, sets res.statusCode to 302-found ie-redirect ,sets res.location to /campgrounds
      //resObjects header contains signed cookie created/set by express-sessions middlewareCallback
      //responseObject.redirect("indexPath") - converts and sends res jsObject as (http structure)response // default content-type:text/html
      //thus ending request-response cycle
      //browser sees (http structured) response with headers and makes a (http structured) GET request to location ie default(get)/campgrounds
    } catch (e) {
      //(errorInstanceObject)
      //we catch the implicitly thrown new Error("messageFromPassportLocalMongoose") early - closest catch - therefore .catch does not run - we dont pass it in next(e) to customErrorHandlerMiddlewareCallback
      req.flash("error", e.message); //stores the "messageValue" in an arrayObject in the flash property of current sessoinObject under the key "categoryKey"
      res.redirect("/register");
      //responseObject.redirect("registerPath") updates res.header, sets res.statusCode to 302-found ie-redirect ,sets res.location to /register
      //resObjects header contains signed cookie created/set by express-sessions middlewareCallback
      //responseObject.redirect("registerPath") - converts and sends res jsObject as (http structure)response // default content-type:text/html
      //thus ending request-response cycle
      //browser sees (http structured) response with headers and makes a (http structured) GET request to location ie default(get)/register
    }
  })
);

//route3
//httpMethod=GET,path/resource- (pathPrefixString) + /login  -(direct match/exact path)
//(READ) name-check,purpose-display form to submit username and password into /login post route
//router.method(pathString ,handlerMiddlewareCallback) lets us execute handlerMiddlewareCallback on specifid http method/every (http structured) request to specified path/resource
//execute handlerMiddlwareCallback if (http structured) GET request arrives at path (pathPrefixString) + /login
//arguments passed in to handlerMiddlewareCallback -
//-if not already converted convert (http structured) request to req jsObject
//-if not already created create res jsObject
//-nextCallback
router.get("/login", (req, res) => {
  res.render("users/login");
  //render(ejs filePath) - executes js - converts  ejs file into pure html
  //resObjects header contains signed cookie created/set by express-sessions middlewareCallback
  //responseObject.render() - converts and sends res jsObject as (http structure)response //content-type:text/html
  //thus ending request-response cycle
});

//route4
//httpMethod=POST,path/resource- /login  -(direct match/exact path)
//(CREATE) name-compare,purpose-compare and serialize existing document in (users)collection of (yelp-camp-db)db
//router.method(pathString ,async handlerMiddlewareCallback) lets us execute handlerMiddlewareCallback on specifid http method/every (http structured) request to specified path/resource
//execute handlerMiddlwareCallback if (http structured) POST request arrives at path /login
//arguments passed in to handlerMiddlewareCallback -
//-already converted (http structured) request to req jsObject - (http structured) request body contained form data,previous middlewareCallback parsed it to req.body
//-if not already created create res jsObject
//-nextCallback
//async(ie continues running outside code if it hits an await inside) handlerMiddlwareCallback implicit returns promiseObject(resolved,undefined) - can await a promiseObject inside
//async function expression without an await is just a normal syncronous function expression
router.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  (req, res) => {
    req.flash("success", "Welcome back!"); //stores the "messageValue" in an arrayObject in the flash property of current sessoinObject under the key "categoryKey"
    //fix for page refresh sending duplicate (http structured) POST request -
    res.redirect("/campgrounds");
    //responseObject.redirect("indexPath") updates res.header, sets res.statusCode to 302-found ie-redirect ,sets res.location to /campgrounds
    //resObjects header contains signed cookie created/set by express-sessions middlewareCallback
    //responseObject.redirect("indexPath") - converts and sends res jsObject as (http structure)response // default content-type:text/html
    //thus ending request-response cycle
    //browser sees (http structured) response with headers and makes a (http structured) GET request to location ie default(get)/campgrounds
  }
);
//not exact - but basic idea
//passportObject.method(authenticationStrategyNameString,optionsObject)
//creates a customAuthenticationMiddlewareCallback that executes the verifyCallback inside
//customAuthenticationMiddlewareCallback retrives form data from req.body - username,password and passes it as parameters to verifyCallback execution
//verifyCallback - contains logic for authenticating a user
// ***********************************************************
//READ - querying a collection(users) for a document by username
// ***********************************************************
//it calls async mongoosemMethod findOne on UserClassObject with queryObject containing recieved username -
// - queries (users)collection of (yelp-camp-db)db for first matching single document by queryObject and returns foundUser
// - async mongooseMethod can implicitly throw new Error("messageFromMongoose") - if validation/contraints broken
// - async mongooseMethod can return null or foundUser
//if the async mongooseMethod implicitly throws new Error("messageFromMongoose")) -
// - verifyCallback catches that errorInstanceObject and throws its own new Error("messageFromPassportLocalMongoose")
// - customAuthenticationMiddlewareCallback catches the thrown new Error("messageFromPassportLocalMongoose") and adds a req.flash("error",e.message) and ends res-req cycle by calling res.ridirect("/login")
//if async mongooseMethod returns null -
// - verifyCallback explicitly throw new Error("messageFromPassportLocalMongoose")
// - customAuthenticationMiddlewareCallback catches the thrown new Error("messageFromPassportLocalMongoose") and adds a req.flash("error",e.message) and ends res-req cycle by calling res.ridirect("/login")
//if async mongooseMethod returns foundUser -
// - verifyCallback creates a hashValue using the retrived passwordString combined with the foundUsers saltValue - hashing SaltedPasswordString using Pbkdf2 hashFunction
// - if the created hashValue matches the foundUsers hashValue
//    -  user credentials match a registered user / therefore they are authenticated
//    - verifyCallback returns the foundUser into the customMiddlewareCallback
//    - customAuthenticationMiddlewareCallback serializes the foundUser into one value and stores it into temporary data store , making foundUser retrivable through deserializing the one value into req.user
//    - customAuthenticationMiddlewareCallback calls next() to move onto next middlewareCallback
// - if the created hashValue does not match the foundUsers hashValue
//   - user is not a registed user / therefore they are not authenticated
//   - verifyCallback explicitly throws new Error("messageFromPassportLocalMongoose")
//   - customAuthenticationMiddlewareCallback catches the thrown new Error("messageFromPassportLocalMongoose") and adds a req.flash("error",e.message) and ends res-req cycle by calling res.ridirect("/login")

//exportsObject = custom routerObject
module.exports = router;
