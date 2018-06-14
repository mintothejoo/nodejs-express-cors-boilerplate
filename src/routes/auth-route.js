var express = require('express');
var router = express.Router();
var auth = require('./../controller/auth');


router.post(
    '/authenticate',
    auth.authenticate
);

router.get(
    '/logout',
    auth.logout
);

module.exports = router;