'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Food = mongoose.model('Food'),
  Categories = mongoose.model('Categories'),
  //subCategory = mongoose.model('SubCategory'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash'),
  validator = require('validator');

var safeFoodObject = function (food) {
  return {
    title: food.title,
    energy: food.energy,
    proteins: food.proteins,
    carbonhydrates: food.carbonhydrates,
    fiber: food.fiber,
    sugars: food.sugars,
    weight: food.weight,
    fat: food.fat,
    productImageURL: food.productImageURL,
    updated: food.updated.toString(),
    created: food.created.toString(),
    hediaStatus: food.hediaStatus,
    meassureUnit: food.meassureUnit
  };
}



exports.postFood = function(req, res) {
  var food = new Food(req.body);
  
  
  
  food.save(function (err) {
    if (err) {
      return res.send({success: false,
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp({success: true, food: safeFoodObject(food)});
    }
  });


  
};

var safeCategoryObject = function (category) {
  return {
    name: category.name,
    subCategories: category.subCategories
  };
  
}

exports.postCategory = function(req, res) {
  var category = new Category(req.body);
  
  
  
  category.save(function (err) {
    if (err) {
      return res.send({success: false,
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp({success: true, food: safeCategoryObject(category)});
    }
  });


  
};