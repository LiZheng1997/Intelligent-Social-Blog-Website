/**
 * The POST schema configuration module of MongoDB.
 * @author Junxiang Chen
 */

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var Post = new Schema({
    event: {
        name: {type: String, required: true},
        id: {type: String, required: true, max: 140}
    },
    content: {type: String, required: true},
    location: {
        name: {type: String, required: true},
        lat: Number,
        long: Number
    },
    images: {type: [String], required: true},
    date: {type: Date, default: Date.now, index: true},
    user: {
        id: {type: String, required: true},
        name: {type: String, required: true}
    }
});

var postModel = mongoose.model('Post', Post);

module.exports = postModel;