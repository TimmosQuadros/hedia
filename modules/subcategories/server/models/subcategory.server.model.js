'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;


/**
 * SubCategory Schema
 */
var SubCategorySchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: true
  },
  foods: {
    type: [Schema.ObjectId],
    ref: 'Food'
  }
});
mongoose.model('SubCategory', SubCategorySchema);
