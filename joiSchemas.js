//user created module file - can contain functionObjects,variable,classObjects etc which we can export

const baseJoi = require("joi"); //joiObject //joi module
const sanitizeHtml = require("sanitize-html"); //functionObjecct //sanitize-html module

//variable stored anonymous callback arrow function expression that allows 1 parameter
//normal brackets means implicit return ie returns jsObject
const extension = (joi) => ({
  type: "string",
  //setting which joiObject.method to allow new method chaining
  base: joi.string(),
  messages: {
    "string.escapeHTML": "{{#label}} must not include HTML!",
  },
  rules: {
    //adding the new method
    escapeHTML: {
      //joiObject auto checks for validate method and passes in the text value as parameter and executes it
      validate(value, helpers) {
        //new method executing sanitizeHtml to remove html tags/inner quotes/& from passed in text value ie outputs the escaped value (usually we replace with entity code instead of removing)
        const clean = sanitizeHtml(value, {
          allowedTags: [],
          allowedAttributes: {},
        });
        //compare after value after sanitization - ie if text value contained html tags then they are diffrent - throw error - prevent adding to collection
        if (clean !== value) {
          return helpers.error("string.escapeHTML", { value });
        }
        //text value did not contain html tags - return text value
        return clean;
      },
    },
  },
});
//extending the joiObject
//adding an new method onto joiObject - new method uses sanitizeHtml functionObject
//updatedjoiObject = joiObject.method(callback-ie new method being added)
const joi = baseJoi.extend(extension);

//req.body.campground can have undefined value if sent from postman
//server side validation check -
//create joiCampgroundSchemaObject with joiObject
//joiObject.typeMethod(object)//{property=joiObject.typeMethod().requiredMethod()}
//create property joiCampgroundSchemaObject in exportObject
module.exports.joiCampgroundSchemaObject = joi.object({
  campground: joi
    .object({
      title: joi.string().required().escapeHTML(),
      location: joi.string().required().escapeHTML(),
      // image: joi.string().required(),
      price: joi.number().required().min(0),
      description: joi.string().required().escapeHTML(),
    })
    .required(),
  deleteImages: joi.array(),
});
//issue - image property no longer exists + we are not validating images arrayObject property [{url: String, filename: String }]

//req.body.review can have undefined value if sent from postman
//server side validation check -
//create joiReviewSchemaObject with joiObject
//joiObject.typeMethod(object)//{property=joiObject.typeMethod().requiredMethod()}
//create property joiReviewSchemaObject in exportObject
module.exports.joiReviewSchemaObject = joi.object({
  review: joi
    .object({
      rating: joi.number().integer().required().min(1).max(5),
      body: joi.string().required().escapeHTML(),
    })
    .required(),
});
