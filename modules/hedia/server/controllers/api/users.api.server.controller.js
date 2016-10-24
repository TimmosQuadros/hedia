'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  validator = require('validator'),
  _ = require('lodash');

var safeUserObject = function(user){
  return {
            created: user.created.toString(),
            profileImageURL: user.profileImageURL,
            email: validator.escape(user.email),
            lastName: validator.escape(user.lastName),
            firstName: validator.escape(user.firstName)
         };
}

exports.userFoo = function(req, res) {
  res.jsonp({success: true});
};

exports.userProfile = function(req, res) {
  res.jsonp({success: true, user: safeUserObject(req.user)});
}

exports.userUpdate = function(req, res) {
  delete req.body.roles;
  delete req.body.password;

  // Init user and add missing fields
  var user = req.user;
  if (req.body.firstName) user.firstName = req.body.firstName;
  if (req.body.lastName) user.lastName = req.body.lastName;
  if (req.body.email)
  {
     user.email = req.body.email;
     user.username = req.body.username || req.body.email;
  }
  if (req.body.firstName || req.body.lastName)
  {
    user.displayName = user.firstName + ' ' + user.lastName;
  }

  // Then save the user
  user.save(function (err) {
    if (err) {
      return res.send({success: false,
        message: errorHandler.getErrorMessage(err)
      });
    } else {
       res.jsonp({success: true, user: safeUserObject(user)});
    }
  });
};

exports.changePassword = function(req, res) {
  if (req.body.currentPassword && req.body.newPassword)
  {
     var user = req.user;
     if (user.authenticate(req.body.currentPassword))
     {
         user.password = req.body.newPassword;
         user.save(function (err) {
         if (err) {
           return res.send({success: false,
             message: errorHandler.getErrorMessage(err)
           });
         } else {
           // Remove sensitive data before login
           user.password = undefined;
           user.salt = undefined;
           res.jsonp({success: true});
         }
       });
     }
     else {
       return res.send({success: false,
         message: "Invalid current password"
       });
     }
  }
  else {
    return res.send({success: false,
      message: "Bed request"
    });
  }
};




