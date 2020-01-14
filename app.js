var favicon = require('serve-favicon');
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var logger = require('morgan');

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var app = express();

var indexRouter = require('./routes/index');
var eventsRouter = require('./routes/events');
var postsRouter = require('./routes/posts');
var usersRouter = require('./routes/users');

var testRouter = require('./routes/test');


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret: 'mySecretKey',
  resave: false,
  saveUninitialized: false
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'dist')));

var User = require('./models/users');
// passport.use(new LocalStrategy(User.authenticate()));
var isValidPassword = function(user, password) {
  return user.password === password
};
passport.use('login', new LocalStrategy({
  passReqToCallback: true
}, function (req, username, password, done) {
  User.findOne({username: username}, function (err, user) {
    if (err) {
      return done(err);
    }
    if (!user) {
      console.log('user not found with username', username);
      // return done(null, false, req.flash('message', 'user not found'))
      return done(null, false, null)
    }
    if (!isValidPassword(user, password)) {
      console.log('invalid password');
      // return done(null, false, req.flash('message', 'invalid password'))
      return done(null, false, null)
    }
    return done(null, user)
  })
}));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/events', eventsRouter);
app.use('/posts', postsRouter);
app.use('/users', usersRouter);
// app.use('/test', testRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
