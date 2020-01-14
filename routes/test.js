var express = require('express');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017";
var route = express.Router();

route.get('/', function (req, res, next) {
    MongoClient.connect(url,{ useNewUrlParser: true }, function (err, db) {
        if (err) {
            throw err
        }
        console.log("database connected!");
        var dbo = db.db('test');
        dbo.collection('col').find({}).toArray(function (mongoError, objects) {
            if (mongoError) {
                throw mongoError;
            }
            console.log(objects);
        });
        db.close()
    });
    res.render('test_mongodb');
});

module.exports = route;