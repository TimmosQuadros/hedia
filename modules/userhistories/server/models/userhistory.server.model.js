'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var parseDate = function(dateSTring){
  var newDate = dateSTring.split('-');
  return newDate[1] + '-' + newDate[0] + '-' + newDate[2];
};
/**
 * Userhistory Schema
 */
var UserhistorySchema = new Schema({
  bloodGlucose: {
    type: Number,
    default: '',
    required: 'Please fill Blood Glucose',
    trim: true},
  foodGramms: {
    type: Number,
    default: '',
    required: 'Please fill Food Gramms',
    trim: true},
  exercises: {
    type: Number,
    default: '',
    required: 'Please fill Exercises',
    trim: true},
  insulineDosage: {
    type: Number,
    default: '',
    required: 'Please fill Insuline Dosage',
    trim: true},
  date: {
    type: String,
    default: '',
    required: 'Please fill Date',
    trim: true},
  time: {
    type: String,
    default: '',
    required: 'Please fill Date',
    trim: true},
  fullTime: {type: Number},
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});
UserhistorySchema.pre('validate', function (next) {

  if (isNaN(Date.parse(parseDate(this.date))))
  {
    this.invalidate('date', 'Invalid date format ');
  }
  else
  {
    if (isNaN(Date.parse(parseDate(this.date) + ' ' + this.time)))
    {
      this.invalidate('time', 'Invalid time fromat');
    }
  }
  next();
});

UserhistorySchema.pre('save', function (next) {
  this.fullTime = Date.parse(parseDate(this.date) + ' ' + this.time)  / 1000;
  next();
});

//UserhistorySchema.index({user: 1, fullTime: 1}, {unique: true});

mongoose.model('Userhistory', UserhistorySchema);
