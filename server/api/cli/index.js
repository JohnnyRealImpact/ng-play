'use strict';

var express = require('express');
var controller = require('./cli.controller');

var router = express.Router();

router.get('/', controller.index);
router.post('/', controller.execute);

module.exports = router;
