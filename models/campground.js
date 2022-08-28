//user created module file - can contain functionObjects,variable,classObjects etc which we can export

//mongoose ODM - has callback but also supports promises-ie returns promiseObject (pending,undefined) to -resove(value)(fullfulled,value) or reject(errorMessage)(rejected,errorMessage)
const mongoose = require("mongoose"); //mongooseObject //mongoose module
const Schema = mongoose.Schema; //schemaClassObject
//dont need to connect nodejs runtime app to mongod server port since we are going to export model to where its already connected

// *******************************************
// MODEL SETUP
// *******************************************
//blueprint of a single document in campgrounds collection -
//mongooseObject.schemaMethod = schemaClassObject(objectArgument passed to constructor method)
//objectArgument-{key:nodejs value type} for collection {keys:value}
//creating campgroundSchemaInstanceObject - with new keyword and schemaClassObject constructor method

//setting validtaions/constraints in objectArgument - longhand way
//none
const campgroundSchema = new Schema({
  title: String,
  location: String,
  image: String,
  price: Number,
  description: String,
});

//creating campgroundClassObject ie(Model) - represents a collection (campgrounds)
//mongooseObject.method("collectionNameSingular",collectionSchemaInstanceObject)
//exportsObject = campgroundClassObject ie(Model)
module.exports = mongoose.model("Campground", campgroundSchema);
