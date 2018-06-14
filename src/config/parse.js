var Parse = require('parse/node');

Parse.initialize( process.env.B4A_APP_ID, process.env.B4A_JS_KEY, process.env.B4A_MASTER_KEY );
Parse.serverURL = process.env.PARSE_ADDR;

var ParseClient = Parse;

module.exports = ParseClient;