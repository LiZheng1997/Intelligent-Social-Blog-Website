var express = require('express');
var router = express.Router();

var posts = require('../controllers/posts');

router.get('/', function (req, res, next) {
    res.render('search_post')
});

router.get('/query/name/:event_name', posts.queryByEventName);

router.get('/query/date/:post_date', posts.queryByDate);

router.get('/query/location/:location', posts.queryByLocation);

module.exports = router;