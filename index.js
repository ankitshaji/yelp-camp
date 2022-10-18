//main file that gets passed in other npm package modules or user created modules

//NODE_ENV=production node index.js - Node executes serverside js code (ie express app) in production if we set NODE_ENV value
//processObject (ie nodejs globalObject)
//processObject.property = environmentVariablesObject
//check if NODE_ENV property is production or undefined/development
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config(); //dotenv module //dotenvObject.method(optionalArgument - path to .env file) //adds the .env file keys as properties on env jsObject
}
const express = require("express"); //functionObject //express module
const path = require("path"); //pathObject //path module
const app = express(); //appObject
// ********************************************************************************
//main express application/appObject - (RESTful) webApi - webApi using REST principles
// *******************************************************************************
//mongoose ODM - has callback but also supports promises-ie returns promiseObject (pending,undefined) to -resove(value)(fullfulled,value) or reject(errorMessage)(rejected,errorMessage)
const mongoose = require("mongoose"); //mongooseObject //mongoose module
const methodOverride = require("method-override"); //functionObject //method-override module
const ejsMateEngine = require("ejs-mate"); //functionObject(ie ejsEngine) //ejs-mate module
const CustomErrorClassObject = require("./utils/CustomError"); //CustomErrorClassObject //self created module/file needs "./"
const campgroundsRoutes = require("./routes/campgrounds"); //custom routerObject //self created module/file needs "./"
const reviewsRoutes = require("./routes/reviews"); //custom routerObject //self created module/file needs "./"
const usersRoutes = require("./routes/users"); //custom routerObject //self created module/file needs "./"
const session = require("express-session"); //functionObject //express-session module
const flash = require("connect-flash"); //functionObject //connect-flash module
const passport = require("passport"); //passportObject //passport module
const PassportLocalStrategyClassObject = require("passport-local"); //PassportLocalStrategyClassObject //passport-local module/authenticationStrategy/plugin for passport module
const UserClassObject = require("./models/user"); //UserClassObject(ie Model) //self created module/file needs "./"
const mongoSanitize = require("express-mongo-sanitize"); //functionObjecct //express-mongo-sanitize module
const helmet = require("helmet"); //functionObject //helmet module
const mongodbAtlasDbUrl = process.env.MONGODB_ATLAS_DB_URL; //urlStringObject to connects to mongod server on a cloud platform //ie production database //local env var OR heroku env var
//eg."mongodb+srv://<clusterUserUsername>:<clusterUserPassword>@<clusterName>.6zh0wzd.mongodb.net/<dbName>?retryWrites-true&w-majority"
const MongodbStoreClassObject = require("connect-mongo"); //MongodbStoreClassObject //connect-mongo module

// ********************************************************************************
// CONNECT - nodeJS runtime app connects to default mogod server port + creates db
// ********************************************************************************
//async(ie continues running outside code if it hits an await inside) named function expression
//implicit returns promiseObject(resolved,undefined) - can await a promiseObject inside
//async function expression without an await is just a normal syncronous function expression
const mongodbDbUrl = "mongodb://localhost:27017/yelp-camp-db"; //urlStringObjec to connect to mongod server on localhost //ie development database
async function main() {
  try {
    //mongooseObject.method(domainName/mongodPortNo/databaseToUse) //returns promiseObject pending
    await mongoose.connect(mongodbAtlasDbUrl || mongodbDbUrl);
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

// ***********************
//Other setup - appObject
// ***********************
//selecting one of many engines(non default) used to parse/make sense of ejs templating langauge
//ejsMate engine lets us use function expression layout("pathToBoilerplate.ejs")
//we create a layouts directory in views directry for our boilerplate.ejs file
app.engine("ejs", ejsMateEngine);

//when view engine is used express assumes our views ie ejs templates
//exist in a (default)views directory
app.set("view engine", "ejs"); //auto require("ejs")
//change path to "absolute path to index.js" + "/views"   - due to not finding views directory when executing from outside this directory eg-cd..
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
//middlewareCallback - Purpose: Accept form data - (http structured) POST request body parsed to req.body before moving to next middlewareCallback
//sidenode - (http structure) POST request could be from browser form or postman
app.use(express.urlencoded({ extended: true })); //app.use(middlewareCallback) //app.use() lets us execute middlewareCallback on any http method/every (http structured) request to any path
//middlewareCallback calls next() inside it to move to next middlewareCallback

//(express built-in)
//expressFunctionObject.middlewareCreationMethod(argument) - argument is string "absolute path to assetsDirectory"
//change path to "absolute path to index.js" + "/public"  - due to not finding public directory when executing from outside this directory eg-cd..
//middlewareCreationMethod execution creates middlewareCallback
//middlewareCallback - Purpose: serving static files found in assetsDirectory
//(ie auto sends response(serves) with file on request to localhost:3000/filename.extension) (allows us to add them into other responses by making get request in ejs files)
app.use(express.static(path.join(__dirname, "public"))); //app.use(middlewareCallback) //app.use() lets us execute middlewareCallback on any http method/every (http structured) request to any path
//middlewareCallback calls next() inside it to move to next middlewareCallback

//(Third party)
//middlewareCreationFunctionObject(argument) - argument is key to look for
//middlewareCreationFunctionObject execution creates middlewareCallback
//middlewareCallback  - Purpose: sets req.method from eg.POST to value of _method key eg.PUT,PATCH,DELETE before moving to next middlewareCallback
//sidenote - ?queryString is (?key=value), therefore _method is key, we set value to it in html form
app.use(methodOverride("_method")); //app.use(middlewareCallback) //app.use() lets us execute middlewareCallback on any http method/every (http structured) request to any path
//middlewareCallback calls next() inside it to move to next middlewareCallback

//(Third party)
//middlewareCreationFunctionObject()
//middlewareCreationFunctionObject execution creates middlewareCallback
//middlewareCallback  - Purpose: checks req.query,req.body and req.params to see if any keys in the jsObjects contain  $ or . in them.
//if it does we either removes the key:value pair entireley from the jsObject or replace the $ charecter in the key with somethine else
app.use(mongoSanitize()); //app.use(middlewareCallback) //app.use() lets us execute middlewareCallback on any http method/every (http structured) request to any path
//middlewareCallback calls next() inside it to move to next middlewareCallback

//(Third party)
//middlewareCreationFunctionObject(argument) - argument is sessionOptionsObject
//middlewareCreationFunctionObject execution creates middlewareCallback
//Purpose:
//case1-
//On first (http strucuted) request, express-sessions middlewareCallback auto creates a session(jsObject) property on reqObject (associated to a newly created temporary data store)
//it creates a new  sessionStore property on reqObject containing the temporary data store(MemoryStore/MongodbStore)
//it creates and pupulates sessionID property in reqObject with a unique sessionID
//it creates a signed cookie with HMACValue (HMACValue is created from (req.sessionID + "secretString" + sha256HashFunction))
//req.session.property is used to add the specifc clients data to the newly created temporary data store where id is current unique sessionID
//it sets the signed cookie in the resObjects header (Set-Cookie:key:value)
//case2-
//On subsequent (http strucutred) requests from same client contain signed cookie in its header (Cookie:key:value)
//express-sessions middlewareCallback unsigns the cookies HMACValue to get the unique sessionID associate to that unique client
//it creates and pupulates sessionID property in reqObject with the current unique sessionID of client
//it creates a session(jsObject) property on reqObject (assoicated with the pre existing temporary data store)
//it creates a sessionStore property on reqObject containing the pre existing temporary data store(MemoryStore/MongodbStore)
//req.session.property is used to retrive the specfic clients stored data from the pre existing temporary data store where id is current unique sessionID from signed cookie received from unique client
//it creates signed cookie with HMACValue (HMACValue is created from (req.sessionID + "secretString" + sha256HashFunction))
//it sets this signed cookie in the resObjects header (Set-Cookie:key:value)
//sidenode - (http structure) request could be from unique browserClients or unique postmanClients
//***********************************************************************************************************************
//creating a temporary data store (ie connecting to mongod server and creating a sessions collection in the specified db)
//***********************************************************************************************************************
//mongodbStoreObject = MongodbStoreClassObject.method(optionsObject)
const secretStringObject = process.env.SECRET || "thisismysecret"; //local env var OR heroku env var
const mongodbStoreObject = MongodbStoreClassObject.create({
  mongoUrl: mongodbAtlasDbUrl || mongodbDbUrl,
  secret: secretStringObject,
  touchAfter: 24 * 60 * 60, //seconds //don't resave on refresh request, instead resave at set intervals
});
// ******************************************
//Catch errors after initial connection
// ******************************************
//mongodbStoreObject.method(string,callback)
mongodbStoreObject.on("error", function (e) {
  console.log("mongodbStore connection error:", e);
});
const sessionOptionsObject = {
  //set a specific temporary data store for sessionStore property on requestObject
  store: mongodbStoreObject,
  //setting unique name(ie.key) for signed cookie created by express-session //harder to find in xss attack
  //default name(ie key) for signed cookie created by express-session is connect.sid
  name: "session",
  secret: secretStringObject,
  saveUninitialized: true,
  resave: false,
  cookie: {
    //default true //signed cookie only accessible in (http structured) request header, cannot access in client side script ie.document.cookie - helps prevent (XSS)cross-site scripting attack
    httpOnly: true,
    //default false //signed cookie only sent in ("https" structured) request header - NOTE - localhost uses (http strucuted) requests therefore only set when in production env
    //secure:true,
    //milliseconds time now + milliseconds time in a week
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
//saveUninitialized - save a newly created session to data store even if session was not modified during the request
//resave - save non updated session to data store even if session was not modified during the request
//cookies - properties of created/receieved signed cookies
app.use(session(sessionOptionsObject)); //app.use(middlewareCallback) //app.use() lets us execute middlewareCallback on any http method/every (http structured) request to any path
//middlewareCallback calls next() inside it to move to next middlewareCallback

//(Third party)
//middlewareCreationFunctionObject()
//middlewareCreationFunctionObject execution creates middlewareCallback
//Purpose: connect-flashs middlewareCallback creates a flash() method on reqObject
//it creates a flash property on current sessionObject ie using sessionObject.property to add/retrive the specifc clients data to/from the new/pre existing temporary data store where id is current unique sessionID
//req.flash("categoryKey","messageValue") method with 2 arguments - stores the "messageValue" in an arrayObject in the flash property of current sessoinObject under the key "categoryKey"
//we call this method after an action(eg.create,delete,login,logout) and before a redirect occurs so that the subsequent request can retrive it and pass it as a variable into an ejs template file
//req.flash("categoryKey") method with 1 arguments - retrives messagesArrayObject of specifc "categoryKey" key from the flash property of current sessoinObject
//NOTE - we can only call req.flash("categoryKey") once to retrive messagesArrayObject of specifc "categoryKey" key before "categoryKey" key is erased from flash property of current sessionObject
app.use(flash()); //app.use(middlewareCallback) //app.use() lets us execute middlewareCallback on any http method/every (http structured) request to any path
//middlewareCallback calls next() inside it to move to next middlewareCallback

//(Third party)
//middlewareCreationFunctionObject()
//middlewareCreationFunctionObject execution creates middlewareCallback
//Purpose: Its execution exectues 15 other middlewareCallbacks - most of these middlwareCallbacks add a security header to responseObject - with default options (ie value)
//eg. default ContentSecutiryPolicy middelware only allows browser to send request to self domain
//NOTE - default CrossOriginEmbedderPolicy middleware only allows browser to receive response from self domain,
//       we need to set crossorigin attribute on specific link,script and img tags to say we accept response from third party domain - it send a CORS mode anonymous request to the third party domain
//       Tells response to set an ACAO header - This lets COEP header know it is response from an accepted third party domain,thefore response is not blocked by COEP header.
//we can prevent execution of an unwanted middlewarecallback by setting optionsObject during exection of middlewareCreationFunctionObject(optionsObject) eg - {crossOriginEmbedderPolicy:false}
app.use(helmet()); //app.use(middlewareCallback) //app.use() lets us execute middlewareCallback on any http method/every (http structured) request to any path
//middlewareCallback calls next() inside it to move to next middlewareCallback

//scriptSrcUrlsarrayObject
const scriptSrcUrls = [
  "https://stackpath.bootstrapcdn.com/",
  "https://api.tiles.mapbox.com/",
  "https://api.mapbox.com/",
  "https://kit.fontawesome.com/",
  "https://code.jquery.com/", // don't need - just reminder
  "https://cdnjs.cloudflare.com/",
  "https://cdn.jsdelivr.net/",
];
//styleSrcUrlsarrayObject
const styleSrcUrls = [
  "https://kit-free.fontawesome.com/",
  "https://stackpath.bootstrapcdn.com/",
  "https://api.mapbox.com/",
  "https://api.tiles.mapbox.com/",
  "https://fonts.googleapis.com/",
  "https://use.fontawesome.com/",
  "https://cdn.jsdelivr.net",
];
//connectSrcUrlsarrayObject
const connectSrcUrls = [
  "https://api.mapbox.com",
  "https://*.tiles.mapbox.com",
  "https://events.mapbox.com",
];
//fontSrcUrlsarrayObject
const fontSrcUrls = [];

//(Third party)
//helmetFunctionObject.middlewareCreationMethod(argument) - argument is optionsObject(ie value) - overwrite default options(ie value) that only allows browser send request to the self domain
//middlewareCreationFunctionObject execution creates middlewareCallback
//middlewareCallback  - Purpose: Updates/Creates a header with Content-Security-Policy as key and set optionsObject as value. Adds it into responseObject.header jsObject - therefore its a key:value pair inside the (http strucutred) response header after converstion
//Content-Security-Policy header is sent in every (http strucutred) response to the browser/client along with the html template file in the (http structured) response body
//This header prevents the browser from executing inline styles(ie clientside css) and inline scripts (ie clientside js) when rendering html template.
//The header value tells the browser the domains/origins/webApis/servers/express apps that it is allowed to send requests to,eg- GET requests to retrive css/js files to use/execute(clientside js)
//This value is set with the optionsObject - contains the allowed domain urls - to send request to - eg.(GET requests tp cdn's - content delivery networks)
//This header lowers the chances of an XSS attack as it prevents inline scripts and if it gets past that, we havnt allowed requests to be able to be sent to their domain
app.use(
  helmet.contentSecurityPolicy({
    //NOTE - properties are called directives
    directives: {
      defaultSrc: [],
      //NOTE - using spread operator on arrayObject to pass in each value in arrayObject as a value in new arrayObject
      //self - we allow the browser to to sends request to our own domain/origin/webApi/server/express app eg.GET request to retrive js/css files
      connectSrc: ["'self'", ...connectSrcUrls],
      //NOTE - unsafe-inline set so we can run the inline script in show/index.ejs
      scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
      styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
      workerSrc: ["'self'", "blob:"],
      childSrc: ["blob:"],
      objectSrc: [],
      imgSrc: [
        "'self'",
        "blob:",
        "data:",
        `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/`, //allowed domain url must include username //local env var OR heroku env var
        "https://images.unsplash.com/",
      ],
      fontSrc: ["'self'", ...fontSrcUrls],
    },
  })
); //app.use(middlewareCallback) //app.use() lets us execute middlewareCallback on any http method/every (http structured) request to any path
//middlewareCallback calls next() inside it to move to next middlewareCallback

//(Third party) //note - execute passportInitializeMiddlewareCallback anytime after sessionMiddlewareCallback execution
//passportObject.middlewareCreationMethod()
//middlewareCreationMethod execution creates middlewareCallback
//middlewareCallback - Purpose: passportInitializes middlewareCallback adds passport related properties/methods to reqObject - eg.isAuthenticated(),logout(), _passport
app.use(passport.initialize()); //app.use(middlewareCallback) //app.use() lets us execute middlewareCallback on any http method/every (http structured) request to any path
//middlewareCallback calls next() inside it to move to next middlewareCallback

//(Third party) //note - execute passportSessionMiddlewareCallback anytime after sessionMiddlewareCallback and passportInitializeMiddlwareCallback execution
//passportObject.middlewareCreationMethod()
//middlewareCreationMethod execution creates middlewareCallback
//middlewareCallback - Purpose: passportSessions middlewareCallback adds the deserialized userModelInstanceObject into req.user property
app.use(passport.session()); //app.use(middlewareCallback) //app.use() lets us execute middlewareCallback on any http method/every (http structured) request to any path
//middlewareCallback calls next() inside it to move to next middlewareCallback

//(custom middlewareCallback)
//app.use(middlewareCallback) //app.use() lets us execute middlewareCallback on any http method/every (http structured) request to any path
//alternative way to pass variable into every ejs template file - //propertie in localObject is a variable in ejs template file
//responseObject is created and decorated before use elsewhere
app.use((req, res, next) => {
  //arrayInstanceObject.arrayMethod("stringObject") returns true if arrayInstanceObject contains stringObject
  //stringInstanceObject.stringMethod("stringObject")returns true if stringIntanceObject contains stringObject
  //if req.originalUrl's urlStringObject is not /login or /root and req.originalUrl's urlStringObject does not contain "reviews"
  // - add returnUrl property to sessionObject else it will be undefined
  if (
    !["/login", "/"].includes(req.originalUrl) &&
    !req.originalUrl.includes("reviews")
  ) {
    //create a returnUrl property on current sessionObject (ie using sessionObject.property to add/retrive the specifc clients data to/from the new/pre existing temporary data store where id is current unique sessionID)
    req.session.returnUrl = req.originalUrl;
  }
  //req.user will exists on current sessionObject if logged in , req.user wont exist on current sessionObject if not logged in
  //ie.foundUser/savedUser is retrivable through deserializing the one value from temporary data store into req.user,meaning foundUser/savedUser was serialized into one value and stored into temporary data store either
  //- in /login POST route after verifyCallback passed in customAuthenticationMiddlewareCallback, with it implcitly calling req.login(userModelInstanceObject,callback) (ie now logged in)
  // - or in /register POST route where req.login(userModelInstanceObject,callback) was executed explicitally in async handlerMiddlewareCallback (ie now logged in)
  //or foundUser is not retrivable through deseriazation since it was never serialized, thus req.user will be undefined (ie not logged in)
  res.locals.currentUser = req.user; //localObject.property,property = variable passed into ever ejs template file
  //req.flash("categoryKey") -  retrives messagesArrayObject of specifc "categoryKey" key from the flash property of current sessionObject
  res.locals.success = req.flash("success"); //localsObject.property, property = variable passed into every ejs template file
  res.locals.error = req.flash("error"); //localsObject.property, property = variable passed into every ejs template file
  next(); //pass to next middlewareCallback
});

// ****************************
//Other setup - passportObject
// ****************************

//adding passport-local library/plugin/authenticationStrategy to passport library therfore adding verifyCallback into passport
//passportObject.method(new PassportLocalStrategyClassObject(UserClassObject.customStaticMethod()))
//customStaticMethod on UserClassObject - authenticate() - created by password-local-mongoose plugin - creates verifyCallback
//verifyCallback - contains logic for authenticating a user - returns userModelInstanceObject or false
//passportObject.method(new passportLocalStrategyClassObject(verifyCallback)) //classObject takes verifyCallback in constructor
//passportObject.method(passportLocalStrategyInstanceObject)
passport.use(
  new PassportLocalStrategyClassObject(UserClassObject.authenticate())
);

//adding the serializeCallback created by passport-local-mongoose into passport
//customStaticMethod on UserClassObject - serializeUser() - created by password-local-mongoose plugin
//serializeCallback - serializes the userModelInstanceObject by username and makes it into one value and adds it to temporary dataStore
//passportObject.method(UserClassObject.customStaticMethod()))
//passportObject.method(callback)
passport.serializeUser(UserClassObject.serializeUser());

//adding the deserializeCallback created by passport-local-mongoose into passport
//customStaticMethod on UserClassObject - deserializeUser() - created by password-local-mongoose plugin
//deserializeCallback - deserialising the one value from temporary dataStore and turns it into the userModelInstanceObject stored in req.user(only contains username)
//passportObject.method(UserClassObject.customStaticMethod()))
//passportObject.method(callback)
passport.deserializeUser(UserClassObject.deserializeUser());

// ***************************************************************************************************************************************************************
//Using RESTful webApi crud operations pattern (route/pattern matching algorithm - order matters) + MongoDB CRUD Operations using mongoose-ODM (modelClassObject)
// ***************************************************************************************************************************************************************

//***************************************************************************************************************************************************
//Grouping diffrent sets of routes using custom routerObject (ie middlewareCallback) - combining mini express application/routerObject to main express application/appObject
//***************************************************************************************************************************************************

//**********************************
//Grouped set of USERS ROUTES
//**********************************
//httpMethod=All,path/resource-/ -(direct match/exact path)
//appObject.use("pathPrefixString",custom routerObject(ie middlewareCallback)) lets us execute custom routerObject(middlewareCallback) on any http method/every (http structured) request to specific path/resource
//execute custom routerObject(ie middlewareCallback) if (http structured) ALL request arrives at path /campgrounds
//arguments passed in to custom routerObject(ie middlewareCallback) -
//-if not already converted convert (http structured) request to req jsObject
//-if not already created create res jsObject
//-nextCallback
app.use("/", usersRoutes);

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

//*************************************************************************************************************************
//Grouped set of REVIEWS ROUTES using NESTED ROUTING - more than one dynamic variable in path - used to send campground_id
//*************************************************************************************************************************
//httpMethod=All,path/resource-/campgrounds/:id/reviews -(pattern match) //:id is a path variable
//appObject.use("pathPrefixString",custom routerObject(ie middlewareCallback)) lets us execute custom routerObject(middlewareCallback) on any http method/every (http structured) request to specific path/resource
//execute custom routerObject(ie middlewareCallback) if (http structured) ALL request arrives at path /campgrounds/:id/reviews
//arguments passed in to custom routerObject(ie middlewareCallback) -
//-if not already converted convert (http structured) request to req jsObject NOTE-Does not pass in req.params unless created custom routerObject had argument optionsObject which set {mergeParams: true}
//-if not already created create res jsObject
//-nextCallbacks
app.use("/campgrounds/:id/reviews", reviewsRoutes);

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
  //resObjects header contains signed cookie created/set by express-sessions middlewareCallback
  //responseObject.render() - converts and sends res jsObject as (http structure)response //content-type:text/html
  //thus ending request-response cycle
});

//httpMethod=POST,path/resource- /registertest  -(direct match/exact path)
//(CREATE) name-create,purpose-create new document in (users)collection of (yelp-camp-db)db
//router.method(pathString ,async handlerMiddlewareCallback) lets us execute handlerMiddlewareCallback on specifid http method/every (http structured) request to specified path/resource
//execute handlerMiddlwareCallback if (http structured) POST request arrives at path /registertest
//arguments passed in to handlerMiddlewareCallback -
//-already converted (http structured) request to req jsObject - (http structured) request body contained form data,previous middlewareCallback parsed it to req.body
//-if not already created create res jsObject
//-nextCallback
//async(ie continues running outside code if it hits an await inside) handlerMiddlwareCallback implicit returns promiseObject(resolved,undefined) - can await a promiseObject inside
//async function expression without an await is just a normal syncronous function expression
app.get("/registertest", async (req, res) => {
  //retrive username,email and password from req.body
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
  const newUser = new UserClassObject({
    email: "name@gmail.com",
    username: "namee",
  });
  //UserClassObject.customStaticMethod(newUser,"passwordString")
  //customStaticMethod on UserClassObject - async register()
  //creates salt property and adds random saltValue
  //creates hash property on newUser and adds hashValue - hashValue created by adding random saltValue to passwordString then hashing SaltedPasswordString using Pbkdf2 hashFunction
  //calls async mongoosemMethod save on newUser - creating users collection in yelp-camp-db and or adding newUser document into users collection - implicitly throws new Error("messageFromMongoose") - break validation contraints
  //serializes the newUser into one value and puts it into the temporary dataStore , retrivable by req.user
  //async customStaticMethod returns the savedUser
  const savedUser = await UserClassObject.register(newUser, "monkey"); //savedUser = dataObject ie created jsObject(document)
  res.send(savedUser);
});

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
  //resObjects header contains signed cookie created/set by express-sessions middlewareCallback
  //responseObject.render() - converts and sends res jsObject as (http structured) response //content-type:text/html
  //thus ending request-response cycle
  //next(errorClassInstanceObject); //could pass errorClassInstanceObject to defaultErrorHandlerMiddlewareCallback(invisible)
});

//**************************************************
//INVISIBLE - defaultErrorHandlerMiddlewareCallback
//**************************************************

//address - remotehost:herokuPortNo || localhost:3000
//appObject.method(port,callback) binds app to port
//execute callback when appObject start listening for (http structured) requests at port
const port = process.env.PORT || "3000"; //local env var OR heroku env var
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
