'use strict';

/**
 * Module dependencies.
 */
exports.checkJsonHeader = function (req, res, next) {
  if (req.is('application/json'))
    next();
  else
    return res.send({success: false, message: 'Bed request'});
};
