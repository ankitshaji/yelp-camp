//user created module file - can contain functionObjects,variable,classObjects etc which we can export

//mongoose ODM - has callback but also supports promises-ie returns promiseObject (pending,undefined) to -resove(value)(fullfulled,value) or reject(errorMessage)(rejected,errorMessage)
const mongoose = require("mongoose"); //mongooseObject //mongoose module
const { Schema: SchemaClassObject } = mongoose; //mongoose.Schema = SchemaClassObject
//dont need to connect nodejs runtime app to mongod server port since we are going to export model to where its already connected

//*********************************************************************************
//CHILD MODEL - ReviewClassObject ie(Model) - represents the (reviews) collection
//*********************************************************************************
//blueprint of a single document in reviews collection -
//mongooseObject.schemaMethod = schemaClassObject(objectArgument passed to constructor method)
//objectArgument-{key:nodejs value type} for collection {keys:value}
//creating reviewSchemaInstanceObject - with new keyword and schemaClassObject constructor method
//setting validtaions/constraints in object - shorthand vs longhand - [string] vs [{properties}] and String vs {type:String,required:true}
//none
//mongoose treats [{properties}] object as an another/embedded schemaInstanceObject - (we can prevent id creation)
const reviewSchemaInstanceObject = new SchemaClassObject({
  body: String,
  rating: Number,
});

//creating ReviewClassObject ie(Model) - represents a collection (reviews)
//mongooseObject.method("collectionNameSingular",collectionSchemaInstanceObject)
//exportsObject = ReviewsClassObject ie(Model)
module.exports = mongoose.model("Review", reviewSchemaInstanceObject);
