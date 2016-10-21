'use strict';
/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * User Token Schema
 */
var UserTokenSchema = new Schema({
  api_token: { type: String },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});
UserTokenSchema.index({ api_token: 1, type: -1 });
mongoose.model('UserToken', UserTokenSchema);

