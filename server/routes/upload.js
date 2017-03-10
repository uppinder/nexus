var router = require('express').Router();
var multiparty = require('multiparty');
var fs = require('fs.extra');
var shortid = require('shortid');
var path = require('path');
var User = require('../models/user.js');

function uploadFile(req, mustBeImg, cb) {
    var form = new multiparty.Form();
    form.parse(req, function(err, fields, files) {
        var file = files.file[0];
        var contentType = file.headers['content-type'];
        var tempPath = file.path;
        var fileExt = path.extname(tempPath);
        var fileName = shortid.generate() + fileExt;
        var destPath = path.join(__dirname, '../../client/public', fileName);

        if(mustBeImg) {
            // Server side file type checker.
            if (contentType !== 'image/png' && contentType !== 'image/jpeg') {
                fs.unlink(tmpPath);
                cb(true, null);
             } else {
                fs.move(tempPath, destPath, function(e) {
                    var err = e?e:null;
                    cb(err, fileName);
                });
             }

        } else {
            fs.move(tempPath, destPath, function(e) {
                var err = e?e:null;
                cb(err, fileName);
            });
        }

    });
}

router.post('/file', function(req,res) {
    uploadFile(req, false, function(err, fileName) {
        if(err) {
            return res.status(400).json({
                status: 'Upload unsuccessful!'
            });
        } 

        return res.status(200).json({
            fileName: fileName
        });
    }); 
});

router.post('/profilePic', function(req, res) {
    uploadFile(req, true, function(err, imgName) {
       if (err) {
            console.log(err);
            return res.status(400).json({
                status: 'Image is not saved.'
            });
        }

        User.findById(req.user._id, function(err, acc) {
            if(err) {
                console.log(err);
                res.status(400).json({
                    status:'Invalid User.'
                });
            }

            acc.profilePic = imgName;
            acc.save(function() {       
                    return res.status(200).json({
                        status: 'Profile Pic Saved!'
                });
            });
            
        });
    });
});


module.exports = router;