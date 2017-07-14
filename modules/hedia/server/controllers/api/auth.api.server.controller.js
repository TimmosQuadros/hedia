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
  user.provider = 'local'

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
  console.log(req.body);
  sendEmail(user,res);
};

function sendEmail(user,res) {
  var transporter = nodemailer.createTransport({
    host: 'smtp.hedia.dk',
    port: 587,
    secure: false, // secure:true for port 465, secure:false for port 587
    tls: {rejectUnauthorized: false},
    auth: {
      user: 'hello@hedia.dk',
      pass: 'PL290482'
    }
  });

  var mailOptions = {
    from: 'hello@hedia.dk',
    to: user.email,
    subject: 'Test',
    text: 'Hello world ?',
    html: '<b>Hello world ?</b>'
  };

  transporter.sendMail(mailOptions, function(err, info) {
    if(err){
      return console.log(err)
    }
    console.log('timmy %s sent: %s', info.messageId, info.response);
  });
}

exports.login = function(req, res){
  User.findOne({username: req.body.email}).exec(function(err, user){
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
  User.findOne({'providerData.id': req.facebookUserProfile.providerData.id, provider: 'facebook'}).exec(function(err, user){
    if (!err)
    {
      var fbUser = user;
      if (fbUser)
      {
        fbUser.providerData = req.facebookUserProfile.providerData;
      }
      else {
        fbUser = new User(req.facebookUserProfile);
      }

      fbUser.save(function (err) {
        if (err) {
          res.jsonp({success: false, message: err});
        }
        else {
          exports._buildToken(fbUser, req, res);
        }
      });
    }
    else {
      res.jsonp({success: false, message: 'Invalid token '});
    }
  });
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
