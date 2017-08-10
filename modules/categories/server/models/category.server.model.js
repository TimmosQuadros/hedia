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
  title: {
    type: String,
    unique: true,
    required: true
  },
  subCategory: {
    type: Schema.ObjectId,
    ref: 'SubCategory'
  }
});



mongoose.model('Category', CategorySchema);
