//user created module file - can contain functionObjects,variable,Class's etc which we can export

//declaring child/sub CustomErrorClass blueprint/template using class keyword in js syntax/code and extending it with a parent/super ErrorClass blueprint/template
class CustomError extends Error {
  //creating unique copies of object members/class members(not class methods)/keys(object properties/class properties(ie instance variable/class fields)/object method)
  //on the implicitly created literal jsObject ie(the instance jsObject) that will later be initialized with the arguments passed into the explicit short class method syntax named constructor's paramters
  message;
  statusCode;

  //instead of namedConstructorFunctionExpressionDefenition with 2 parameters,
  //we write an explcit short class method syntax named constructor with 2 parameters
  constructor(message, statusCode) {
    //implcitly creating a literal jsObject ie(the instance jsObject) and referencing it in a variable
    //explicitly execute short class method syntax named constructor of parent class blueprint/template and passing in 0 arguments
    super();
    //initializing unique copies of object members/class members(not class methods)/keys(object properties/class properties(ie instance variables/class fields)/object properties)
    //on the implicitly created literal jsObject ie(the instance jsObject)
    //this keyword uses execution scope but instead of windowObject it refer to the implcitly created/returned literal jsOjbect ie(instance jsObject)
    this.message = message;
    this.statusCode = statusCode;
    //implicitly return the created literal jsObject(ie instance jsObject) referenced though a variable

    //Notes -
    //1.The parent/super ErrorClass blueprints/templates message instance variable is initialized with undefined due to us not passing in any arguments for
    //its 3 optional parameters when explicitly executing the short class method syntax named constructor of the parent/super ErroClass blueprint/template.
    //Therefore we initialize the message instance variable in the sub/child CustomErrorClass blueprints/templates explicit short class method syntax named constructor
    //using one of the arguments passed into its 2 parameters.
    //2.The parent/super ErroClass blueprint/template does not create a statusCode instance variable,therefore we create and intialize the statusCode
    //instance variable in the child/sub CustomErrorClass blueprints/templates explicit short class method syntax named constructor using one of the arguments
    //passed into its 2 parameters.
  }
}
//Notes -
//The express defaultErrorHandlerMiddlewareCallback
//sets res.statusCode to customErrorInstanceObject.statusCode and res.body to customErrorInstanceObject.message + customErrorInstanceObject.stack
//if customErrorInstanceObject.statusCode is undefined , it is auto sets to 500
//res.statusMessage is auto set from customErrorInstanceObject.statusCode
//before making the (http structured) response

//exportObject = CustomeErrorClass
module.exports = CustomError;
