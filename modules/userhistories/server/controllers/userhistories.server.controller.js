'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  dateFormat = require('dateformat'),
  mongoose = require('mongoose'),
  Userhistory = mongoose.model('Userhistory'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Userhistory
 */
exports.create = function(req, res) {
  var userhistory = new Userhistory(req.body);
  userhistory.user = req.user;
  userhistory.date = dateFormat(req.body.date, "dd-mm-yyyy");
  userhistory.time = dateFormat(req.body.time, "hh:MM");
  userhistory.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      userhistory.date = req.body.date;
      userhistory.time = req.body.time;
      res.jsonp(userhistory);
    }
  });
};

/**
 * Show the current Userhistory
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var userhistory = req.userhistory ? req.userhistory.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  userhistory.isCurrentUserOwner = req.user && userhistory.user && userhistory.user._id.toString() === req.user._id.toString();

  res.jsonp(userhistory);
};

/**
 * Update a Userhistory
 */
exports.update = function(req, res) {
  var userhistory = req.userhistory;

  userhistory = _.extend(userhistory, req.body);
  userhistory.date = dateFormat(req.body.date, "dd-mm-yyyy");
  userhistory.time = dateFormat(req.body.time, "hh:MM");

  userhistory.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(userhistory);
    }
  });
};

/**
 * Delete an Userhistory
 */
exports.delete = function(req, res) {
  var userhistory = req.userhistory;

  userhistory.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(userhistory);
    }
  });
};

/**
 * List of Userhistories
 */
exports.list = function(req, res) {
  Userhistory.find({user: req.user._id}).sort('-fullTime').populate('user', 'displayName').exec(function(err, userhistories) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(userhistories);
    }
  });
};

/**
 * Userhistory middleware
 */
exports.userhistoryByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Userhistory is invalid'
    });
  }

  Userhistory.findOne({_id: id, user: req.user._id}).populate('user', 'displayName').exec(function (err, userhistory) {
    if (err) {
      return next(err);
    } else if (!userhistory) {
      return res.status(404).send({
        message: 'No Userhistory with that identifier has been found'
      });
    }
    req.userhistory = userhistory;
    next();
  });
};
