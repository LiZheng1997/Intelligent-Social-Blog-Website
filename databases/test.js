/**
 * The test module for MongoDB.
 * @author Junxiang Chen
 */

var mongoose  = require('mongoose');
var objectId = require('mongodb').ObjectID;

var mongoDB = "mongodb://localhost:27017/test";

mongoose.Promise = global.Promise;
mongoose.connect(mongoDB);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection Error'));
console.log('db connect');