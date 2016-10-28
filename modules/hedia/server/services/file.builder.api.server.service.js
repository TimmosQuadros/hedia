'use strict';
var fs = require('fs'),
    token = require('crypto-token'),
    path = require('path'),
    config = require(path.resolve('./config/config'));

/**
 * Module dependencies.
 */
exports.fileBuilder = function (req, res, next) {
  var b64string = req.body.photo;
  if (b64string !== undefined)
  {
    try{
        var filePath = path.join(config.uploads.profileUpload.dest, token(12));
        fs.appendFile(filePath, new Buffer(b64string, 'base64'), function (err) {
          if (err) {
            return res.send({success: false, message: err});
          } else {
            req.buildFileUrl = './' + filePath.replace(/\\/g, '/');
            next()
          }
        });
    }
    catch (error)
    {
      return res.send({success: false, message: error});
    }
    finally {
      delete req.body.photo;
    }
  }
  else {
      next();
  }

};

