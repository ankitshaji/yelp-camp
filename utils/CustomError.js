//user created module file - can contain functionObjects,variable,classObjects etc which we can export

//customeErrorClassInstanceObject(child) inherits properties and methods from ErrorClassObject(parent)
class CustomError extends Error {
  //auto calls parent ErrorClassObject constructor method if one is not provided ie.ErrorClassObject("message")
  //which parent ErrorClassObject constructor is called is based on the number of arguments provided to child customeErrorClassInstanceObjects constructor
  constructor(message, statusCode) {
    //this keyword - (execution scope/left of dot) ie.instance object - created from mandatory new keyword
    super(); //calling ErrorClassObject constructor with no arguments //required for child customeErrorClassInstanceObject to inherit parent ErroClassObjects default/auto created properties/methods such as stack
    this.message = message; //ErrorClassObject's message property was not created due to empty constructor,therfore we create message property on CustomErrorInstanceObject
    this.statusCode = statusCode; //ErrorClassObject does not have a constructor that takes statusCode,therfore we create statusCode property on CustomErrorInstanceObject

    //Note -
    //express defaultErrorHandlerMiddlewareCallback
    //sets res.statusCode to customErrorInstanceObject.statusCode and res.body to customErrorInstanceObject.message + customErrorInstanceObject.stack
    //if customErrorInstanceObject.statusCode is undefined , it is auto sets to 500
    //res.statusMessage is auto set from customErrorInstanceObject.statusCode
    //before making the (http structured) response
  }
}

//exportObject = customeErrorClassInstanceObject
module.exports = CustomError;
