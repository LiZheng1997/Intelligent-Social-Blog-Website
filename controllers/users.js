/**
 * The USER MongoDB collection controller, which manipulates the query operation in DB side.
 * @author Junxiang Chen
 */

var passport = require('passport');
var url = require('url');
var User = require('../models/users');

var userController = {};

/**
 * This function insert a new user object from the client side request to MongoDB.
 * Depends on the query result, it will send the response to the client side.
 * Username is unique.
 * @param req the register info from client side
 * @param res the result of registration from sever side
 */
userController.doRegister = function (req, res) {
    var data = req.body;
    console.log('new user', data);

    if (data.password !== data.confirmPassword) {
        res.redirect(url.format({
            pathname: '/register',
            query: {
                valid: 'Password and confirm password do not match'
            }
        }))
    } else {
        User.register(new User({
            username: data.username,
            password: data.password
        }), data.password, function (err, user) {
            if (err) {
                console.log('register err', err.message);
                return res.redirect(url.format({
                    pathname: '/register',
                    query: {
                        valid: err.message
                    }
                }))
            }
            console.log('authenticate', user);
            passport.authenticate('local') (req, res, function () {
                res.redirect('/login')
            })
        })
    }
};

/**
 * This function authenticate the user login info.
 * If the user is authenticated, the server will allow user to switch to the login state.
 * It will also add a new session info to the client side.
 * @param req the login request from client side
 * @param res the login response from the sever side
 * @param next transfer control to the next middleware
 */
userController.doLogin = function (req, res, next) {
    var data = req.body;
    req.login(new User({
        username: data.username,
        password: data.password
    }), function (err) {
        console.log('req user', req.user);
        if (err) {
            console.log('login err', err);
        }
        passport.authenticate('local') (req, res, function () {
            console.log('login req', req.body);
            res.setHeader('Cache-Control', 'no-cache');
            res.redirect('/')
        })
    })
};

module.exports = userController;

// exports.insert = function (req, res) {
//     var data = req.body;
//     if (data === null) {
//         res.status(403).send('No data sent!')
//     }
//     try {
//         var user = new User({
//             username: data.username,
//             password: data.password
//         });
//         console.log('received:', user);
//         user.save(function (err, results) {
//             console.log("user saving:", results._id);
//             if (err) {
//                 res.status(500).send('Invalid data')
//             }
//
//             res.setHeader('Content-Type', 'application/json');
//             res.send(JSON.stringify(user))
//         })
//     } catch (e) {
//         res.status(500).send('Error', e)
//     }
// };
//
// exports.query = function (req, res) {
//     var data = req.body;
//     if (data === null) {
//         res.status(403).send('No data sent!')
//     }
//     console.log(data)
// };