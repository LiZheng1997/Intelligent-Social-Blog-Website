/**
 * The EVENT schema configuration module of MongoDB.
 * @author Junxiang Chen
 */

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var Event = new Schema({
    name: {type: String, unique: true, required: true},
    content: {type: String, required: true},
    location: {
        name: {type: String, required: true},
        lat: Number,
        long: Number
    },
    date: {type: Date, index: true},
    user: {
        id: {type: String, required: true},
        name: {type: String, required: true}
    },
    number: {type: Number, default: 0, index: true}
});

var eventModel = mongoose.model('Event', Event);

module.exports = eventModel;