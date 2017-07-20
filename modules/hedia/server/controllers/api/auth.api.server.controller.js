'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  nodemailer = require('nodemailer'),
  handlebars = require('handlebars'),
  fs = require('fs'),
  async = require('async'),
  UserToken = mongoose.model('UserToken'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  token = require('crypto-token'),
  validator = require('validator'),
  _ = require('lodash');

exports.userRegister = function(req,res) {
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

  var deviceLanguage = req.body.deviceLanguage.substring(0,2);
  //console.log(deviceLanguage);
  sendEmail(user,deviceLanguage);
};

function sendEmail(user,deviceLanguage) {

  var readHTMLFile = function(path, callback) {
    fs.readFile(path, {encoding: 'utf-8'}, function (err, html) {
      if (err) {
        throw err;
        callback(err);
      }
      else {
        callback(null, html);
      }
    });
  };

  var smtpTransport = nodemailer.createTransport({
    host: 'smtp.hedia.dk',
    port: 587,
    secure: false, // secure:true for port 465, secure:false for port 587
    tls: {rejectUnauthorized: false},
    auth: {
      user: 'hello@hedia.dk',
      pass: 'PL290482'
    }
  });

  var pathToMailTemplate;

  if(deviceLanguage.localeCompare('en')==0){
    pathToMailTemplate = path.resolve('./modules/hedia/server/templates/english.html');
  }else if(deviceLanguage.localeCompare('da')==0){
    pathToMailTemplate = path.resolve('./modules/hedia/server/templates/danish.html');
  }else if(deviceLanguage.localeCompare('de')==0){

  }

  readHTMLFile(pathToMailTemplate, function(err, html) {
    var template = handlebars.compile(html);
    var replacements = {
      name: user.displayName
    };
    var htmlToSend = template(replacements);
    var mailOptions = {
      from: 'hello@hedia.dk',
      to: user.email,
      subject: 'Welcome',
      html : htmlToSend,
      attachments: [{
        filename: 'hedia_signature.png',
        path: path.resolve('./modules/hedia/server/templates/hedia_signature.png'),
        cid: 'hedia_signature' //same cid value as in the html img src
      }]
    };
    smtpTransport.sendMail(mailOptions, function (error, res) {
      if (error) {
        //console.log(error);
        callback(error);
      }
    });
  });
}

exports.login = function(req, res){
  console.log(req.body.email);
  User.findOne({username: req.body.email}).exec(function(err, user){
    if (!err && user && user.authenticate(req.body.password))
    {
      console.log(user);
       exports._buildToken(user, req, res);
    }
    else {
      console.log(user);
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
