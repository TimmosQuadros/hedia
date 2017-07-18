'use strict';

var mongoose = require('mongoose'),
    https = require('https'),
    User = mongoose.model('User'),
    UserToken = mongoose.model('UserToken');
/**
 * Module dependencies.
 */
exports.authByToken = function (req, res, next) {
  console.log(req.headers['authorization']);
  var tokens = (req.headers['authorization'] || '').split(' ');
  if (tokens.length == 2 && tokens[0].trim().toLowerCase() == 'hedia')
  {
    UserToken.findOne({api_token: tokens[1]}).exec(function(err, tokenObj){
      if (!err && tokenObj){
        User.findOne({_id: tokenObj.user}).exec(function(errUser, user){
          if (!errUser && user) {
            req.user = user;
            req.apitoken = tokenObj;
            next();
          }
          else
            console.log("Failed Failed 1");
            return res.send({success: false, message: 'Auth error'});
        });
      }
      else
        console.log("Failed Failed 2");
        return res.send({success: false, message: 'Auth error'});
    });
  }
  else
    console.log("Failed Failed 3");
    return res.send({success: false, message: 'Auth error'});
};

exports.checkFBToken = function (req, res, next) {
  var accessToken = req.body.access_token;
  if (accessToken === undefined)
  {
     return res.send({success: false, message: 'Invalid access token'});
  }
  else
  {
     https.get('https://graph.facebook.com/me?access_token=' + accessToken, function(response){
         response.setEncoding('utf8');
         var rawData = '';
         response.on('data', function(chunk){rawData += chunk});
         response.on('end', function() {
               try {
                    var parsedData = JSON.parse(rawData);
                    if (parsedData.error)
                    {
                      return res.send({success: false, message: 'Invalid access token'});
                    }
                    else {
                      var facebookUserProfile = {
                        firstName: req.body.firstName,
                        lastName: req.body.lastName,
                        displayName: req.body.firstName + ' ' + req.body.lastName,
                        email: req.body.email,
                        username: req.body.email,
                        profileImageURL: '//graph.facebook.com/' + parsedData.id + '/picture?type=large',
                        provider: 'facebook',
                        providerData: parsedData
                      };

                      facebookUserProfile.providerData.accessToken = accessToken;
                      facebookUserProfile.providerData.firstName = req.body.firstName;
                      facebookUserProfile.providerData.lastName = req.body.lastName;
                      req.facebookUserProfile = facebookUserProfile;
                      next();
                    }
                 } catch (e) {
                    return res.send({success: false, message: e.message});
                 }
               });
    }).on('error', function(e){
       return res.send({success: false, message: e.message});
    });
  }
};
