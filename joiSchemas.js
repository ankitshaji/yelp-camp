//user created module file - can contain functionObjects,variable,classObjects etc which we can export

const joi = require("joi"); //joiObject //joi module

//req.body.campground can have undefined value if sent from postman
//server side validation check -
//create joiCampgroundSchemaObject with joiObject
//joiObject.typeMethod(object)//{property=joiObject.typeMethod().requiredMethod()}
//create property joiCampgroundSchemaObject in exportObject
module.exports.joiCampgroundSchemaObject = joi.object({
  campground: joi
    .object({
      title: joi.string().required(),
      location: joi.string().required(),
      // image: joi.string().required(),
      price: joi.number().required().min(0),
      description: joi.string().required(),
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
      body: joi.string().required(),
    })
    .required(),
});
