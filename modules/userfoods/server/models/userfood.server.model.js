'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * UserFood Schema
 */
var UserFoodSchema = new Schema({
  meal: {
    type: [{
      type: string,
      enum: ['breakfast', 'lunch', 'dinner',]
    }],
    required: 'must provide meal type'

  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('UserFood', UserFoodSchema);
