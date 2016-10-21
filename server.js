'use strict';

/**
 * Module dependencies.
 */
process.env.NODE_ENV = 'production';
process.env.PORT = 3000;

process.env.FACEBOOK_ID = '1705420716378030';
process.env.FACEBOOK_SECRET = 'dff63e43581c345a60d61528814fc6dd';
process.env.DOMAIN = 'localhost';
process.env.MONGO_SEED = false;

process.env.SESSION_SECRET = '8b798de65e3cd3dba8c136f2170e6654d3eea7b371c7ac053e7ddd5fd0e0a850208a5c8600da5e4c76a9b3e07de2abf4e14b99ad28f15dbf5220ddc8b854ad28';
/**
 * email server environments
 */
process.env.MAILER_FROM = 'support@codevog.com';
process.env.SMTP_HOST = 'email-smtp.eu-west-1.amazonaws.com';
process.env.SMTP_PORT = 587;
process.env.SMTP_SECURE = true;
process.env.SMTP_TSL = false;
process.env.MAILER_EMAIL_ID = 'AKIAJKEGEIYPFINXO3LQ';
process.env.MAILER_PASSWORD = 'Ar/cs43bPnwAx8LPcf1tGNbLm+FbPVUtB1kio1/wNaXS';


var app = require('./config/lib/app');
var server = app.start();
