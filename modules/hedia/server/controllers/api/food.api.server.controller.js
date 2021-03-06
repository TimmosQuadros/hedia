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
    barcode: food.barcode,
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
  var cateGoryExists = false;

  Categories.find({ name: food.category }).exec(function (err, cat) {
    if (err) {
      return res.send({
        success: false,
        message: errorHandler.getErrorMessage(err)
      });
    }
    else {
      if (cat.length < 1) {
        return res.send({
          succes: false,
          message: "category doesn't exists"
        });
      } else {

        cat.forEach(function (element) {

          element.subCategories.forEach(function (subCategoryListItem) {
            console.log(subCategoryListItem == food.subCategory);

            if (subCategoryListItem == food.subCategory) {
              cateGoryExists = true;
            }
          }
          )
        }, this);

        if (cateGoryExists) {
          food.save(function (err) {
            if (err) {
              return res.send({
                success: false,
                message: errorHandler.getErrorMessage(err)
              });
            } else {
              res.jsonp(
                {
                  success: true,
                  food: safeFoodObject(food)
                });
            }
          });
        } else {
          return res.send({
            succes: false,
            message: "subcategory doesn't exists"
          });
        }
      }
    }
  });
};

exports.foodByBarcode = function(req, res, next) {

  var barcode = req.params.barcode;

  Food.findOne({barcode: barcode}).exec(function (err, food) {
    if (err) {
      return next(err);
    } else if (!food) {
      return res.status(404).send({success: false,
        message: 'No food with that barcode has been found'
      });
    }
    req.food = food;
    next();
  });

};

exports.getBarcode = function (req, res, next) {

if(!req.food){
  return res.jsonp({
    success: false,
    message: "parameter not recognized, nothing to search for"
  });

}else{
  res.jsonp(req.food);
}


  /*Food.find({ 'barcode': req.query.barcode }).exec(function (err, food) {


    if (err) {
      return res.send({
        success: false,
        message: errorHandler.getErrorMessage(err)
      });
    }

    else if (!food.length) {
      return res.jsonp({
        success: false,
        message: "no food with that barcode in food db"
      });
    } else {
      res.jsonp(found_barcode);
    }
  });*/
};

