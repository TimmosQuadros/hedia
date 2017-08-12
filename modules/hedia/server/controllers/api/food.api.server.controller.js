'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Food = mongoose.model('Food'),
  Categories = mongoose.model('Categories'),
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
    meassureUnit: food.meassureUnit,
    category: food.category,
    subCategory: food.subCategory
  };
}



exports.postFood = function (req, res) {
  var food = new Food(req.body);

  Categories.find({ name: food.category }).exec(function (err, cat) {
    if (err) {
      return res.send({
        success: false,
        message: "category doesn't exists"
      });
    }
    else {

      cat.forEach(function (element) {
        
        element.subCategories.forEach(function(subCategoryListItem){
          console.log(subCategoryListItem);

                if (subCategoryListItem == food.subCategory) {
        
                  food.save(function (err) {
                    if (err) {
                      return res.send({
                        success: false,
                        message: errorHandler.getErrorMessage(err)
                      });
                    } else {
                      return res.jsonp({
                        success: true,
                        food: safeFoodObject(food)
                      });
                    }
                  });
                } else {
                  res.jsonp({ 
                    succes: false, 
                    message: "subcategory doesn't exists" 
                  });
                }

        }

        )
        
        
      }, this);

    }
  });





};
