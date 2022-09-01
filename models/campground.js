//user created module file - can contain functionObjects,variable,classObjects etc which we can export

//mongoose ODM - has callback but also supports promises-ie returns promiseObject (pending,undefined) to -resove(value)(fullfulled,value) or reject(errorMessage)(rejected,errorMessage)
const mongoose = require("mongoose"); //mongooseObject //mongoose module
const SchemaClassObject = mongoose.Schema; //SchemaClassObject
//dont need to connect nodejs runtime app to mongod server port since we are going to export model to where its already connected

//****************************************************************************************
//mongodb(nosqldb) relationship - ONE TO MANY -
//each reviews property in all document in campgrounds collection contains id references to documents in reviews collection
//***************************************************************************************

//**************************************  *******************************************
//PARENT MODEL - CampgroundClassObject ie(Model) - represents the (campgrounds) collection
//*********************************************************************************
//blueprint of a single document in campgrounds collection -
//mongooseObject.schemaMethod = schemaClassObject(objectArgument passed to constructor method)
//objectArgument-{key:nodejs value type} for collection {keys:value}
//creating campgroundSchemaInstanceObject - with new keyword and schemaClassObject constructor method
//setting validtaions/constraints in objectArgument - shorthand vs longhand - [string] vs [{properties}] and String vs {type:String,required:true}
//none
//mongoose treats [{properties}] object as an another/embedded schemaInstanceObject - we can prevent id creation
//reviews property is an array of type:objectID - JS dosn't have that type so get from mongoose
//ref option - tells mongoose which model to use when populating objectIDs
const campgroundSchemaInstanceObject = new SchemaClassObject({
  title: String,
  location: String,
  image: String,
  price: Number,
  description: String,
  reviews: [
    {
      type: SchemaClassObject.Types.ObjectId,
      ref: "Review",
    },
  ],
});

//creating campgroundClassObject ie(Model) - represents a collection (campgrounds)
//mongooseObject.method("collectionNameSingular",collectionSchemaInstanceObject)
//exportsObject = campgroundClassObject ie(Model)
module.exports = mongoose.model("Campground", campgroundSchemaInstanceObject);
