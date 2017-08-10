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
  bloodGlucose: {
    type: Number,
    default: '',
    required: 'Please fill Blood Glucose',
    trim: true
  },
  foods: {
    type: [Schema.ObjectId],
    ref: 'Food'
  }
});
mongoose.model('SubCategory', SubCategorySchema);
