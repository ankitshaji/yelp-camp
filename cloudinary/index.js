//main file that gets passed in other npm package modules or user created modules

const cloudinary = require("cloudinary").v2; //cloudinaryObject //cloudinary sdk module
const { CloudinaryStorage } = require("multer-storage-cloudinary"); //functionObject //multer-storage-cloudinary module

//initializing cloudinary with our credentials - associate cloudinary account to this cloudinaryObject instance
//cloudinaryObject.method(optionsObject)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
