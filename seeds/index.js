//main file of this app that gets other npm package modules or user created modules
//isolated index.js file, run file to seed(ie add initial data) collections in our db(yelp-camp-db)
//specifically seed(ie add intial data) to the campgrounds collection

//mongoose ODM - has callback but also supports promises-ie returns promiseObject (pending,undefined) to -resove(value)(fullfulled,value) or reject(errorMessage)(rejected,errorMessage)
const mongoose = require("mongoose"); //mongooseObject //mongoose module
const Campground = require("../models/campground"); //campgroundtClassObject(ie Model) //self created module/file needs "./" , using "../" to go back a directory
const cities = require("./cities"); //arrayObject of jsObjects //self created module/file needs "./"
//object keys to variable - Object destructuring
const { places, descriptors } = require("./seedHelpers"); //arrayObject //arrayObject //self created module/file needs "./"

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
//catches any error after initial connection
// ******************************************
//mongooseObject.property = connectionObject
const db = mongoose.connection; //db = connectionObject
//connectionObject.method(string,callback)
db.on("error", console.error.bind(console, "connection error:"));

// ******************************************************************************************************************************
//CLEAR + SEED the collection(campgrounds) of (yelp-camp-db)db with MongoDB CRUD Operations using mongoose-ODM (modelClassObject)
// *******************************************************************************************************************************
//variable stored anonymous arrow function expression
//passed in 1 argument-stringArray that is captured in parameter, return random string element of passed in array
const sample = (array) => array[Math.floor(Math.random() * array.length)];

//variable stored anonymous async(ie continues running outside code if it hits an await inside) function expression
//implicit returns promiseObject(resolved,undefined) - can await a promiseObject inside
//async function expression without an await is just a normal syncronous function expression
const seedDb = async () => {
  try {
    // *********************************************************************************************
    //DELETE - querying a collection(campgrounds) and deleting all documents that match queryObject
    // *********************************************************************************************
    //modelClass
    //campgroundClassObject.method(queryObject) ie modelClassObject.method() - same as - db.campgrounds.deleteMany({})
    //returns thenableObject - pending to resolved(messageObject),rejected(errorObject)
    //queries (campgrounds)collection of (yelp-camp-db)db for all documents that match queryObject and deleting them all
    await Campground.deleteMany({}); //messageObject of delete count
    //loop 10 times to CREATE and save single but diffrent modelInstanceObjects(documents)
    for (let i = 0; i < 200; i++) {
      //randomNumber between 0,9999
      const random1000 = Math.floor(Math.random() * 1000);
      //randomPrice between 10,29
      const randomPrice = Math.floor(Math.random() * 20) + 10;
      // *******************************************************************************************
      //CREATE - creating a single new document in the (campgrounds) collection of (yelp-camp-db)db
      // *******************************************************************************************
      //modelClass
      //campgroundClassObject(objectArgument-passed to constructor method)
      //objectArgument- jsObject{key:value} ie the new document that abides to collectionSchemaInstanceObject
      //objectArgument has validations/contraints set by collectionSchemaInstanceObject
      //validations/contraints -
      //none
      //create modelInstanceObject(ie document) - with new keyword and campgroundClassObject constructor method
      const newCamp = new Campground({
        author: "6327237a6f227ed76be858d6",
        //sample(array) function expression execution returns random string from array
        title: `${sample(descriptors)} ${sample(places)}`,
        //arrayOfObjects[randomNumberIndex].property
        location: `${cities[random1000].city}, ${cities[random1000].state}`,
        //[arrayObject[randomNumberIndex].property,arrayObject[randomNumberIndex].property]
        geometry: {
          type: "Point",
          coordinates: [
            cities[random1000].longitude,
            cities[random1000].latitude,
          ],
        },
        images: [
          {
            url: "https://res.cloudinary.com/dh9ncm8mp/image/upload/v1664596956/YelpCamp/sq26zqx5ac2o1g8eokts.jpg",
            filename: "YelpCamp/sq26zqx5ac2o1g8eokts",
          },
          {
            url: "https://res.cloudinary.com/dh9ncm8mp/image/upload/v1664596956/YelpCamp/edoj1d7rsb15w9lljape.webp",
            filename: "YelpCamp/edoj1d7rsb15w9lljape",
          },
        ],
        //sending (http strucutred) GET request to cloudinaryWebApi endpoint - /YelpCamp/unqiueimagename.fileextension
        price: randomPrice,
        description:
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ut laborum consequuntur possimus quis iure porro iusto, adipisci commodi quod, animi quidem saepe esse quas? Molestiae unde beatae quam et. Tenetur!",
      });
      //auto creates empty reviews arrayObject property
      //modelInstance.save() returns promiseObject - pending to resolved(dataObject),rejected(errorObject) ie(breaking validation/contraints)
      //creates (campgrounds)collection in (yelp-camp-db)db and adds (newCamp)document into the (campgrounds)collection
      await newCamp.save(); //dataObject is created jsObject(document)
    }
  } catch (err) {
    //catches error if in try block any of the thenableObjects or promiseObjects are rejected() or throw error occurs
    console.log(err);
  }
};

//execute variable stored async anonymous arrow function expression
//implicit returns promiseObject pending to resolved(resolved,undefined)
//resolved(resolved,value-if value returned),rejected(errorObject) if await inside rejected or throw error occurs unless already caught inside
seedDb().then(() => {
  //mongooseObject.property = connectionObject = db
  //db.method()
  db.close(); //closes connection
});
