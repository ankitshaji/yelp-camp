//user created module file - can contain functionObjects,variable,Class's etc which we can export
const User = require("../models/User"); //UserClass(ie Model) //self created module/file needs "./" //going back a directory ..

//(named handlerMiddlewareCallback)
//use in specific routes ie specific method and specific path
//create method renderRegisterForm on exportObject
module.exports.renderRegisterForm = (req, res) => {
  res.render("users/register");
  //render(ejs filePath) - executes js - converts  ejs file into pure html
  //resObjects header contains signed cookie created/set by express-sessions middlewareCallback
  //responseObject.render() - converts and sends res jsObject as (http structure)response //content-type:text/html
  //thus ending request-response cycle
};

//(named handlerMiddlewareCallback)
//use in specific routes ie specific method and specific path
//create method createUser on exportObject
module.exports.createUser = async (req, res) => {
  try {
    //object keys to variable - Object destructuring
    const { email, username, password } = req.body; //form data/req.body is jsObject //{key/name:inputValue,key/name:inputValue}}
    // ***************************************************************************************
    //CREATE - creating a single new document in the (users) collection of (yelp-camp-db)db
    // ***************************************************************************************
    //ModelClass
    //UserClass(objectArgument-passed to constructor method)
    //objectArgument- jsObject{key:value} ie the new document that abides to collectionSchemaInstanceObject
    //objectArgument has validations/contraints set by collectionSchemaInstanceObject
    //validations/contraints -
    //email cannot be empty + other validations/constraints set by passport-local-mongoose for its fields
    //create modelInstanceObject(ie document) - with new keyword and UserClass constructor method
    const newUser = new User({ email: email, username: username });
    //UserClass.customStaticMethod(newUser,"passwordString")
    //customStaticMethod on UserClass - async register()
    //creates salt property on newUser and adds random saltValue
    //creates hash property on newUser and adds hashValue - hashValue created by adding random saltValue to passwordString then hashing SaltedPasswordString using Pbkdf2 hashFunction
    //calls async mongoosemMethod save on newUser - creating users collection in yelp-camp-db and or adding newUser document into users collection - can implicitly throw new Error("messageFromMongoose") - if validation/contraints broken
    //if async mongooseMethod implicity throws Error("messageFromMongoose") inside async customStaticMethod , it catches that errorInstanceObject and throws its own new Error("messageFromPassportLocalMongoose")
    //async customStaticMethod returns the savedUser
    const savedUser = await User.register(newUser, password); //savedUser = dataObject ie created jsObject(document)
    //reqObject.passportObjectMethod(savedUser,callback) //returns promiseInstObj
    //passportObjectMethod execution adds the req.user to the current sessionObject + clears previous existing current sessionObject properties - could set keepSessionInfo:true in req.login() to prevent this
    //ie.passportObjectMethod serializes the savedUser into one value and stores it into temporary data store , making savedUser retrivable through deserializing the one value into req.user
    //it executes the callback with parameter errorInstanceObject if it occured ,else execute callback with empty parameter
    //callback sets success flash message and redirects to /campgrounds
    req.login(savedUser, (err) => {
      if (err) return next(err); //return to not run rest of code - next(e) passes erroInstanceObject to next customErrorHandlerMiddlewareCallback
      req.flash("success", "Welcome to Yelp Camp!"); //stores the "messageValueStringInstObj" in an stringInstObjArrayInstObj in the flash property of current sessoinObject under the key "categoryKey"
      //fix for page refresh sending duplicate (http structured) POST request -
      res.redirect("/campgrounds");
      //responseObject.redirect("indexPath") updates res.header, sets res.statusCode to 302-found ie-redirect ,sets res.location to /campgrounds
      //resObjects header contains signed cookie created/set by express-sessions middlewareCallback
      //responseObject.redirect("indexPath") - converts and sends res jsObject as (http structure)response // default content-type:text/html
      //thus ending request-response cycle
      //browser sees (http structured) response with headers and makes a (http structured) GET request to location ie default(get)/campgrounds
    });
  } catch (e) {
    //(errorInstanceObject)
    //we catch the implicitly thrown new Error("messageFromPassportLocalMongoose") early - closest catch - therefore .catch does not run - we dont pass it in next(e) to customErrorHandlerMiddlewareCallback
    req.flash("error", e.message); //stores the "messageValueStringInstObj" in an stringInstObjArrayInstObj in the flash property of current sessoinObject under the key "categoryKey"
    res.redirect("/register");
    //responseObject.redirect("registerPath") updates res.header, sets res.statusCode to 302-found ie-redirect ,sets res.location to /register
    //resObjects header contains signed cookie created/set by express-sessions middlewareCallback
    //responseObject.redirect("registerPath") - converts and sends res jsObject as (http structure)response // default content-type:text/html
    //thus ending request-response cycle
    //browser sees (http structured) response with headers and makes a (http structured) GET request to location ie default(get)/register
  }
};

//(named handlerMiddlewareCallback)
//use in specific routes ie specific method and specific path
//create method renderLoginForm on exportObject
module.exports.renderLoginForm = (req, res) => {
  res.render("users/login");
  //render(ejs filePath) - executes js - converts  ejs file into pure html
  //resObjects header contains signed cookie created/set by express-sessions middlewareCallback
  //responseObject.render() - converts and sends res jsObject as (http structure)response //content-type:text/html
  //thus ending request-response cycle
};

//(named handlerMiddlewareCallback)
//use in specific routes ie specific method and specific path
//create method authenticatedUserRedirect on exportObject
module.exports.authenticatedUserRedirect = (req, res) => {
  req.flash("success", "Welcome back!"); //stores the "messageValueStringInstObj" in an stringInstObjArrayInstObj in the flash property of current sessoinObject under the key "categoryKey"
  //req.session.returnUrl retrives urlStringObject from returnUrl property of current sessionObject - requires keepSessionInfo:true in optionsObject - else req.login() implicity execution clears previous existing current sessionObject properties
  //req.session.returnUrl is undefined if directly coming from /login GET form route
  //undefined(falsy) or stringObject(truthy) / urlStringObject(truthy) or stringObject(dont check)
  const returnUrl = req.session.returnUrl || "/campgrounds";
  //deletes the returnUrl property of current sessionObject
  delete req.session.returnUrl;
  //fix for page refresh sending duplicate (http structured) POST request -
  res.redirect(returnUrl);
  //responseObject.redirect("indexPath") updates res.header, sets res.statusCode to 302-found ie-redirect ,sets res.location to /campgrounds
  //resObjects header contains signed cookie created/set by express-sessions middlewareCallback
  //responseObject.redirect("indexPath") - converts and sends res jsObject as (http structure)response // default content-type:text/html
  //thus ending request-response cycle
  //browser sees (http structured) response with headers and makes a (http structured) GET request to location ie default(get)/campgrounds
};

//(named handlerMiddlewareCallback)
//use in specific routes ie specific method and specific path
//create method logoutUser on exportObject
module.exports.logoutUser = (req, res) => {
  //reqObject.passportObjectMethod(callback)
  //passportObjectMethod execution removes the req.user from the current sessionObject + clears previous existing current sessionObject properties - could set keepSessionInfo:true in req.logout() to prevent this
  //ie.foundUser is retrivable through deserializing the one value from temporary data store into req.user,meaning foundUser was serialized into one value and stored into temporary data store after verifyCallback passed in customAuthenticationMiddlewareCallback at one point
  //it executes the callback with parameter errorInstanceObject if it occured else execute callback with empty parameter
  //callback sets success flash message and redirects to /campgrounds
  req.logout(function (err) {
    if (err) {
      return next(err); //return to not run rest of code - next(e) passes erroInstanceObject to next customErrorHandlerMiddlewareCallback
    }
    req.flash("success", "Successfully logged out"); //stores the "messageValueStringInstObj" in an stringInstObjArrayInstObj in the flash property of current sessoinObject under the key "categoryKey"
    //fix for page refresh sending duplicate (http structured) POST request -
    res.redirect("/campgrounds"); //responseObject.redirect("indexPath") updates res.header, sets res.statusCode to 302-found ie-redirect ,sets res.location to /campgrounds
    //resObjects header contains signed cookie created/set by express-sessions middlewareCallback
    //responseObject.redirect("indexPath") - converts and sends res jsObject as (http structure)response // default content-type:text/html
    //thus ending request-response cycle
    //browser sees (http structured) response with headers and makes a (http structured) GET request to location ie default(get)/campgrounds
  });
};
