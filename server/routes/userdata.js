var express = require('express');
var router = express.Router();
var User = require('../models/user.js');
//For testing

router.get('/pic', function(req, res) {
	User.findById(req.user._id, function(err, acc) {
		if(err) {
			console.log(err);
			res.status(400).send('Invalid user.');
		}

		var payload = {
			profilePic: acc.profilePic,
			name: acc.name
		};

		res.status(200).json(payload);
	});
});

module.exports = router;