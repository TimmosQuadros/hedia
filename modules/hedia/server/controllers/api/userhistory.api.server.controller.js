'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  UserHistory = mongoose.model('Userhistory'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  validator = require('validator'),
  _ = require('lodash');


var safeHistoryObject = function(history){
  return {
    _id: history._id,
    changeStatus: history.changeStatus,
    bloodGlucose: history.bloodGlucose,
    foodGramms: history.foodGramms,
    exercises: history.exercises,
    insulineDosage: history.insulineDosage,
    date: history.date,
    time: history.time
  }};

var parseDate = function(dateSTring){
  var newDate = dateSTring.split('-');
  return newDate[1] + '-' + newDate[0] + '-' + newDate[2];
};

exports.postHistory = function(req, res) {
  var history = new UserHistory(req.body);
  history.user = req.user;
  history.save(function (err) {
    if (err) {
      return res.send({success: false,
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp({success: true, history: safeHistoryObject(history)});
    }
  });
};

exports.deleteHistory = function(req, res) {
  req.historylog.remove(function(err){
    if (err) {
        return res.send({success: false,
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          res.jsonp({success: true});
        }
  });
};


exports.getHistory = function(req, res) {
  var condition = {user: req.user._id};
  if (req.query.dates !== undefined)
  {
     var dates = req.query.dates.split(',');
     for (var i in dates)
     {
        dates[i] = dates[i].replace(/\s+/g, '');
     }
    condition.date = {$in: dates};
  }
  if (req.query.from && req.query.to)
  {
    condition.fullTime = {$gte: Date.parse(parseDate(req.query.from)) / 1000, $lte: Date.parse(parseDate(req.query.to)) / 1000}
  }

  if (condition.fullTime !== undefined && condition.date !== undefined)
  {
    condition.$or = [{fullTime: condition.fullTime}, {date: condition.date}];
    delete condition.fullTime;
    delete condition.date;
  }
  UserHistory.find(condition, "-fullTime -created -user")
             .sort('-created')
             .exec(function (err, userhistories){
                if (err)
                {
                  return res.send({success: false,
                    message: errorHandler.getErrorMessage(err)
                  });
                }
                else {
                  res.jsonp({success: true, histories: userhistories});
                }
             })
}



exports.historyLogByID = function(req, res, next) {

  var id = req.params.historyLogId;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({success: false,
      message: 'History Log ID is invalid'
    });
  }

  UserHistory.findOne({_id: id, user: req.user._id}).populate('user', 'displayName').exec(function (err, historylog) {
    if (err) {
      return next(err);
    } else if (!historylog) {
      return res.status(404).send({success: false,
        message: 'No Log History with that identifier has been found'
      });
    }
    req.historylog = historylog;
    next();
  });
};
