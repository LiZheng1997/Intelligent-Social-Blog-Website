/**
 * The MULTER configuration module for storing images.
 * @author Junxiang Chen
 */

var path = require('path');
var multer = require('multer');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.resolve(__dirname, '../dist/images'))
    },
    filename: function (req, file, cb) {
        var extname = path.extname(file.originalname);
        if (extname === "") {
            extname = ".webp"
        }
        cb(null, file.fieldname + '-'  + Date.now() + extname)
    }
});

var upload = multer({
    storage: storage
});

module.exports = upload;