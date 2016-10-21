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
          displayName: validator.escape(user.displayName),
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

  // Init user and add missing fields
  var user = req.user;
  user.firstName = req.body.firstName;
  user.lastName = req.body.lastName;
  user.email = req.body.email;
  user.username = req.body.username || req.body.email;
  user.displayName = user.firstName + ' ' + user.lastName;

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


