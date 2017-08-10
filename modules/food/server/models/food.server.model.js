'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var parseDate = function (dateSTring) {
    var newDate = dateSTring.split('-');
    return newDate[1] + '-' + newDate[0] + '-' + newDate[2];
};

/**
* Food Schema
*/
var FoodSchema = new Schema({
    title: {
        type: String,
        unique: 'title already exists',
        trim: true,
        lowercase: true
    },
    energy: {
        type: Number,
        default: 0
    },
    proteins: {
        type: Number,
        default: 0
    },
    carbonhydrates: {
        type: Number,
        default: 0
    },
    fiber: {
        type: Number,
        default: 0
    },
    sugars: {
        type: Number,
        default: 0
    },
    weight: {
        type: Number,
        default: 0
    },
    fat: {
        type: Number,
        default: 0
    },
    productImageURL: {
        type: String,
        default: 'modules/food/client/img/food/default.jpg'
    },
    updated: {
        type: Date,
        default: Date.now
    },
    created: {
        type: Date,
        default: Date.now
    },
    hediaStatus: {
        type: String,
        enum: ['pending', 'approved'],
        default: 'pending'
    },
    meassureUnit: {
        type: String,
        enum: ['g', 'l', 'ml'],
        default: 'g'
    },
    category: {
        type: String,
        default: '',
        required: 'Please fill category'
    },
    subCategory: {
        type: String,
        default: '',
        required: 'Please fill sub-category'
    },


});

mongoose.model('Food', FoodSchema);
