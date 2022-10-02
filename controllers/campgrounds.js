//user created module file - can contain functionObjects,variable,classObjects etc which we can export

const CampgroundClassObject = require("../models/campground"); //CampgroundtClassObject(ie Model) //self created module/file needs "./" //going back a directory ..
const { cloudinary } = require("../cloudinary"); //exportObject.property //self created module/file needs "./" //going back a directory .. //index.js is auto found ny node

//(named handlerMiddlewareCallback)
//use in specific routes ie specific method and specific path
//create method index on exportObject
module.exports.index = async (req, res) => {
  // *****************************************************
  //READ - querying a collection for a document/documents
  // *****************************************************
  //campgroundClassObject.method(queryObject) ie modelClassObject.method() - same as - db.campgrounds.find({})
  //returns thenableObject - pending to resolved(dataObject),rejected(errorObject)
  //implicitly throws new Error("messageFromMongoose")
  const campgrounds = await CampgroundClassObject.find({}); //campgrounds = dataObject ie array of all jsObjects(documents)
  res.render("campgrounds/index", { campgrounds: campgrounds });
  //responseObject.render(ejs filePath,variableObject) - sends variable to ejs file - executes js - converts  ejs file into pure html
  //resObjects header contains signed cookie created/set by express-sessions middlewareCallback
  //responseObject.render() - converts and sends res jsObject as (http structure)response //content-type:text/html
  //thus ending request-response cycle
};

//(named handlerMiddlewareCallback)
//use in specific routes ie specific method and specific path
//create method renderNewForm on exportObject
module.exports.renderNewForm = (req, res) => {
  res.render("campgrounds/new");
  //render(ejs filePath) - executes js - converts  ejs file into pure html
  //resObjects header contains signed cookie created/set by express-sessions middlewareCallback
  //responseObject.render() - converts and sends res jsObject as (http structure)response //content-type:text/html
  //thus ending request-response cycle
};

//(named handlerMiddlewareCallback)
//use in specific routes ie specific method and specific path
//create method showCampground on exportObject
module.exports.showCampground = async (req, res) => {
  //could use campgroundTitle if it was webSlug(url safe)
  //object keys to variable - Object destructuring
  const { id } = req.params; //pathVariablesObject
  // *************************************************
  //READ - querying a collection for a document by id
  // *************************************************
  //(part-1)
  //ModelClassObject.method(idString) - same as - db.campgrounds.findOne({_id:ObjectId("12345")})
  //find modelInstanceObject(ie document) that matches id -> CampgroundClassObject.findById(id) -> returns thenableObject(pending,undefined)
  //(part-2)
  //thenableObject(resolved,valueObject).queryBuilderMethod({path:"reviews",populate:{path:"author"}}) = new thenableObject(pending,undefined)
  //new thenableObject(pending,undefined) ->
  //finds all modelInstanceObjects(ie documents) from reviews(collection) that have matching id in reviews property + find modeInstanceObjects(ie document) from users(collection) that has matching id in author property of each found review
  //the populate(doublePopulatePathObject)(queryBuilderMedthod()) then combines its valueObject with the previousValueObject to create the newValueObject
  //thus newValueObject is the output of (populating the array of ID's from the previousValueObjects reviews property +
  //populating the ID in the previousValueObejcts review properties author property) with the documents in the currentValueObject
  //(part-3)
  //thenableObject(resolved,newValueObject).queryBuilderMethod("author") = new thenableObject(pending,undefined)
  //new thenableObject(pending,undefined) -> finds modelInstanceObject(ie document) from users(collection) that has matching id in author property
  //the populate("author")(queryBuilderMedthod()) then combines its valueObject with the previousNewValueObject to create the newestValueObject
  //thus newestValueObject is the output of populating  the ID in the previousNewValueObject author property with the document in the currentValueObject
  //NOTE - can populate only specific piece of document instead of entire document
  //implicitly throws new Error("messageFromMongoose") - invalid ObjectId format/length
  const foundCampground = await CampgroundClassObject.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("author"); //foundCampground = dataObject ie single first matching jsObject(document)
  //foundCampground null value auto set by mongodb for valid format ids - null variable shouldnt be pass to ejs file
  //!null = true
  if (!foundCampground) {
    req.flash("error", "Cannot find that campground!"); //stores the "messageValue" in an arrayObject in the flash property of current sessoinObject under the key "categoryKey"
    //fix for page refresh sending duplicate (http structured) DELETE request -
    return res.redirect("/campgrounds"); //return to not run rest of code
    //responseObject.redirect("indexPath") updates res.header, sets res.statusCode to 302-found ie-redirect ,sets res.location to /campgrounds
    //resObjects header contains signed cookie created/set by express-sessions middlewareCallback
    //responseObject.redirect("indexPath") - converts and sends res jsObject as (http structure)response // default content-type:text/html
    //thus ending request-response cycle
    //browser sees (http structured) response with headers and makes a (http structured) GET request to location ie default(get)/campgrounds
  }
  res.render("campgrounds/show", { campground: foundCampground }); //passing in foundCampground with reviews property populated
  //responseObject.render(ejs filePath,variableObject) - sends variable to ejs file - executes js - converts  ejs file into pure html
  //resObjects header contains signed cookie created/set by express-sessions middlewareCallback
  //responseObject.render() - converts and sends res jsObject as (http structure)response //content-type:text/html
  //thus ending request-response cycle
};

//(named handlerMiddlewareCallback)
//use in specific routes ie specific method and specific path
//create method createCampground on exportObject
module.exports.createCampground = async (req, res, next) => {
  // ***************************************************************************************
  //CREATE - creating a single new document in the (campgrounds) collection of (yelp-camp-db)db
  // ***************************************************************************************
  //modelClass
  //campgroundClassObject(objectArgument-passed to constructor method)
  //objectArgument- jsObject{key:value} ie the new document that abides to collectionSchemaInstanceObject
  //objectArgument has validations/contraints set by collectionSchemaInstanceObject
  //validations/contraints -
  //none
  //create modelInstanceObject(ie document) - with new keyword and campgroundClassObject constructor method
  const newCampground = new CampgroundClassObject(req.body.campground); //form data/req.body is jsObject //{groupKey:{key/name:inputValue,key/name:inputValue}}
  //author jsObject property is undefined
  //auto creates empty reviews arrayObject property
  //auto creates empty images arrayObject property
  //************************************************************************************************************************************************************
  //UPDATE - updating newCampground(ie document) - ie adding the newly created arrayObject from req.files into the images arrayObject property on newCampground
  //************************************************************************************************************************************************************
  //arrayObejct.arrayMethod() //returns new arrayObject //implicit return of object in callback needs parenthesis
  //[{url:f.path,filename:f.filename}] has to follow validations/contraints
  newCampground.images = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  //************************************************************************************************************************************
  //UPDATE - updating newCampground(ie document) - ie assosicate current foundUser/savedUser to  the newCampground through referenceing
  //************************************************************************************************************************************
  //retiving foundUser/savedUser from current sessionObject and setting its foundUsers _id property as newCampgrounds author property
  //req.user._id has to follow validations/contraints
  //can set the newCampground author to the full userObject OR just the userObject._id both only store the id
  newCampground.author = req.user._id;
  //modelInstance.save() returns promiseObject - pending to resolved(dataObject),rejected(errorObject) ie(breaking validation/contraints)
  //creates (campgrounds)collection in (yelp-camp-db)db if not existing already and adds (newCampground)document into the (campgrounds)collection
  //implicitly throws new Error("messageFromMongoose") - break validation contraints
  const savedCampground = await newCampground.save(); //savedCampground = dataObject ie created jsObject(document)
  req.flash("success", "Successfully created a new campground!"); //stores the "messageValue" in an arrayObject in the flash property of current sessoinObject under the key "categoryKey"
  //fix for page refresh sending duplicate (http structured) POST request -
  res.redirect(`/campgrounds/${newCampground._id}`);
  //responseObject.redirect("showPath") updates res.header, sets res.statusCode to 302-found ie-redirect ,sets res.location to /campgrounds/:id
  //resObjects header contains signed cookie created/set by express-sessions middlewareCallback
  //responseObject.redirect("showPath") - converts and sends res jsObject as (http structure)response // default content-type:text/html
  //thus ending request-response cycle
  //browser sees (http structured) response with headers and makes a (http structured) GET request to location ie default(get)/campgrounds/:id
};

//(named handlerMiddlewareCallback)
//use in specific routes ie specific method and specific path
//create method renderEditForm on exportObject
module.exports.renderEditForm = async (req, res) => {
  //could use campgroundTitle if it was webSlug(url safe)
  //object keys to variable - Object destructuring
  const { id } = req.params; //pathVariablesObject
  // ***********************************************************
  //READ - querying a collection(campgrounds) for a document by id
  // ***********************************************************
  //campgroundClassObject.method(idString) ie modelClassObject.method() - same as - db.campgrounds.findOne({_id:ObjectId("12345")})
  //returns thenableObject - pending to resolved(dataObject),rejected(errorObject)
  //implicitly throws new Error("messageFromMongoose") - invalid ObjectId format/length
  const foundCampground = await CampgroundClassObject.findById(id); //foundCampground = dataObject ie single first matching jsObject(document)
  //foundCampground null value auto set by mongodb for valid format ids - null variable shouldnt be pass to ejs file
  //!null = true
  if (!foundCampground) {
    req.flash("error", "Cannot find that campground!"); //stores the "messageValue" in an arrayObject in the flash property of current sessoinObject under the key "categoryKey"
    //fix for page refresh sending duplicate (http structured) GET request -
    return res.redirect("/campgrounds"); //return to not run rest of code
    //responseObject.redirect("indexPath") updates res.header, sets res.statusCode to 302-found ie-redirect ,sets res.location to /campgrounds
    //resObjects header contains signed cookie created/set by express-sessions middlewareCallback
    //responseObject.redirect("indexPath") - converts and sends res jsObject as (http structure)response // default content-type:text/html
    //thus ending request-response cycle
    //browser sees (http structured) response with headers and makes a (http structured) GET request to location ie default(get)/campgrounds
  }
  //passing in foundCampground to prepoppulate form
  res.render("campgrounds/edit", { campground: foundCampground });
  //responseObject.render(ejs filePath,variableObject) - sends renamed variable to ejs file - executes js - converts  ejs file into pure html
  //resObjects header contains signed cookie created/set by express-sessions middlewareCallback
  //responseObject.render() - converts and sends res jsObject as (http structure)response //content-type:text/html
  //thus ending request-response cycle
};

//(named handlerMiddlewareCallback)
//use in specific routes ie specific method and specific path
//create method updateCampground on exportObject
module.exports.updateCampground = async (req, res) => {
  //object keys to variable - Object destructuring
  const { id } = req.params; //pathVariablesObject
  // **************************************************************************************************************
  //UPDATE ONE - querying a collection(campgrounds) for a document by id then updating it + new key:value pairs neglected
  // **************************************************************************************************************
  //modelClass
  //campgroundClassObject.method(idString,updateObject,optionObject) ie modelClassObject.method() - same as - db.campgrounds.findOneAndUpdate(({_id:ObjectId("12345")},{$set:{name:"x",...}},{returnNewDocument:true})
  //returns thenableObject - pending to resolved(dataObject),rejected(errorObject) ie(breaking validation/contraints)
  //To run validations/contraints when updating we need to set runValidators(key) in optionsObject
  //To get the jsObject(document) after update, we need to set new(key) in optionsObject
  //queries (campgrounds)collection of (yelp-camp-db)db for single document by idString and updates/replaces the document with new updateObject(document)
  //implicitly throws new Error("messageFromMongoose") - invalid ObjectId format/length or break validation constraints
  const updatedOnceCampground = await CampgroundClassObject.findByIdAndUpdate(
    id,
    { ...req.body.campground }, //spreading properties into another object //form data/req.body is jsObject //{groupKey:{key/name:inputValue,key/name:inputValue}}
    {
      runValidators: true,
      new: true,
    }
  ); //updatedOnceCampground = dataObject ie single first matching jsObject(document) after it was updated
  //***************************************************************************************************************************************************************************************
  //UPDATE TWO - updating updatedOnceCampground(ie document) - ie adding the newly created arrayObject using req.files arrayObject into the images arrayObject property on updatedOnceCampground
  //***************************************************************************************************************************************************************************************
  //arrayObejct.arrayMethod() //returns new arrayObject //implicit return of object in callback needs parenthesis
  //NOTE - could be empty arrayObject is no images were selected
  const newImageObjectsArraObject = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  //arrayObject.method(argumentObject)
  //argumentObject - {url:f.path,filename:f.filename} has to follow validations/contraints
  updatedOnceCampground.images.push(...newImageObjectsArraObject); //spread arrayObject iterable into arguments //ie indiviudally pass each element in arrayObject as argument to the method
  //modelInstance.save() returns promiseObject - pending to resolved(dataObject),rejected(errorObject) ie(breaking validation/contraints)
  //updates the (updatedOnceCampground)document in the (campgrounds)collection
  const updatedTwiceCampground = await updatedOnceCampground.save(); //updatedTwiceCampground = dataObject ie updated jsObject(document)
  // ****************************************************************************************************************************************
  //UPDATE THREE - updating updatedTwiceCampground(ie document) - querying the document using queryObject then updating it (in this case deletes)
  // ****************************************************************************************************************************************
  //req.body can not contain deleteImages arrayObject property - since it was not required on clientside(edit form) or serverside(joiSchema) validation
  //therefore deleteImages arrayObject property can be undefined
  //checks if property is undefined
  if (req.body.deleteImages) {
    //**************************************************
    //Delete images from the cloudinaryWebApis database
    //**************************************************
    for (const filename of req.body.deleteImages) {
      //cloudinaryObject.property.asyncMethod(filenameStringArgument) //returns promiseObject - pending to resolved(messageObject),rejected(errorObject)
      //sends DELETE request containing filename in request body to cloudinaryWebApi's delete route/endpoint - it deletes the images from its database
      await cloudinary.uploader.destroy(filename);
    }
    //modelInstance
    //updatedTwiceCampground.mongooseMethod(queryObject) ie modelInstanceObject.mongooseMethod() - not same but basic idea - db.campgrounds.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } })
    //queryObject can contain queryOperator - $pull ie(remove) FROM documents images arrayObject property,the jsObjects/elements WHERE its filename property is $in deletesImages arrayObject
    //returns thenableObject - pending to resolved(messageObject),rejected(errorObject) ie(breaking validation/contraints)
    //this mongooseMethod version does not take optionsObject
    //queries document by queryObject and updates the document (in this case deletes)
    //implicitly throws new Error("messageFromMongoose") ie(breaking validation/contraints)
    const updatedThriceCampground = await updatedTwiceCampground.updateOne({
      $pull: { images: { filename: { $in: req.body.deleteImages } } },
    }); //updatedThriceCampground = messageObject ie jsObject containing info
  }
  req.flash("success", "Successfully updated campground!"); //stores the "messageValue" in an arrayObject in the flash property of current sessoinObject under the key "categoryKey"
  //fix for page refresh sending duplicate (http structured) PUT request -
  res.redirect(`/campgrounds/${updatedTwiceCampground._id}`);
  //responseObject.redirect("showPath") updates res.header, sets res.statusCode to 302-found ie-redirect ,sets res.location to /campgrounds/:id
  //resObjects header contains signed cookie created/set by express-sessions middlewareCallback
  //responseObject.redirect("showPath") - converts and sends res jsObject as (http structure)response // default content-type:text/html
  //thus ending request-response cycle
  //browser sees (http structured) response with headers and makes a (http structured) GET request to location ie default(get)/campgrounds/:id
};

//(named handlerMiddlewareCallback)
//use in specific routes ie specific method and specific path
//create method destroyCampground on exportObject
module.exports.destroyCampground = async (req, res) => {
  //object keys to variable - Object destructuring
  const { id } = req.params; //pathVariablesObject
  // ******************************************************************************
  //DELETE - querying a collection(campgrounds) for a document by id then deleting it
  // ******************************************************************************
  //modelClass
  //campgroundClassObject.method(idString) ie modelClassObject.method() - same as - db.campgrounds.findOneAndDelete(({_id:ObjectId("12345")})
  //returns thenableObject - pending to resolved(dataObject),rejected(errorObject)
  //queries (campgrounds)collection of (yelp-camp-db)db for single document by idString and deletes the document
  //implicitly throws new Error("messageFromMongoose") - invalid ObjectId format/length or break validation constraints
  const deletedCampground = await CampgroundClassObject.findByIdAndDelete(id); //deletedCampground = dataObject ie single first matching jsObject(document) that was deleted
  //exectues post async queryMiddlewareCallback when await/.then() is called on queryFunction - (mongooseMethod)
  //post async queryMiddlewareCallback gets passed in the deletedCampground as argument from here
  //we use the passed in deletedCampground(ie document)argument to find and delete all assosiated documents in the reviews array property of deletedCampground(ie document)
  req.flash("success", "Successfully deleted campground!"); //stores the "messageValue" in an arrayObject in the flash property of current sessoinObject under the key "categoryKey"
  //fix for page refresh sending duplicate (http structured) DELETE request -
  res.redirect("/campgrounds");
  //responseObject.redirect("indexPath") updates res.header, sets res.statusCode to 302-found ie-redirect ,sets res.location to /campgrounds
  //resObjects header contains signed cookie created/set by express-sessions middlewareCallback
  //responseObject.redirect("indexPath") - converts and sends res jsObject as (http structure)response // default content-type:text/html
  //thus ending request-response cycle
  //browser sees (http structured) response with headers and makes a (http structured) GET request to location ie default(get)/campgrounds
};
