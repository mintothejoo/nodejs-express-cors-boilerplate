var express = require('express');
var router = express.Router();
var merchant = require('./../controller/public/merchant');


router.post(
    '/sign-up',
    merchant.signUp
);

router.get(
    '/exists/:vendorName',
    merchant.merchantExists
);

module.exports = router;