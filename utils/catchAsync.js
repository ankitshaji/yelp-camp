//user created module file - can contain functionObjects,variable,classObjects etc which we can export

//***************************************************************************************************************************//
//higher-order function - async utility function - catchAsync(async fn) ie.createMiddlewareCallback(async middlewareCallback)
//***************************************************************************************************************************//
//higher-order functions - accepts a function as argument 0R returns a function
//named function expression - takes 1 argument - async middlewareCallback
module.exports = (fn) => {
  //returns a new middlewareCallback - expresses passes it 3 argument - req,res,next
  return function (req, res, next) {
    //new middlewareCallback executes the old async middlewareCallback - we pass in the 3 arguments express gave us
    //async middlewareCallback returns a promiseObject-
    //async - ie continues running outside code if it hits an await inside
    //async middlewareCallback implicitly returns ie.calls resolve() ,it returns promiseObject(resolved,undefined)
    //if a value is returned inside async middlewareCallback ie.calls resolve("value"),it returns promiseObject(resolved,value)
    //if a throw new Error("message") occurs inside async middlewareCallback,ie.calls reject(errorClassInstanceObject), it returns promiseObject(rejected,errorClassInstanceObject)
    //async function expression without an await is just a normal syncronous function expression
    //if there was a throw new Error("message") inside async callbackMiddleware we can .catch() the errorClassInstanceObject
    fn(req, res, next).catch((e) => next(e)); //implicit return next(e)
  };
};

//exportObject = functionObject
