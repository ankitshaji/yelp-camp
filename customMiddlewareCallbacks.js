//user created module file - can contain functionObjects,variable,Class's etc which we can export
const {
  joiCampgroundSchemaObject,
  joiReviewSchemaObject,
} = require("./joiSchemas"); //exportObject destructured ie exportObject.property  //self created module/file needs "./"
const CustomErrorClassObject = require("./utils/CustomError"); //CustomErrorClassObject //self created module/file needs "./"
const Campground = require("./models/Campground"); //CampgroundClass(ie Model) //self created module/file needs "./"
const Review = require("./models/Review"); //ReviewClass(ie Model) //self created module/file needs "./"

//(custom middlewareCallback)
//use in specific routes ie specific method and specific path
//create method checkLoggedIn on exportObject
module.exports.checkLoggedIn = (req, res, next) => {
  //requestObject.passportObjectMethod() //returns booleanObject - true if req.user exists on current sessionObject, ie logged in , false if req.userdoes not exist on current sessionObject - undefined ie not logged in
  //ie.check if foundUser/savedUser is retrivable through deserializing the one value from temporary data store into req.user,meaning foundUser/savedUser was serialized into one value and stored into temporary data store either
  //- in /login POST route after verifyCallback passed in customAuthenticationMiddlewareCallback, with it implcitly calling req.login(userModelInstanceObject,callback) (ie now logged in)
  // - or in /register POST route where req.login(userModelInstanceObject,callback) was executed explicitally in async handlerMiddlewareCallback (ie now logged in)
  //or foundUser is not retrivable through deseriazation since it was never serialized, thus req.user will be undefined (ie not logged in)
  if (!req.isAuthenticated()) {
    //req.user does not exist on current sessionObject, ie not logged in
    req.flash("error", "You must be signed in"); //stores the "messageValueStringInstObj" in an stringInstObjArrayInstObj in the flash property of current sessoinObject under the key "categoryKey"
    //fix for page refresh sending duplicate (http structured) GET request -
    return res.redirect("/login"); //return to not run rest of code
    //responseObject.redirect("loginPath") updates res.header, sets res.statusCode to 302-found ie-redirect ,sets res.location to /login
    //resObjects header contains signed cookie created/set by express-sessions middlewareCallback
    //responseObject.redirect("loginPath") - converts and sends res jsObject as (http structure)response // default content-type:text/html
    //thus ending request-response cycle
    //browser sees (http structured) response with headers and makes a (http structured) GET request to location ie default(get)/login
  }
  //req.user exists on current sessionObject, ie logged in
  next(); //pass to next middlewareCallback
};

//(custom middlewareCallback)
//use in specific routes ie specific method and specific path
//create method checkLoggedIn on exportObject
module.exports.validateCampground = (req, res, next) => {
  //req.body.campground can have undefined value if sent from postman
  //server side validation check - (import joiCampgroundSchemaObject)

  //passing reqBodyObject through joiCampgroundSchemaObject
  //joiCampgroundSchemaObject.method(reqBodyObject) creates object
  //key to variable - no property/undefined if no validation error - object destructuring
  const { error } = joiCampgroundSchemaObject.validate(req.body);
  if (error) {
    //error.details is an objectArrayInstObj//objectArrayInstObj.map(callback)->stringInstObjArrayInstObj.join("seperator")->stringInstObj
    const msg = error.details.map((el) => el.message).join(",");
    //explicitly throw new CustomErrorClassObject("message",statusCode)
    throw new CustomErrorClassObject(msg, 400);
    //implicite next(customErrorClassInstanceObject) passes customErrorClassInstanceObject to next errorHandlerMiddlewareCallback
  }
  next(); //passing to next middlewareCallback
};

//(custom middlewareCallback)
//use in specific routes ie speicifc method and specific path
//create async method checkLoggedIn on exportObject
module.exports.verifyAuthor = async (req, res, next) => {
  //authorization check - check if current user has permission to update/delete foundCampground or view edit form

  //object keys to variable - Object destructuring
  const { id } = req.params; //pathVariablesObject
  // ***********************************************************
  //READ - querying a collection(campgrounds) for a document by id
  // ***********************************************************
  //CampgroundClass.method(idStringInstObj) ie modelClassObject.method() - same as - db.campgrounds.findOne({_id:ObjectId("12345")})
  //returns thenableObject - pending to resolved(dataObject),rejected(errorObject)
  //implicitly throws new Error("messageFromMongoose") - invalid ObjectId format/length
  const foundCampground = await Campground.findById(id);
  //foundCampground null value auto set by mongodb for valid format ids - null variable shouldnt be pass to ejs file
  //!null = true
  if (!foundCampground) {
    req.flash("error", "Cannot find that campground!"); //stores the "messageValueStringInstObj" in an stringInstObjArrayInstObj in the flash property of current sessoinObject under the key "categoryKey"
    //fix for page refresh sending duplicate (http structured) GET/PUT/DELETE request -
    return res.redirect("/campgrounds"); //return to not run rest of code
    //responseObject.redirect("indexPath") updates res.header, sets res.statusCode to 302-found ie-redirect ,sets res.location to /campgrounds
    //resObjects header contains signed cookie created/set by express-sessions middlewareCallback
    //responseObject.redirect("indexPath") - converts and sends res jsObject as (http structure)response // default content-type:text/html
    //thus ending request-response cycle
    //browser sees (http structured) response with headers and makes a (http structured) GET request to location ie default(get)/campgrounds
  }
  //fix for - postman direct request containing wrong users signed cookie and direct GET request from browser to edit form with users wrong signed cookie
  //prevents updating/deleting foundCampground OR prevents displaying edit form - if req.user on current sessionObject's _id property is not equal to the foundCampgrounds author's id property - logged in but not right author
  //it assumes we mean foundCampground.author._id for comparisons-->
  if (!foundCampground.author.equals(req.user._id)) {
    req.flash(
      "error",
      "Permission Denied: You are not the author of this campground."
    ); //stores the "messageValueStringInstObj" in an stringInstObjArrayInstObj in the flash property of current sessoinObject under the key "categoryKey"
    //fix for page refresh sending duplicate (http structured) GET/PUT/DELETE request -
    return res.redirect(`/campgrounds/${foundCampground._id}`);
    //responseObject.redirect("showPath") updates res.header, sets res.statusCode to 302-found ie-redirect ,sets res.location to /campgrounds/:id
    //resObjects header contains signed cookie created/set by express-sessions middlewareCallback
    //responseObject.redirect("showPath") - converts and sends res jsObject as (http structure)response // default content-type:text/html
    //thus ending request-response cycle
    //browser sees (http structured) response with headers and makes a (http structured) GET request to location ie default(get)/campgrounds/:id
  }
  next(); //passing to next middlewareCallback
};

//(custom middlewareCallback)
//use in specific routes ie speicifc method and specific path
//create async method checkLoggedIn on exportObject
module.exports.verifyReviewAuthor = async (req, res, next) => {
  //authorization check - check if current user has permission to delete foundReview

  //object keys to variable - Object destructuring
  const { id, reviewId } = req.params; //pathVariablesObject //:id needs to be retrived from appObjects created req.params for its middlewareCalbacks
  // ***********************************************************
  //READ - querying a collection(reviews) for a document by id
  // ***********************************************************
  //ReviewClass.method(idStringInstObj) ie modelClassObject.method() - same as - db.reviews.findOne({_id:ObjectId("12345")})
  //returns thenableObject - pending to resolved(dataObject),rejected(errorObject)
  //implicitly throws new Error("messageFromMongoose") - invalid ObjectId format/length
  const foundReview = await Review.findById(reviewId);
  //foundReview null value auto set by mongodb for valid format ids - null variable shouldnt be pass to ejs file
  //!null = true
  if (!foundReview) {
    req.flash("error", "Cannot find that review!"); //stores the "messageValueStringInstObj" in an stringInstObjArrayInstObj in the flash property of current sessoinObject under the key "categoryKey"
    //fix for page refresh sending duplicate (http structured) DELETE request -
    return res.redirect("/campgrounds"); //return to not run rest of code
    //responseObject.redirect("indexPath") updates res.header, sets res.statusCode to 302-found ie-redirect ,sets res.location to /campgrounds
    //resObjects header contains signed cookie created/set by express-sessions middlewareCallback
    //responseObject.redirect("indexPath") - converts and sends res jsObject as (http structure)response // default content-type:text/html
    //thus ending request-response cycle
    //browser sees (http structured) response with headers and makes a (http structured) GET request to location ie default(get)/campgrounds
  }
  //fix for - postman direct delete request containing wrong users signed cookie
  //prevents deleting foundReview - if req.user on current sessionObject's _id property is not equal to the foundReviews author's id property - logged in but not right review author
  //it assumes we mean foundReview.author._id for comparisons-->
  if (!foundReview.author.equals(req.user._id)) {
    req.flash(
      "error",
      "Permission Denied: You are not the author of this review."
    ); //stores the "messageValueStringInstObj" in an stringInstObjArrayInstObj in the flash property of current sessoinObject under the key "categoryKey"
    //fix for page refresh sending duplicate (http structured) DELETE request -
    return res.redirect(`/campgrounds/${id}`);
    //responseObject.redirect("showPath") updates res.header, sets res.statusCode to 302-found ie-redirect ,sets res.location to /campgrounds/:id
    //resObjects header contains signed cookie created/set by express-sessions middlewareCallback
    //responseObject.redirect("showPath") - converts and sends res jsObject as (http structure)response // default content-type:text/html
    //thus ending request-response cycle
    //browser sees (http structured) response with headers and makes a (http structured) GET request to location ie default(get)/campgrounds/:id
  }
  next(); //passing to next middlewareCallback
};

//(custom middlewareCallback)
//use in specific routes ie specific method and specific path
module.exports.validateReview = (req, res, next) => {
  //req.body.review can have undefined value if sent from postman
  //server side validation check - (import joiReviewSchemaObject)

  //passing reqBodyObject through joiReviewSchemaObject
  //joiReviewSchemaObject.method(reqBodyObject) creates object
  //key to variable - no property/undefined if no validation error - object destructuring
  const { error } = joiReviewSchemaObject.validate(req.body);
  if (error) {
    //error.details is an objectArrayInstObj//objectArrayObject.map(callback)->stringInstObjArrayInstObj.join("seperator")->stringInstObj
    const msg = error.details.map((el) => el.message).join(",");
    //explicitly throw new CustomErrorClassObject("message",statusCode)
    throw new CustomErrorClassObject(msg, 400);
    //implicite next(customErrorClassInstanceObject) passes customErrorClassInstanceObject to next errorHandlerMiddlewareCallback
  }
  next(); //passing to next middlewareCallback
};
