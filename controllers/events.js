/**
 * The EVENT MongoDB collection controller, which manipulates the query operation in DB side.
 * @author Junxiang Chen
 */

var Event = require('../models/events');

var moment = require('moment');

/**
 * This function queries all docs from the event collection in MongoDB to client side.
 * Depends on the query result, it will send the response to the client side.
 * @param req the request from client side
 * @param res the response sent from the sever side
 */
exports.query = function (req, res) {
    Event.find({}, function (err, doc) {
        if (err) {
            console.error(err);
            res.status(500).send('Unable to query event')
        } else {
            console.log(doc);
            res.send(JSON.stringify(doc))
        }
    })
};

/**
 * This function queries specific event id from the event collection in MongoDB to client side.
 * Using exact matching.
 * Depends on the query result, it will send the response to the client side.
 * @param req the request from client side
 * @param res the response sent from the sever side
 */
exports.queryById = function (req, res) {
    var id = req.params.event_id;
    console.log('event id', req.params);
    Event.find({_id: id}, function (err, doc) {
        if (err) {
            console.error(err);
            res.status(500).send('Unable to query by id')
        } else {
            console.log(doc);
            res.send(JSON.stringify(doc))
        }
    })
};

/**
 * This function queries specific event name from the event collection in MongoDB to client side.
 * Using fuzzy matching.
 * Depends on the query result, it will send the response to the client side.
 * @param req the request from client side
 * @param res the response sent from the sever side
 */
exports.queryByName = function (req, res) {
    var name = req.params.event_name;
    console.log('event name', req.params);
    Event.find({name: {$regex: name, $options: 'i'}}, function (err, doc) {
        if (err) {
            console.error(err);
            res.status(500).send('Unable to query by name')
        } else {
            console.log(doc);
            res.send(JSON.stringify(doc))
        }
    })
};

/**
 * This function queries specific event date from the event collection in MongoDB to client side.
 * Using fuzzy matching.
 * Depends on the query result, it will send the response to the client side.
 * @param req the request from client side
 * @param res the response sent from the sever side
 */
exports.queryByDate = function (req, res) {
    var date = req.params.event_date;
    var start = moment(date, 'D MMM YYYY').startOf('day');
    var end = moment(date, 'D MMM YYYY').endOf('day');
    console.log('event date', req.params);
    Event.find({date: {$gte: start, $lte: end}}, function (err, doc) {
        if (err) {
            console.error(err);
            res.status(500).send('Unable to query by date')
        } else {
            console.log(doc);
            res.send(JSON.stringify(doc))
        }
    })
};

/**
 * This function queries specific event location from the event collection in MongoDB to client side.
 * Using fuzzy matching.
 * Depends on the query result, it will send the response to the client side.
 * @param req the request from client side
 * @param res the response sent from the sever side
 */
exports.queryByLocation = function (req, res) {
    var location = req.params.event_location;
    console.log('event location', location);
    Event.find({'location.name': {$regex: location, $options: 'i'}}, function (err, doc) {
        if (err) {
            console.error(err);
            res.status(500).send('Unable to query by location')
        } else {
            console.log(doc);
            res.send(JSON.stringify(doc))
        }
    })
};

/**
 * This function insert a specific event object from the client side request to MongoDB.
 * Depends on the query result, it will send the response to the client side.
 * @param req the request from client side
 * @param res the response sent from the sever side
 */
exports.insert = function (req, res) {
    var data = req.body;
    console.log('event', data);
    if (data === null) {
        res.status(403).send('No data sent!')
    } else if (req.user === undefined) {
        res.status(401).send('Not login')
    } else {
        var user = {
            id: req.user._id,
            name: req.user.username
        };
        try {
            var event = new Event({
                name: data.name,
                content: data.content,
                location: data.location,
                date: data.date,
                user: user
            });
            console.log('received', event);
            event.save(function (err, results) {
                if (err) {
                    res.status(500).send('Invalid data: ' + err)
                } else {
                    console.log('event saving:', results._id);
                    res.setHeader('Content-Type', 'application/json');
                    console.log('insert event', event);
                    res.send(JSON.stringify(event))
                }
            })
        } catch (e) {
            res.status(500).send('Error', e)
        }
    }
};