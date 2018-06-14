import { __query } from './../helpers/parse';

var passport = require('passport');
var PassportParse = require('passport-parse');
var ParseClient = require('./parse');

var ParseStrategy = new PassportParse({ parseClient: ParseClient });

passport.use(ParseStrategy);

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  __query('Merchant')
    .get(obj.merchantId.objectId, { sessionToken: obj.sessionToken })
    .then(response => {
      obj.merchant = response;
      done(null, obj);
    })
    .catch(error => {
      console.log(error);
      done(null, obj);
    });
});

module.exports = passport;
