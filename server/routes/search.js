var router = require('express').Router();
var User = require('../models/user.js');

router.get('/all', function(req, res) {
	// console.log(req.query);
	var searchKey = new RegExp(req.query.key,'i');
	User.find({
		$or : [
			{'username': searchKey},
			{'name.firstname': searchKey},
			{'name.lastname': searchKey}
		]
	}).
	limit(5).
	select('username profilePic name').
	exec(function(err,users) {
		if(!err) {
			console.log(users);
			res.status(200).json({
				result: users
			});
		} else {
			console.log(err);
			res.status(400)
		}
	});
});

router.get('/friends', function(req, res) {
	
	// console.log(req.query);
	var searchKey = new RegExp(req.query.key, 'i');
	
	User.findById(req.user._id, function(err, self) {
		if(err || !self) {
			console.log(err);
			res.status(400);
		}

		var opts = {
			path: 'friends',
			select: 'username profilePic name',
			options: { limit: 5 },
			match: {
				$or: [
					{'username': searchKey},
					{'name.firstname': searchKey},
					{'name.lastname': searchKey}
				]	
			}
		};

		User.populate(self, opts, function(err, user) {
			if(err || !user) {
				console.log(err);
				res.status(400);
			}

			res.status(200).json({
				result: user.friends
			});
		});
	});

	
});

module.exports = router;