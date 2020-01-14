/**
 * The configuration module of MongoDB.
 * @author Junxiang Chen
 */

var mongoose = require('mongoose');
var ObjectId = require('mongodb').ObjectID;
var bcrypt = require('bcryptjs');

var mongoDB  = 'mongodb://localhost:27017/com6504_assignment';

mongoose.Promise = global.Promise;
// address the warning:
// DeprecationWarning: collection.ensureIndex is deprecated. Use createIndexes instead.
mongoose.set('useCreateIndex', true);
mongoose.connect(mongoDB, { useNewUrlParser: true }).then(
    function (value) { console.log('com6504_assignment db connect'); }).catch(
        function (reason) {
        console.error(reason)
});
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error'));
