//user created module file - can contain functionObjects,variable,Class's etc which we can export

//mongoose ODM - has callback but also supports promises-ie returns promiseInstObj (pending,undefined) to -resove(value)(fullfulled,value) or reject(errorMessage)(rejected,errorMessage)
const mongoose = require("mongoose"); //mongooseObject //mongoose module
const Schema = mongoose.Schema; //SchemaClass
const Review = require("./Review"); //ReviewClass(ie Model) //self created module/file needs "./"
//dont need to connect nodejs runtime app to mongod server port since we are going to export model to where its already connected

//NOTE - since mongoose treats [{properties}] as an another/embedded schemaInstanceObject
//we can seperate {properties} out into its own schemaInstanceObject and add it back in - we can prevent id creation if needed
//we dont create model using the schemaInstanceObject
const imageSchemaInstanceObject = new Schema({
  url: String,
  filename: String,
});
// *******************************************
//adding virtual properties on imageSchemaInstanceObject //thus adding virtual properties to model - (case1)modelInstanceObject/dataObject
// *******************************************
//grouping model logic - adding virtual properties to each specifc model //NOTE - we dont export this modelClassObject in this case
//case 1 - adding virtual properties to modelInstanceObject(ie document) / dataObject
//virtual property is built with existing modelInstanceObjects properties
//we add a getter method as the modelInstanceObject.property
//imageSchemaInstanceObject.method(argument - "creatingPropertyName").method(argument - callback to execute for propertyName)
//ie - adding the virtual property "thumbnail" for all modelInstanceObjects
imageSchemaInstanceObject.virtual("thumbnail").get(function () {
  //NOTE - this keyword refers to modelInstanceObject //left of dot (execution scope)
  //originalUrlStringObject.stringMethod("oldStringObject","replacingStringObject")
  //ie adding a path parameter/path variable into orignalUrlStringObject
  //returns updated originalUrlStringObject - ie GET request url with path parameter/path variable added on (to cloudinaryWebApi GET endpoint)
  return this.url.replace("/upload", "/upload/h_100,w_200");
});

//allow virtual properties to be included when converting jsObject to jsonObjStringInstObj using JSON.stringfy(jsObject)
const opts = { toJSON: { virtuals: true } }; //optsObject

//************************************************************************************************************************************************
//PARENT/CHILD MODEL - CampgroundClass ie(Model) - represents the (campgrounds) collection - mongoddb(nosql) relationdships(one to many and one to billions)
//each reviews property in all document in parent collection(campgrounds) contains id references to documents in child collection(reviews)
//each author property in all document in  child collection(campgrounds) contains id references to parent collection(users)
//************************************************************************************************************************************************
//blueprint of a single document in campgrounds collection -
//mongooseObject.schemaMethod = SchemaClass(objectArgument + optionsArgument passed to constructor method)
//objectArgument-{key:nodejs value type} for collection {keys:value}
//creating campgroundSchemaInstanceObject - with new keyword and SchemaClass constructor method
//setting validtaions/constraints in objectArgument - shorthand vs longhand - [string] vs [{properties}] and String vs {type:String,required:true}
//SpecialCase - storing geoJsonObject in model and document
//cannot ommit geometry property,also cannot ommit type property,
//type property is type:String ,enum validator is a stringInstObjArrayInstObj with pre fixed value(s) type property is allowed to be //in this case allowed to be only one value
//mongoose treats [{properties}] object as an another/embedded schemaInstanceObject - we can prevent id creation
//author property is of type:objectID - JS dosn't have that type so get from mongoose
//ref option - tells mongoose which model to use when populating objectIDs
//reviews property is an arrayInstObj of type:objectID - JS dosn't have that type so get from mongoose
//ref option - tells mongoose which model to use when populating objectIDs
const campgroundSchemaInstanceObject = new Schema(
  {
    title: String,
    location: String,
    images: [imageSchemaInstanceObject],
    geometry: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    price: Number,
    description: String,
    author: { type: Schema.Types.ObjectId, ref: "User" },
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
  },
  opts
);

// *******************************************
//adding virtual properties on campgroundSchemaInstanceObject //thus adding virtual properties to model - (case1)modelInstanceObject/dataObject
// *******************************************
//grouping model logic - adding virtual properties to each specifc model
//case 1 - adding virtual properties to modelInstanceObject(ie document) / dataObject
//virtual nested property is built with existing modelInstanceObjects properties
//we add a getter method as the modelInstanceObject.property.property
//campgroundSchemaInstanceObject.method(argument - "outerPropertyName","nestedPropertyName").method(argument - callback to execute for outerPropertyName.nestedPropertyName)
//ie - adding the virtual nested property "properties.popupMarkup" for all modelInstanceObjects
campgroundSchemaInstanceObject
  .virtual("properties.popupMarkup")
  .get(function () {
    //NOTE - this keyword refers to modelInstanceObject //left of dot (execution scope)
    //returns popupMarkupStringObject - contains GET request url to show route of this modelInstanceObject/campgroundObject
    return `
    <strong><a href="/campgrounds/${this._id}">${this.title}</a></strong>
    <p>${this.description.substring(0, 20)}...</p>`;
  });

// *****************************************************************************************************************************
//adding mongoose middleware(hook)Callback on campgroundSchemaInstanceObject  - types - 1.modelInstanceObject OR 2.queryObject
// mongoose middleware(hook)Callback executes code before or after a mongoose method
// ******************************************************************************************************************************
//type 2
//async queryMiddlewareCallbacks(this keyword refers to thenableObject - (queryObject))
//async default returns promiseInstObj - auto calls next() to go to next middlewareCallback
//exectue pre/post async queryMiddlewareCallback when await/.then() is called on queryFunction-(mongoose method)
//-pre async queryMiddlewareCallbacks does not have access to the dataObject returned by the queryFunction(mongoose method)
//-post async queryMiddlewareCallbacks does have access to the dataObject returned by the queryFunction-(mongoose method)

//campgroundSchemaInstanceObject.method("mongooseMethod",async queryMiddlewareCallbacks to execute after mongooseMethod(parameter-deletedCampground))
//queryFunction - (mongoose method) - findByIdAndDelete becomes findOneAndDelete
//async(ie continues running outside code if it hits an await inside) callback implicit returns promiseInstObj(resolved,undefined) - can await a promiseInstObj inside
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
      //Review.method(queryObject) ie modelClassObject.method() - same as - db.reviews.deleteMany({_id:{$in:[ObjectId("123",ObjectId("345")]}})
      //queryObject contains queryOperator - $in - finds _id's that are in reviews arrayInstObj property of deletedCampground
      //returns thenableObject - pending to resolved(messageObject),rejected(errorObject)
      //implicitly throws new Error("messageFromMongoose") - invalid ObjectId format/length or break validation constraints
      const messageObject = await Review.deleteMany({
        _id: { $in: deletedCampground.reviews },
      }); //messageObject = messageObject ie jsObject with delete info
    }
  }
);

//creating campgroundClass ie(Model) - represents a collection (campgrounds)
//mongooseObject.method("collectionNameSingular",collectionSchemaInstanceObject)
//exportsObject = CampgroundClass ie(Model)
module.exports = mongoose.model("Campground", campgroundSchemaInstanceObject);
