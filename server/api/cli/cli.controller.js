'use strict';

var _ = require('lodash');
var Promise = require('promise');

// Get list of things
exports.index = function (req, res) {
  try {
    var info = {
      cwd: process.cwd(),
    };

    // -------------------------------------------------
    return new Promise(function (resolve, reject) {
      try {
        var val = res.status(200).json(info);
        resolve(val);
      } catch (ex) {
        reject(ex);
      }
    });
    // -------------------------------------------------

    return res.status(200).json(info);
  } catch (ex) {
    handleError(res, err);
  }
};

// Creates a new thing in the DB.
exports.execute = function (req, res) {
  try {
    var info = {
      cwd: process.cwd(),
    };

    // -------------------------------------------------
    return new Promise(function (resolve, reject) {
      try {
        console.log(' - CMD: ', req.body.input);
        var exec = require('child_process').exec;
        var cmd = req.body.input;
        exec(cmd, function(error, stdout, stderr) {
          // Set stream values
          //info.error = error;
          info.stdout = stdout;
          info.stderr = stderr;
          console.log(' - RES:', info);

          var val = res.status(200).json(info);
          resolve(val);
          return;

          // Check for error response
          //if (error) {
          //  var val = res.status(500).json(info);
          //  resolve(val);
          //  //reject(error);
          //} else {
          //  var val = res.status(200).json(info);
          //  resolve(val);
          //}
        });
      } catch (ex) {
        reject(ex);
      }
    });
    // -------------------------------------------------

    return res.status(200).json(info);
  } catch (ex) {
    handleError(res, err);
  }
};

function handleError(res, err) {
  return res.status(500).send(err);
}
