/**
 * The USER schema configuration module of MongoDB.
 * @author Junxiang Chen
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var User = new Schema({
    username: {type: String, unique: true, required: true},
    password: {type: String, required: true}
});

User.plugin(passportLocalMongoose);

var userModel = mongoose.model('User', User);

module.exports = userModel;