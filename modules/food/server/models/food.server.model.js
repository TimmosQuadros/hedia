'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

    /**
     * ENUMS
     */
    const CATEGORIES = ['DAIRY','GRAINS','EGG','BREAD','VEGETABLES','FRUIT','MEAT','FISH'];
    const SUBCATEGORIES = ['','','',''];

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
    saturatedFat: {
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
        enum: ['g', 'ml'],
        default: 'g'
    },
    category: {
        type: String,
        enum: CATEGORIES,
        default: ''
    },
    subCategory: {
        type: String,
        enum: SUBCATEGORIES,
        default: ''
    }

});

mongoose.model('Food', FoodSchema);
