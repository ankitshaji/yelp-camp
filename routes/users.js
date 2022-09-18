//user created module file - can contain functionObjects,variable,classObjects etc which we can export
const express = require("express"); //functionObject //express module
const router = express.Router(); //functionObject.method() //routerObject
// ******************************************************************************************
//mini express appliation/routerObject - mini (RESTful) webApi - webApi using REST principles
// *******************************************************************************************
//routerObject is an isolated instance of middlwareCallbacks and routes - (mini express application/routerObject)
const catchAsync = require("../utils/catchAsync"); //functionObject //self create modeul/file needs "./" //going back a directory ..
const CustomErrorClassObject = require("../utils/CustomError"); //CustomErrorClassObject //self created module/file needs "./" //going back a directory ..
const UserClassObject = require("../models/user"); //UserClassObject(ie Model) //self created module/file needs "./" //going back a directory ..

//route1
//httpMethod=GET,path/resource- (pathPrefixString) + /register  -(direct match/exact path)
//(READ) name-new,purpose-display form to submit new document into (users)collection of (yelp-camp-db)db
//router.method(pathString ,handlerMiddlewareCallback) lets us execute handlerMiddlewareCallback on specifid http method/every (http structured) request to specified path/resource
//execute handlerMiddlwareCallback if (http structured) GET request arrives at path (pathPrefixString) + /register
//arguments passed in to handlerMiddlewareCallback -
//-if not already converted convert (http structured) request to req jsObject
//-if not already created create res jsObject
//-nextCallback
router.get("/register", (req, res) => {
  res.render("users/register");
  //render(ejs filePath) - executes js - converts  ejs file into pure html
  //resObjects header contains signed cookie created/set by express-sessions middlewareCallback
  //responseObject.render() - converts and sends res jsObject as (http structure)response //content-type:text/html
  //thus ending request-response cycle
});

//exportsObject = custom routerObject
module.exports = router;
