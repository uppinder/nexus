var router = require('express').Router();
var multiparty = require('multiparty');
var fs = require('fs.extra');
var shortid = require('shortid');
var path = require('path');
var User = require('../models/user.js');

router.post('/profilepic', function(req, res, next) {
	var form = new multiparty.Form();
	form.parse(req, function(err, fields, files) {
		var img = files.file[0];
		var contentType = img.headers['content-type'];
		var tempPath = img.path;
		var imgExt = path.extname(tempPath);
		var imgName = shortid.generate() + imgExt;
		var destPath = path.join(__dirname, '../../client/public', imgName);

		// Server side file type checker.
        if (contentType !== 'image/png' && contentType !== 'image/jpeg') {
            fs.unlink(tmpPath);
            return res.status(400).json({
            	status:'Unsupported file type.'
        	});
        }

        fs.move(tempPath, destPath, function(err) {
            if (err) {
            	console.log(err);
                return res.status(400).json({
                	status: 'Image is not saved:'
                });
            }

            var user = req.user;
            User.findOne(user._id, function(err, acc) {
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
});

module.exports = router;