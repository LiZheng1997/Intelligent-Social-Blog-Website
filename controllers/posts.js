/**
 * The POST MongoDB collection controller, which manipulates the query operation in DB side.
 * @author Junxiang Chen
 */

var Post = require('../models/posts');

var moment = require('moment');

/**
 * This function queries all docs from the post collection in MongoDB to client side.
 * Depends on the query result, it will send the response to the client side.
 * @param req the request from client side
 * @param res the response sent from the sever side
 */
exports.query = function (req, res) {
    var data = req.body;
    console.log('query req body', data);
    Post.find({}, function (err, doc) {
        if (err) {
            console.error(err);
            res.status(500).send('Unable to query')
        } else {
            console.log(doc);
            res.send(JSON.stringify(doc))
        }
    });
};

/**
 * This function queries specific post id from the post collection in MongoDB to client side.
 * Using exact matching.
 * Depends on the query result, it will send the response to the client side.
 * @param req the request from client side
 * @param res the response sent from the sever side
 */
exports.queryByEventId = function (req, res) {
    var eventId = req.params.event_id;
    console.log('query event id', eventId);
    Post.find({'event.id': eventId}, function (err, doc) {
        if (err) {
            console.error(err);
            res.status(500).send('Unable to query by event id')
        } else {
            console.log(doc);
            res.send(JSON.stringify(doc))
        }
    });
};

/**
 * This function queries specific event name from the post collection in MongoDB to client side.
 * Using fuzzy matching.
 * Depends on the query result, it will send the response to the client side.
 * @param req the request from client side
 * @param res the response sent from the sever side
 */
exports.queryByEventName = function (req, res) {
    var eventName = req.params.event_name;
    console.log('query event name', eventName);
    Post.find({'event.name': {$regex: eventName, $options: 'i'}}, function (err, doc) {
        if (err) {
            console.error(err);
            res.status(500).send('Unable to query by event name')
        } else {
            console.log(doc);
            res.send(JSON.stringify(doc))
        }
    })
};

/**
 * This function queries specific date from the post collection in MongoDB to client side.
 * Using fuzzy matching.
 * Depends on the query result, it will send the response to the client side.
 * @param req the request from client side
 * @param res the response sent from the sever side
 */
exports.queryByDate = function (req, res) {
    var date = req.params.post_date;
    console.log('post date', req.params);
    var start = moment(date, 'D MMM YYYY').startOf('day');
    var end = moment(date, 'D MMM YYYY').endOf('day');
    console.log('start', start, 'end', end);
    Post.find({date: {$gte: start, $lte: end}}, function (err, doc) {
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
 * This function queries specific location from the post collection in MongoDB to client side.
 * Using fuzzy matching.
 * Depends on the query result, it will send the response to the client side.
 * @param req the request from client side
 * @param res the response sent from the sever side
 */
exports.queryByLocation = function (req, res) {
    var location = req.params.location;
    console.log('post location', location);
    Post.find({'location.name': {$regex: location, $options: 'i'}}, function (err, doc) {
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
 * This function queries specific location from the post collection in MongoDB to client side.
 * Using exact matching.
 * Depends on the query result, it will send the response to the client side.
 * @param req the request from client side
 * @param res the response sent from the sever side
 */
exports.queryByUser = function (req, res) {
    var userId = req.params.user_id;
    console.log('query user id', userId);
    Post.find({'user.id': userId}, function (err, doc) {
        if (err) {
            console.error(err);
            res.status(500).send(err)
        } else {
            console.log('query by user', doc);
            res.send(JSON.stringify(doc))
        }
    })
};

/**
 * This function insert a specific post object from the client side request to MongoDB.
 * Depends on the query result, it will send the response to the client side.
 * @param req the request from client side
 * @param res the response sent from the sever side
 */
exports.insert = function (req, res) {
    var data = req.body;
    console.log('user', req.user);
    if (data === null) {
        res.status(403).send('No data sent!')
    } else if (req.user === undefined) {
        res.status(401).send('Not login!')
    } else {
        var user = {
            id: req.user._id,
            name: req.user.username
        };
        try {
            var post = new Post({
                event: data.event,
                content: data.content,
                location: data.location,
                images: data.images,
                user: user
            });
            console.log('received:', post);
            post.save(function (err, results) {
                if (err) {
                    res.status(500).send('Invalid data: ' + err)
                } else {
                    console.log('post saving:', results._id);
                    res.setHeader('Content-Type', 'application/json');
                    console.log('insert post', post);
                    res.send(JSON.stringify(post))
                }
            })
        } catch (e) {
            res.status(500).send('Error: ' + e);
        }
    }
};