//user created module file - can contain functionObjects,variable,Class's etc which we can export
const Campground = require("../models/Campground"); //CampgroundClass(ie Model) //self created module/file needs "./" //going back a directory ..
const Review = require("../models/Review"); //ReviewClass(ie Model) //self created module/file needs "./" //going back a directory ..

//(named handlerMiddlewareCallback)
//use in specific routes ie specific method and specific path
//create method createReview on exportObject
module.exports.createReview = async (req, res) => {
  //object keys to variable - Object destructuring
  const { id } = req.params; //pathVariablesObject //:id needs to be retrived from appObjects created req.params for its middlewareCalbacks
  // ***********************************************************
  //READ - querying a collection(campgrounds) for a document by id
  // ***********************************************************
  //CampgroundClass.method(idString) ie ModelClass.method() - same as - db.campgrounds.findOne({_id:ObjectId("12345")})
  //returns thenableObject - pending to resolved(dataObject),rejected(errorObject)
  //implicitly throws new Error("messageFromMongoose") - invalid ObjectId format/length
  const foundCampground = await Campground.findById(id);
  // ***************************************************************************************
  //CREATE - creating a single new document in the (reviews) collection of (yelp-camp-db)db
  // ***************************************************************************************
  //ModelClass
  //ReviewClass(objectArgument-passed to constructor method)
  //objectArgument- jsObject{key:value} ie the new document that abides to collectionSchemaInstanceObject
  //objectArgument has validations/contraints set by collectionSchemaInstanceObject
  //validations/contraints -
  //none
  //create modelInstanceObject(ie document) - with new keyword and ReviewClass constructor method
  const newReview = new Review(req.body.review); //form data/req.body is jsObject //{groupKey:{key/name:inputValue,key/name:inputValue}}
  //************************************************************************************************
  //UPDATE - updating newReview(ie document) - ie assosicate current foundUser/savedUser to the newReview through referenceing
  //************************************************************************************************
  //retiving foundUser/savedUser from current sessionObject and setting its foundUsers _id property as newReview author property
  //req.user._id has to follow validations/contraints
  //can set the newReview author to the full userObject OR just the userObject._id both only store the id
  newReview.author = req.user._id;
  // ****************************************************************************************************************
  //UPDATE - updating foundCampground (ie document)  - ie associate newReview to foundCampground through referencing
  // ****************************************************************************************************************
  //modelInstanceObject.property = arrayInstObj.push(newReview) //newReview has validations/contraints
  //Seems like pushing on entire newReview(ie document), but we only push on the ID's to arrayInstObj
  foundCampground.reviews.push(newReview);
  //modelInstance.save() returns promiseInstObj - pending to resolved(dataObject),rejected(errorObject) ie(breaking validation/contraints)
  //creates (reviews)collection in (yelp-camp-db)db if not existing already and adds (newReview)document into the (reviews)collection
  //implicitly throws new Error("messageFromMongoose") - break validation contraints
  const savedReview = await newReview.save(); //savedReview = dataObject ie created jsObject(document)
  //updates (foundCampground)document in the (campgrounds) collection
  //implicitly throws new Error("messageFromMongoose") - break validation contraints
  const updatedCampground = await foundCampground.save(); //updatedCampground = dataObject ie updated jsObject(document)
  req.flash("success", "Successfully created a new review!"); //stores the "messageValueStringInstObj" in an stringInstObjArrayInstObj in the flash property of current sessoinObject under the key "categoryKey"
  //fix for page refresh sending duplicate (http structured) POST request -
  res.redirect(`/campgrounds/${updatedCampground._id}`);
  //responseObject.redirect("showPath") updates res.header, sets res.statusCode to 302-found ie-redirect ,sets res.location to /campgrounds/:id
  //resObjects header contains signed cookie created/set by express-sessions middlewareCallback
  //responseObject.redirect("showPath") - converts and sends res jsObject as (http structure)response // default content-type:text/html
  //thus ending request-response cycle
  //browser sees (http structured) response with headers and makes a (http structured) GET request to location ie default(get)/campgrounds/:id
};

//(named handlerMiddlewareCallback)
//use in specific routes ie specific method and specific path
//create method deleteReview on exportObject
module.exports.deleteReview = async (req, res) => {
  //object keys to variable - Object destructuring
  const { id, reviewId } = req.params; //pathVariablesObject
  // ****************************************************************************************************************************************************************************************
  //UPDATE - querying a collection(campgrounds) for a document by id then updating it - ie deleting reviewModeInstance id reference in campgroundModelInstances reviews arrayObject property
  // ****************************************************************************************************************************************************************************************
  //ModelClass
  //CampgroundClass.method(idString,updateObject,optionObject) ie ModelClass.method() - same as - db.campgrounds.findOneAndUpdate(({_id:ObjectId("12345")},{$pull:{reviews:ObjectId("123123"),...}},{returnNewDocument:true})
  //returns thenableObject - pending to resolved(dataObject),rejected(errorObject) ie(breaking validation/contraints)
  //To run validations/contraints when updating we need to set runValidators(key) in optionsObject
  //To get the jsObject(document) after update, we need to set new(key) in optionsObject
  //queries (campgrounds)collection of (yelp-camp-db)db for single document by idString and updates/replaces the document with updateObject(document)
  //updateObject contains updateOperator - $pull - removes from existing reviews arrayInstObj all instances of reviewId
  //implicitly throws new Error("messageFromMongoose") - invalid ObjectId format/length or break validation constraints
  const updatedCampground = await Campground.findByIdAndUpdate(
    id,
    {
      $pull: { reviews: reviewId },
    },
    { runValidators: true, new: true }
  ); //updatedCampground = dataObject ie single first matching jsObject(document) after it was updated
  // ******************************************************************************
  //DELETE - querying a collection(reviews) for a document by id then deleting it
  // ******************************************************************************
  //ModelClass
  //ReviewClass.method(idString) ie ModelClass.method() - same as - db.reviews.findOneAndDelete({_id:ObjectId("12345")})
  //returns thenableObject - pending to resolved(dataObject),rejected(errorObject)
  //queries (reviews)collection of (yelp-camp-db)db for single document by idString and deletes the document
  //implicitly throws new Error("messageFromMongoose") - invalid ObjectId format/length or break validation constraints
  const deletedReview = await Review.findByIdAndDelete(reviewId); //deletedReview = dataObject ie single first matching jsObject(document) that was deleted
  req.flash("success", "Successfully deleted review!"); //stores the "messageValueStringInstObj" in an stringInstObjArrayInstObj in the flash property of current sessoinObject under the key "categoryKey"
  //fix for page refresh sending duplicate (http structured) DELETE request -
  res.redirect(`/campgrounds/${updatedCampground._id}`);
  //responseObject.redirect("showPath") updates res.header, sets res.statusCode to 302-found ie-redirect ,sets res.location to /campgrounds/:id
  //resObjects header contains signed cookie created/set by express-sessions middlewareCallback
  //responseObject.redirect("showPath") - converts and sends res jsObject as (http structure)response // default content-type:text/html
  //thus ending request-response cycle
  //browser sees (http structured) response with headers and makes a (http structured) GET request to location ie default(get)/campgrounds/:id
};
