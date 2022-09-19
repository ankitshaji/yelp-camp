//user created module file - can contain functionObjects,variable,classObjects etc which we can export

//(custom middlewareCallback)
//use in specific routes ie specific method and specific path

//create method checkLoggedIn on exportObject
module.exports.checkLoggedIn = (req, res, next) => {
  //requestObject.passportObjectMethod() //returns booleanObject - true if req.user exists on current sessionObject, ie logged in , false if req.userdoes not exist on current sessionObject - undefined ie not logged in
  //ie. check if foundUser is retrivable through deserializing the one value from temporary data store into req.user,meaning foundUser was serialized into one value and stored into temporary data store after verifyCallback passed in customAuthenticationMiddlewareCallback at one point
  if (!req.isAuthenticated()) {
    //req.user does not exist on current sessionObject, ie not logged in
    req.flash("error", "You must be signed in"); //stores the "messageValue" in an arrayObject in the flash property of current sessoinObject under the key "categoryKey"
    //fix for page refresh sending duplicate (http structured) GET request -
    return res.redirect("/login"); //return to not run rest of code
    //responseObject.redirect("loginPath") updates res.header, sets res.statusCode to 302-found ie-redirect ,sets res.location to /login
    //resObjects header contains signed cookie created/set by express-sessions middlewareCallback
    //responseObject.redirect("loginPath") - converts and sends res jsObject as (http structure)response // default content-type:text/html
    //thus ending request-response cycle
    //browser sees (http structured) response with headers and makes a (http structured) GET request to location ie default(get)/login
  }
  //req.user exists on current sessionObject, ie logged in
  next(); //pass to next middlewareCallback
};
