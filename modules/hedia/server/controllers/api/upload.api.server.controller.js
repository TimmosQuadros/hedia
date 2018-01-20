'use strict';

/**
 * http://stackoverflow.com/questions/26335656/how-to-upload-images-to-a-server-in-ios-with-swift
 * Module dependencies
 */
var _ = require('lodash'),
  fs = require('fs'),
  path = require('path'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  mongoose = require('mongoose'),
  multer = require('multer'),
  config = require(path.resolve('./config/config')),
  User = mongoose.model('User'),
  Food = mongoose.model('Food'),
  validator = require('validator'),
  crypto = require('crypto');


exports.uploadImage = function(req, res, next) {
  var user = req.user;
  var upload = multer(config.uploads.profileUpload).single('newProfilePicture');
  var profileUploadFileFilter = require(path.resolve('./config/lib/multer')).profileUploadFileFilter;
  var existingImageUrl;
  console.log("text: "+upload);

  // Filtering to upload only images
  upload.fileFilter = profileUploadFileFilter;

  if (user) {
    existingImageUrl = user.profileImageURL;
    uploadImage()
      .then(updateUser)
      .then(deleteOldImage)
      .then(function () {
        res.json({success: true, image_url:  user.profileImageURL});
      })
      .catch(function (err) {
        res.send({success: false, message: err});
      });
  } else {
    res.send({success: false,
      message: 'User is not signed in'
    });
  }

  function uploadImage () {
    return new Promise(function (resolve, reject) {
      upload(req, res, function (uploadError) {
        if (uploadError) {
          reject(errorHandler.getErrorMessage(uploadError));
        } else {
          resolve();
        }
      });
    });
  }

  function updateUser () {
    return new Promise(function (resolve, reject) {
      user.profileImageURL = config.uploads.profileUpload.dest + req.file.filename;
      user.save(function (err, theuser) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  function deleteOldImage () {
    return new Promise(function (resolve, reject) {
      if (existingImageUrl !== User.schema.path('profileImageURL').defaultValue) {
        fs.unlink(existingImageUrl, function (unlinkError) {
          if (unlinkError) {
            console.log(unlinkError);
            reject({success: false,
              message: 'Error occurred while deleting old profile picture'
            });
          } else {
            resolve();
          }
        });
      } else {
        resolve();
      }
    });
  }
};






exports.uploadFoodImage =  function(req, res) {

  var storage = multer.diskStorage({
    destination: './modules/food/client/img/food/',
    filename: function (req, file, callback) {
      
  
  console.log(callback)
  
      crypto.pseudoRandomBytes(8, function(err, raw) {
        if (err) return callback(err);
      
        callback(null, raw.toString('hex') + path.extname(file.originalname));
      });
  
    }
  });
  
  var upload = multer({storage: storage}).single('image');
   
  

  
  
  upload(req,res,function(err) {
    if(err) {
        return res.end("Error uploading file.");
    }
    res.end("File is uploaded");
    //console.log(file)
  console.log(req)
 
  console.log(storage)
  
});

 



  
};

