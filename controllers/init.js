/**
 * The initialisation module for starting MongoDB schemas and sever image directory.
 * @author Junxiang Chen
 */

var mongoose = require('mongoose');
var Post = require('../models/posts');
var User = require('../models/users');
var path = require('path');
var fs = require('fs');

/**
 * Initialise a directory for storing images.
 * @param dirname the destination of storing images
 * @returns {boolean} the result of creation
 */
function mkdirsSync(dirname) {
    //console.log(dirname);
    if (fs.existsSync(dirname)) {
        return true;
    } else {
        if (mkdirsSync(path.dirname(dirname))) {
            fs.mkdirSync(dirname);
            return true;
        }
    }
}

exports.init = function () {
    mkdirsSync(path.resolve(__dirname, '../dist/images'))
};