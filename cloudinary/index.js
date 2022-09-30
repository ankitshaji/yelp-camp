//main file that gets passed in other npm package modules or user created modules
//user created module file - can contain functionObjects,variable,classObjects etc which we can export

const cloudinary = require("cloudinary").v2; //cloudinaryObject //cloudinary sdk module
const { CloudinaryStorage } = require("multer-storage-cloudinary"); //ClassObject //multer-storage-cloudinary module

//initializing cloudinary with our credentials using cloudinary sdk library- associate cloudinary account to this cloudinaryObject instance
//cloudinaryObject.method(optionsObject)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

//initialize CloudinaryStorage using multer-storage-cloudinary helper library //NOTE - multer library uses this helper library
//cloudinaryStorageInstanceObject = new CloudinaryStorageClassObject(objectArgument-passed to constructor method)
//objectArgument -
// - set cloudnaryObject instance
// - set folder to use on cloudinary to store images in
// - set allowed file formats that can be stored
const cloudinaryStorageInstanceObject = new CloudinaryStorage({
  cloudinary: cloudinary,
  folder: "YelpCamp",
  allowedFormats: ["jpg", "png", "jpeg"],
});

//exportObject contains 2 properties
module.exports = {
  cloudinary,
  cloudinaryStorageInstanceObject,
};
