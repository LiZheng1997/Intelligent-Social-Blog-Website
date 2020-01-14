var express = require('express');
var router = express.Router();

var posts = require('../controllers/posts');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.render('user_page')
});

router.get('/query', function (req, res, next) {
  console.log('authenticate', req.isAuthenticated(), req.user);
  if (req.isAuthenticated()) {
    console.log('user', req.user, req.session);
    res.status(200).send(req.user)
  } else {
    res.status(401).send('Not login')
  }
});

router.get('/query/:user_id', posts.queryByUser);

router.get('/:user_id', function (req, res, next) {
  console.log('user id', req.params);
  res.render('user_page')
});

router.get('/myself/:user_id', function(req, res, next) {
  console.log('myself user id', req.params);
  if (req.isAuthenticated()) {
    res.render('user_page');
  } else {
    res.redirect('/')
  }
});

module.exports = router;
