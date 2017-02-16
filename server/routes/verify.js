var router = require('express').Router();
var path = require('path');
var User = require('../models/user.js');
var tempUser = require('../models/tempUser.js');
	
router.get('/:token', function(req, res, next) {
	token = req.params.token;
		tempUser.findOne({token: token}, function(err, temp_user) {
		if(err) {
			res.status(500);
		}
		if(temp_user) {

			var username = temp_user.username;
			
			User.findOne({username: username}, function(err, user) {
				if(err || !user) {
					res.status(500);
				}

				user.verified = true;
			
				user.save(function() {
			
					if(err) {
						console.log(err);
						return res.status(500);
					}

					temp_user.remove();

					req.logIn(user, function(err) {
						if (err) {
					    	return res.status(500).json({
					        	err: 'Could not log in user.'
					        });
					    }
					    console.log('User verified!');
					    res.status(200).json({
					        status: 'User verification successful!',
					        verified: user.verified
     					 });
					});

				});

			});
		} else {
			res.status(404).json({
				status: 'Invalid Token.'
			});
		}
	});
});

module.exports = router;