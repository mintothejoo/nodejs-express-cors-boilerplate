var express = require('express');
var router = express.Router();
var init = require('./../controller/init');

router.get('/', init.init);

module.exports = router;
