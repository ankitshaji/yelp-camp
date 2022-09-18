//user created module file - can contain functionObjects,variable,classObjects etc which we can export

//mongoose ODM - has callback but also supports promises-ie returns promiseObject (pending,undefined) to -resove(value)(fullfulled,value) or reject(errorMessage)(rejected,errorMessage)
const mongoose = require("mongoose"); //mongooseObject //mongoose module
const { Schema: SchemaClassObject } = mongoose; //mongoose.Schema = SchemaClassObject
const passportLocalMongooseCallback = require("passport-local-mongoose"); //functionObject //passport-local-mongoose module //mongoosePlugin
//dont need to connect nodejs runtime app to mongod server port since we are going to export model to where its already connected

//*********************************************************************************
//MODEL - UserClassObject ie(Model) - represents the (users) collection
//*********************************************************************************
//blueprint of a single document in users collection -
//mongooseObject.schemaMethod = schemaClassObject(objectArgument passed to constructor method)
//objectArgument-{key:nodejs value type} for collection {keys:value}
//creating userSchemaInstanceObject - with new keyword and schemaClassObject constructor method
//setting validtaions/constraints in object - shorthand vs longhand - [string] vs [{properties}] and String vs {type:String,required:true}
//cannot ommit email property ,addtional key:values get neglected(no error)
//we can set custom messageFromMongoose when implicit throw new Error("messageFromMongoose") occurs when validation broken
const userSchemaInstanceObject = new SchemaClassObject({
  email: {
    type: String,
    required: [true, "email cannot be blank"],
    unique: true, //sets unique index for this property //not a validation check
  },
}); //note - we do not add username and password properties with validation/constraints in objectArgument passed to constructor method of schemaClassObject

//***********************************************************
//adding mongoosePluginCallbacks to userSchemaInstanceObject
//***********************************************************

//passport-local-mongoose mongoosePluginCallback
//userSchemeInstanceObject.method(mongoosePluginCallback)
userSchemaInstanceObject.plugin(passportLocalMongooseCallback);
//execution of passportLocalMongooseCallback mongoosePluginCallback will add a username, hash and salt feilds to store the username, the hashed password and the salt value on the userSchemaInstanceObject
//it adds validation/contraints for newly added feilds //eg.username:{unique:true}
//it adds custom methods on userSchemaInstanceObject //thus adding custom methods to model - (case1) userInstanceObject(ie modelInstanceObject) and  (case2) UserClassObject(ie modelClassObject) - grouping model logic
//it can add pre/post mongooseMiddlewareCallbacks to be executed on mongooseMethods by adding them to userSchemaInstanceObject

//creating UserClassObject ie(Model) - represents a collection (users)
//mongooseObject.method("collectionNameSingular",collectionSchemaInstanceObject)
//exportsObject = UserClassObject ie(Model)
module.exports = mongoose.model("User", userSchemaInstanceObject);
