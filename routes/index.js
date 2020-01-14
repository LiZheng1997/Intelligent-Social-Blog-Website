var express = require('express');
var router = express.Router();
var passport = require('passport');
var url = require('url');

var initDB = require('../controllers/init');
var posts = require('../controllers/posts');
var upload = require('../multer/storage');
// var users = require('../controllers/users');
var auth = require('../controllers/users');

initDB.init();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Posts' });
});

router.get('/query', posts.query);

router.post('/upload', upload.array('image'), function (req, res, next) {
  res.send(JSON.stringify(req.files))
});

router.post('/insert', posts.insert);

router.get('/login', function (req, res, next) {
  var query = url.parse(req.url, true).query;
  console.log('query', query);
  res.render('login', {valid: query.valid})
});

// router.post('/login', users.query);
// router.post('/login', auth.doLogin);
var failureRedirect = url.format({
  pathname: '/login',
  query: {
    valid: 'Username or password error'
  }
});
router.post('/login', passport.authenticate('login', {
  successRedirect: '/',
  failureRedirect: failureRedirect,
  failureFlash: true
}));

router.get('/register', function (req, res, next) {
  var query = url.parse(req.url, true).query;
  console.log('query', query);
  res.render('register', {valid: query.valid})
});

// router.post('/register', users.insert);
router.post('/register', auth.doRegister);

router.get('/logout', function (req, res, next) {
  req.logout();
  res.redirect('/')
});

router.io = function (io) {
  io.on('connection', function (socket) {
    console.log('io connect');
  });
  return io;
};

module.exports = router;
