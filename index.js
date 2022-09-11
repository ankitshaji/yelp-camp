//main file that gets passed in other npm package modules or user created modules
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
const session = require("express-session"); //functionObject //express-session module
const flash = require("connect-flash"); //functionObject //connect-flash module

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
//middlewareCallback - Purpose: Accept form data - (http structured) POST request body parsed to req.body before before moving to next middlewareCallback
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
//middlewareCreationFunctionObject(argument) - argument is sessionOptionsObject
//middlewareCreationFunctionObject execution creates middlewareCallback
//Purpose:
//case1-
//On first (http strucuted) request, express-sessions middlewareCallback auto creates a session(jsObject) property on reqObject (associated to a newly created temporary data store)
//it creates a new  sessionStore property on reqObject containing the temporary data store(MemoryStore)
//it creates and pupulates sessionID property in reqObject with a unique sessionID
//it creates a signed cookie with HMACValue (HMACValue is created from (req.sessionID + "secretString" + sha256HashFunction))
//req.session.property is used to add the specifc clients data to the newly created temporary data store where id is current unique sessionID
//it sets the signed cookie in the resObjects header (Set-Cookie:key:value)
//case2-
//On subsequent (http strucutred) requests from same client contain signed cookie in its header (Cookie:key:value)
//express-sessions middlewareCallback unsigns the cookies HMACValue to get the unique sessionID associate to that unique client
//it creates and pupulates sessionID property in reqObject with the current unique sessionID of client
//it creates a session(jsObject) property on reqObject (assoicated with the pre existing temporary data store)
//it creates a sessionStore property on reqObject containing the pre existing temporary data store(MemoryStore)
//req.session.property is used to retrive the specfic clients stored data from the pre existing temporary data store where id is current unique sessionID from signed cookie received from unique client
//it creates signed cookie with HMACValue (HMACValue is created from (req.sessionID + "secretString" + sha256HashFunction))
//it sets this signed cookie in the resObjects header (Set-Cookie:key:value)
//sidenode - (http structure) request could be from unique browserClients or unique postmanClients
const sessionOptionsObject = {
  secret: "thisismysecret",
  saveUninitialized: true,
  resave: false,
  cookie: {
    //default true //cannot access signed cookie in client side script - minimize damage of (XSS)cross-site scripting attack
    httpOnly: true,
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

//(custom middlewareCallback)
//app.use(middlewareCallback) //app.use() lets us execute middlewareCallback on any http method/every (http structured) request to any path
//alternative way to pass variable into every ejs template file - //propertie in localObject is a variable in ejs template file
app.use((req, res, next) => {
  //req.flash("categoryKey") -  retrives messagesArrayObject of specifc "categoryKey" key from the flash property of current sessionObject
  res.locals.success = req.flash("success"); //localsObject.property, property = variable passed into every ejs template file
  res.locals.error = req.flash("error"); //localsObject.property, property = variable passed into every ejs template file
  next(); //pass to next middlewareCallback
});

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

//*************************************************************************************************************************
//Grouped set of REVIEWS ROUTES using NESTED ROUTING - more than one dynamic variable in path - used to send campground_id
//*************************************************************************************************************************
//httpMethod=All,path/resource-/campgrounds/:id/reviews -(pattern match) //:id is a path variable
//appObject.use("pathPrefixString",custom routerObject(ie middlewareCallback)) lets us execute custom routerObject(middlewareCallback) on any http method/every (http structured) request to specific path/resource
//execute custom routerObject(ie middlewareCallback) if (http structured) ALL request arrives at path /campgrounds/:id/reviews
//arguments passed in to custom routerObject(ie middlewareCallback) -
//-if not already converted convert (http structured) request to req jsObject NOTE-Does not pass in req.params unless created custom routerObject had argument optionsObject which set {mergeParams: true}
//-if not already created create res jsObject
//-nextCallback
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

//address - localhost:3000
//appObject.method(port,callback) binds app to port
//execute callback when appObject start listening for (http structured) requests at port
app.listen(3000, () => {
  console.log("Listening on port 3000");
});
