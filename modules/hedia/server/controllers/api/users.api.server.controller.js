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
            firstName: validator.escape(user.firstName),
            diabetesType: user.diabetesType,
            dailyInsulinDosage: user.dailyInsulinDosage,
            bloodSugarEtalon: user.bloodSugarEtalon,
            lowBloodSugarLevel: user.lowBloodSugarLevel,
            highBloodSugarLevel: user.highBloodSugarLevel,
            insulinToCarbRatio: user.insulinToCarbRatio,
            insulinSensitivityFactor: user.insulinSensitivityFactor,
            enabledNotice: user.enabledNotice,
            threeKStepPersent: user.threeKStepPersent,
            sixKStepPersent: user.sixKStepPersent,
            timeForAction: user.timeForAction,
            glucoseIncrease: user.glucoseIncrease
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
  if (req.body.firstName !== undefined) user.firstName = req.body.firstName;
  if (req.body.lastName !== undefined) user.lastName = req.body.lastName;
  if (req.body.email !== undefined)
  {
     user.email = req.body.email;
     user.username = req.body.username || req.body.email;
  }
  if (req.body.firstName !== undefined || req.body.lastName !== undefined)
  {
    user.displayName = user.firstName + ' ' + user.lastName;
  }

  if (req.body.diabetesType !== undefined) user.diabetesType = req.body.diabetesType;
  if (req.body.dailyInsulinDosage !== undefined) user.dailyInsulinDosage = req.body.dailyInsulinDosage;

  if (req.body.bloodSugarEtalon !== undefined) user.bloodSugarEtalon = req.body.bloodSugarEtalon;
  if (req.body.lowBloodSugarLevel !== undefined) user.lowBloodSugarLevel = req.body.lowBloodSugarLevel;
  if (req.body.highBloodSugarLevel !== undefined) user.highBloodSugarLevel = req.body.highBloodSugarLevel;
  if (req.body.insulinToCarbRatio !== undefined) user.insulinToCarbRatio = req.body.insulinToCarbRatio;
  if (req.body.insulinSensitivityFactor !== undefined) user.insulinSensitivityFactor = req.body.insulinSensitivityFactor;
  if (req.body.enabledNotice !== undefined) user.enabledNotice = req.body.enabledNotice;

  if (req.body.timeForAction !== undefined) user.timeForAction = req.body.timeForAction;
  if (req.body.glucoseIncrease !== undefined) user.glucoseIncrease = req.body.glucoseIncrease;

  if (req.buildFileUrl !== undefined)
  {
      user.profileImageURL = req.buildFileUrl;
  }

  if (req.body.threeKStepPersent !== undefined) user.threeKStepPersent = req.body.threeKStepPersent;
  if (req.body.sixKStepPersent !== undefined) user.sixKStepPersent = req.body.sixKStepPersent;

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




