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
  validator = require('validator');


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




exports.uploadFoodImage = function(req, res) {

  var uploadFile = multer({
    dest:'./modules/food/client/img/food/', 
    limits: {fileSize: 10000000, files: 1},
    fileFilter:  function(req, file, callback) {
    
        if (!file.originalname.match(/\.(jpg|jpeg)$/)) {

            return callback(new Error('Only Images are allowed !'), false)
        }

        callback(null, true);
    }
}).single('image')


console.log(req)

  /* uploadFile(req, res, function (uploadError) {
    if (uploadError) {
     
      res.status(400).json({message: uploadError.message})

     
     
    } else {
      // var path = '/modules/food/client/img/food/';
     // res.status(200).json({message: 'Image Uploaded Successfully !', path: path})
      res.status(200).json({message: 'Image Uploaded Successfully !'})
      
    }
  }); */
uploadImage().then(function () {
  res.json({success: true});
})
.catch(function (err) {
  res.send({success: false, message: err});
});

  function uploadImage () {
    return new Promise(function (resolve, reject) {
      uploadFile(req, res, function (uploadError) {
        if (uploadError) {
          reject(errorHandler.getErrorMessage(uploadError));
        } else {
          resolve();
        }
      });
    });
  }

}