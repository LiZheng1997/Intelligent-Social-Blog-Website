var express = require('express');
var router = express.Router();

var events = require('../controllers/events');
var posts = require('../controllers/posts');

router.get('/', function (req, res, next) {
    res.render('search_event')
});

router.get('/query', events.query);

router.get('/query/id/:event_id', events.queryById);

router.get('/query/name/:event_name', events.queryByName);

router.get('/query/date/:event_date', events.queryByDate);

router.get('/query/location/:event_location', events.queryByLocation);

router.get('/query/:event_id', posts.queryByEventId);

router.get('/:event_id', function (req, res, next) {
    res.render('search_event')
});

router.post('/insert', events.insert);

module.exports = router;
