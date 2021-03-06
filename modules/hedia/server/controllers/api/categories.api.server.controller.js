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
  var categories = new Categories(req.body);

  categories.save(function (err) {
    if (err) {
      return res.send({
        success: false,
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp({ success: true, categories: safeCategoryObject(categories) });
    }
  });
}

exports.getCategories = function (req, res) {

  

  Categories.find().exec(function (err, cat){
                if (err)
                {
                  return res.send({success: false,
                    message: errorHandler.getErrorMessage(err)
                  });
                }
                else {
                  res.jsonp({success: true, categories: cat});
                }
             });

}


