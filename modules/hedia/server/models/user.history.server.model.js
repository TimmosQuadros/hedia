'use strict';
/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * User History Schema
 */

var UserHistorySchema = new Schema({
  bloodGlucose: {type: Number},
  foodGramms: {type: Number},
  exercises: {type: Number},
  insulineDosage: {type: Number},
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('UserHistory', UserHistorySchema);

