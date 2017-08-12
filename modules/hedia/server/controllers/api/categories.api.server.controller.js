'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Categories = mongoose.model('Categories'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash'),
  validator = require('validator');

var safeCategoryObject = function (category) {
  return {
    name: category.name,
    subCategories: category.subCategories
  };

}

exports.postCategory = function (req, res) {
  var category = new Categories(req.body);
  
  category.save(function (err) {
    if (err) {
      return res.send({
        success: false,
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp({ success: true, food: safeCategoryObject(category) });
    }
  });

  exports.getCategories = function (req, res) {
   
    Categories.find()
      .sort({ Name: 1 })
      .exec(function (err, categories) {
        if (err) {
          return res.send({
            success: false,
            message: errorHandler.getErrorMessage(err)
          });
        }
        else {
          res.jsonp({ success: true, categories: categories });
        }
      })
  }

};