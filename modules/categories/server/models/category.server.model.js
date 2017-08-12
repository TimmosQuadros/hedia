'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;


/**
 * Category Schema
 */
var CategorySchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: true
  },
  subCategories: {
    type: [String],
  }
});



mongoose.model('Category', CategorySchema);
