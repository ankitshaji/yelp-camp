//user created module file - can contain functionObjects,variable,classObjects etc which we can export

//mongoose ODM - has callback but also supports promises-ie returns promiseObject (pending,undefined) to -resove(value)(fullfulled,value) or reject(errorMessage)(rejected,errorMessage)
const mongoose = require("mongoose"); //mongooseObject //mongoose module
const SchemaClassObject = mongoose.Schema; //SchemaClassObject
const ReviewClassObject = require("./review"); //ReviewClassObject(ie Model) //self created module/file needs "./"
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

// *****************************************************************************************************************************
//adding mongoose middleware(hook)Callback on campgroundSchemaInstanceObject  - types - 1.modelInstanceObject OR 2.queryObject
// mongoose middleware(hook)Callback executes code before or after a mongoose method
// ******************************************************************************************************************************
//type 2
//async queryMiddlewareCallbacks(this keyword refers to thenableObject - (queryObject))
//async default returns promiseObject - auto calls next() to go to next middlewareCallback
//exectue pre/post async queryMiddlewareCallback when await/.then() is called on queryFunction-(mongoose method)
//-pre async queryMiddlewareCallbacks does not have access to the dataObject returned by the queryFunction(mongoose method)
//-post async queryMiddlewareCallbacks does have access to the dataObject returned by the queryFunction-(mongoose method)

//campgroundSchemaInstanceObject.method("mongooseMethod",async queryMiddlewareCallbacks to execute after mongooseMethod(parameter-deletedCampground))
//queryFunction - (mongoose method) - findByIdAndDelete becomes findOneAndDelete
//async(ie continues running outside code if it hits an await inside) callback implicit returns promiseObject(resolved,undefined) - can await a promiseObject inside
//async function expression without an await is just a normal syncronous function expression
campgroundSchemaInstanceObject.post(
  "findOneAndDelete",
  async function (deletedCampground) {
    //length = 0 is falsey
    if (deletedCampground.reviews.length) {
      //we use the passed in deletedCampground(ie document)in the parameter to help find and delete all assosiated documents in the reviews array property of deletedCampground(ie document)
      // ***********************************************************************************************
      //DELETE - querying (reviews)collection for all documents that match queryObject then deleting them
      // ***********************************************************************************************
      //modelClass
      //ReviewClassObject.method(queryObject) ie modelClassObject.method() - same as - db.reviews.deleteMany({_id:{$in:[ObjectId("123",ObjectId("345")]}})
      //queryObject contains queryOperator - $in - finds _id's that are in reviews arrayObejct property of deletedCampground
      //returns thenableObject - pending to resolved(messageObject),rejected(errorObject)
      //implicitly throws new Error("messageFromMongoose") - invalid ObjectId format/length or break validation constraints
      const messageObject = await ReviewClassObject.deleteMany({
        _id: { $in: deletedCampground.reviews },
      }); //messageObject = messageObject ie jsObject with delete info
    }
  }
);

//creating campgroundClassObject ie(Model) - represents a collection (campgrounds)
//mongooseObject.method("collectionNameSingular",collectionSchemaInstanceObject)
//exportsObject = campgroundClassObject ie(Model)
module.exports = mongoose.model("Campground", campgroundSchemaInstanceObject);
