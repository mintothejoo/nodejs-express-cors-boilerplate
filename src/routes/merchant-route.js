var express = require('express');
var router = express.Router();
var merchant = require('./../controller/merchant');

router.get('/profile', merchant.getProfile);

router.get('/accountinfo', merchant.getAccountInfo);

router.post('/state', merchant.getState);

router.post('/setup-pos', merchant.setupPos);

router.put('/profile/:id', merchant.put);

router.put('/password/:id', merchant.editPassword);

router.put('/verify/:id', merchant.verifyPassword);

router.get('/coupons', merchant.getCoupon);

router.get('/newsletter', merchant.getNewsletter);

router.get('/rewards', merchant.getRewards);

router.get('/store-pos', merchant.getStorePos);

router.get('/transaction-count', merchant.getTransactionCount);

router.get('/transaction-count-by-day', merchant.getTransactionCountByDay);

router.get('/total-offers-redeemed', merchant.getTotalOffersRedeemed);

router.get('/total-offers-redeemed-by-day', merchant.getTotalOffersRedeemedByDay);

router.get('/top-cashier', merchant.getTopCashier);

router.get('/store', merchant.getStores);

router.get('/pos', merchant.getPos);

router.put('/goal', merchant.setGoal);

module.exports = router;
