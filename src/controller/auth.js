import NotFoundException from './../exception/not-found-exception';
import BadRequestException from './../exception/bad-request-exception';
import NotVerifiedException from './../exception/not-verified-exception';
import { __query } from './../helpers/parse';

import {
  AUTH_ERROR,
  AUTH_USER_NOT_FOUND,
  HTTP_NOT_FOUND_ERROR_CODE,
  HTTP_BAD_REQUEST_ERROR_CODE,
  HTTP_UNAUTHORIZED_REQUEST_ERROR_CODE,
  EMAIL_NOT_VERIFIED,
} from './../config/constants';
const passport = require('./../config/passport');

/**
 * @api {post} /api/auth/authenticate Authenticate a user using Parse
 * @apiName authenticate
 * @apiGroup Auth
 *
 * @apiParam {username} user username to login
 * @apiParam {password} user password to login
 *
 * @apiSuccess (200) {Object} object for the currently authenticated user.
 * @apiError (400) BadRequest
 */
exports.authenticate = (req, res, next) => {
  passport.authenticate('parse', (err, user, info) => {
    if (err) {
      return res.status(HTTP_BAD_REQUEST_ERROR_CODE).send({ success: false, message: 'Authentication Error', error: err });
    }

    if (!user) {
      next(new NotFoundException(AUTH_USER_NOT_FOUND));
    }
    if (user.get('emailVerified')) {
      console.log('email verified');
      req.logIn(user, async err => {
        try {
          err && next(new BadRequestException(AUTH_ERROR));
          req.user = user;
          req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000; // Cookie expires after 30 days
          req.session.cookie.httpOnly = true;
          req.user.wow = 'ali';
          if (req.body.remember) {
            req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000;
          } else {
            req.session.cookie.expires = false;
          }
          const merchantId = await user.get('merchantId');
          const merchantInfo = await __query('MerchantAccountInfo')
            .equalTo('merchantId', merchantId)
            .first({ sessionToken: user.get('sessionToken') });
          return await res.json({ user: req.user, accountInfo: merchantInfo });
        } catch (err) {
          console.log(err);
        }
      });
    } else {
      return next(new NotVerifiedException(EMAIL_NOT_VERIFIED));
    }
  })(req, res, next);
};

/**
 * @api {get} /api/auth/logout Log's a user out of the session and destroy's it
 * @apiName logout
 * @apiGroup Auth
 *
 * @apiSuccess (200) {Object} empty obejct
 * @apiError (400) BadRequest
 */
exports.logout = function(req, res, next) {
  req.session.destroy(function(err) {
    if (err) return next(err);
    res.clearCookie('connect.sid');
    res.send({});
  });
};
