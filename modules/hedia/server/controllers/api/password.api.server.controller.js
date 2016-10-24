'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  config = require(path.resolve('./config/config')),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  nodemailer = require('nodemailer'),
  async = require('async'),
  token = require('crypto-token'),
  _ = require('lodash');

var smtpTransport = nodemailer.createTransport(config.mailer.options);

exports.passwordReset = function(req, res, next) {
  async.waterfall([
    // Generate random token
    function (done) {
      done(null, token());
    },
    // Lookup user by username
    function (token, done) {
      if (req.body.email) {
        User.findOne({
          username: req.body.email.toLowerCase()
        }, '-salt -password', function (err, user) {
          if (err || !user) {
            return res.send({success: false,
              message: 'No account with that email has been found'
            });
          } else if (user.provider !== 'local') {
            return res.send({success: false,
              message: 'It seems like you signed up using your ' + user.provider + ' account'
            });
          } else {
            user.resetPasswordToken = token;
            user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

            user.save(function (err) {
              done(err, token, user);
            });
          }
        });
      } else {
        return res.send({success: false,
          message: 'Email field must not be blank'
        });
      }
    },
    function (token, user, done) {
      res.render(path.resolve('modules/hedia/server/templates/reset-password-instruction'), {
        name: user.displayName,
        appName: config.app.title,
        token: token
      }, function (err, emailHTML) {
        done(err, emailHTML, user);
      });
    },
    // If valid email, send reset email using service
    function (emailHTML, user, done) {
      var mailOptions = {
        to: user.email,
        from: config.mailer.from,
        subject: 'Password Reset',
        html: emailHTML
      };
      smtpTransport.sendMail(mailOptions, function (err) {
        if (!err) {
          res.jsonp({success: true});
        } else {
          return res.send({success: false,
            message: 'Failure sending email'
          });
        }

        done(err);
      });
    }
  ], function (err) {
    if (err) {
      return next(err);
    }
  });
}

exports.passwordRecovery = function(req, res, next) {
  User.findOne({
    resetPasswordToken: req.body.token,
    resetPasswordExpires: {
      $gt: Date.now()
    }
  }, function (err, user) {
    if (!err && user) {
        user.password = req.body.newPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        user.save(function (err) {
          if (err) {
            return res.send({success: false,
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            user.password = undefined;
            user.salt = undefined;
            res.jsonp({success: true});
          }
        });
    } else {
      return res.send({success: false,
        message: 'Password reset token is invalid or has expired.'
      });
    }
  });
}
