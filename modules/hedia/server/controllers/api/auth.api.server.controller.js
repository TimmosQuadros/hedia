'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  UserToken = mongoose.model('UserToken'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  token = require('crypto-token'),
  validator = require('validator'),
  _ = require('lodash');

exports.userRegister = function(req, res) {
  delete req.body.roles;

  // Init user and add missing fields
  var user = new User(req.body);
  if (user.provider === undefined) {
    user.provider = 'local';
  }
  else {
    if (user.providerData === undefined || user.providerData.id === undefined)
    {
      return res.send({success: false,
        message: 'Missing providerData for facebook'
      });
    }
  }

  user.displayName = user.firstName + ' ' + user.lastName;
  if (user.username ===  undefined ) user.username = user.email;

  if (req.buildFileUrl !== undefined)
  {
    user.profileImageURL = req.buildFileUrl;
  }

  // Then save the user
  user.save(function (err) {
    if (err) {
      return res.send({success: false,
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      // Remove sensitive data before login
      user.password = undefined;
      user.salt = undefined;
      exports._buildToken(user, req, res);
    }
  });
};

exports.login = function(req, res){
  User.findOne({username: req.body.email, provider: 'facebook'}).exec(function(err, user){
    if (!err && user && user.authenticate(req.body.password))
    {
       exports._buildToken(user, req, res);
    }
    else {
       res.jsonp({success: false, message: 'Invalid login or password'});
    }
  });
};

exports.logout = function(req, res){
  req.apitoken.remove(function(err){
    if (!err)
      res.jsonp({success: true});
    else {
      res.jsonp({success: false,  message: errorHandler.getErrorMessage(err)});
    }
  });
};

exports.loginByFBToken = function(req, res){
  User.findOne({'providerData.id': req.providerData.id}).exec(function(err, user){
    if (!err && user)
    {
      user.providerData.id = req.providerData.id;
      user.providerData.accessToken = req.providerData.accessToken;
      user.save(function (err) {
        if (err) {
          res.jsonp({success: false, message: err});
        }
        else {
          exports._buildToken(user, req, res);
        }
      });
    }
    else {
      res.jsonp({success: false, message: 'Invalid login or password'});
    }
  });

  res.jsonp({success: true});
};

exports._buildToken = function(user, req, res){
  try {
    var apiToken = token(32);
    var userToken = new UserToken({api_token: apiToken, user: user});
    userToken.save(function (errToken) {
      if (errToken) {
        return res.send({
          success: false,
          message: errorHandler.getErrorMessage(errToken)
        });
      }
      else {
        res.json({success: true, token: apiToken});
      }
    });
  }
  catch (error)
  {
    return res.send({success: false,
      message: errorHandler.getErrorMessage(error)
    });
  }
};
