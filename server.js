'use strict';

/**
 * Module dependencies.
 */
process.env.NODE_ENV = 'development';
process.env.FACEBOOK_ID = '1705420716378030';
process.env.FACEBOOK_SECRET = 'dff63e43581c345a60d61528814fc6dd';
process.env.DOMAIN = 'localhost';
process.env.MONGO_SEED = false;

var app = require('./config/lib/app');
var server = app.start();
