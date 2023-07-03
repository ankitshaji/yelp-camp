//clientside js for browser to execute - eg. app.js
//Example starter JavaScript for disabling form submissions if there are invalid fields
//(argument-anonymous function expressions)()
(function () {
  "use strict";
  // Fetch all the forms we want to apply custom Bootstrap validation styles to using the custom class we added in all form elements
  const forms = document.querySelectorAll(".needs-validation");
  //convert nodeListObject to arrayInstObj - arrayInstObj.method(nodeListObject) returns arrayInstObj
  //arrayInstObj.method(callback) //callback gets passed in each element of arrayInstObj
  //update - use for ..of instead of forEach()
  //Loop over them and prevent submission
  Array.from(forms).forEach(function (form) {
    //elementInstObject.method("eventStringInstObj",callback-argument-eventObject)
    form.addEventListener(
      "submit",
      function (event) {
        //elementInstObject.method() - !notvalid -> true
        //does not add was-validated class
        if (!form.checkValidity()) {
          //eventObject.method()
          event.preventDefault();
          event.stopPropagation();
        }
        //eventObject.property = DOMTokeListObject.method("newClassToAdd")
        //adds was-validated class
        form.classList.add("was-validated");
      },
      false
    );
  });
})();
