'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;


/**
 * Categories Schema
 */
var CategoriesSchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: true
  },
  subCategories: {
    type: [String],
  }
});



mongoose.model('Categories', CategoriesSchema);
