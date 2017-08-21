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

exports.getBarcode = function (req, res, next) {


  /* var db = req.db.get,
        collection = db.get('foods');
        collection.find
   */
  //var barcode = req.query.barcode;
  console.log("this was the parameter given: " + req.query.barcode)


  Food.find({ 'barcode': req.query.barcode }).exec(function (err, found_barcode) {
    if (!found_barcode.length) {
//    console.log("inside if WE got here!");
      return res.jsonp({
        succes: false,
        message: "Du er en ABE fiks det!"
      });
    }

    console.log("value of found_barcode" + found_barcode)
    if (err) { return next(err); }
    else if (found_barcode) { res.jsonp(found_barcode); }
  });

  //res.jsonp({success: true});

};
