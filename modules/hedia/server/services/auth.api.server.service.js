'use strict';

var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    UserToken = mongoose.model('UserToken');
/**
 * Module dependencies.
 */
exports.authByToken = function (req, res, next) {
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
            return res.send({success: false, message: 'Auth error'});
        });
      }
      else
        return res.send({success: false, message: 'Auth error'});
    });
  }
  else
    return res.send({success: false, message: 'Auth error'});
};
