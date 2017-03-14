var router = require('express').Router();
var User = require('../models/user.js');
var Event = require('../models/event.js')
var _ = require('lodash');

router.get('/user/:id', function(req, res) {
	User.findOne({username:req.params.id}, function(err, acc) {
		if(err || !acc) {
			console.log(err, acc);
			res.status(404).json({
				status: 'User not found!'
			});
			
		} else {
			var isFriend = false;
			User.findById(req.user._id, function(err, self) {

				if(_.find(self.friends, acc._id))
					isFriend = true;

				res.status(200).json({
					user: acc,
					isFriend: isFriend
				});			
			});
		}
	});
});

router.post('/add', function(req, res) {
	User.findOne({username:req.body.username}, function(err, acc) {
		if(err || !acc) {
			console.log(err);
			res.status(400).json({
				status: "Couldn't add as friend"
			});
		}

		User.findById(req.user._id, function(err, user) {
			user.friends.addToSet(acc);
			acc.friends.addToSet(req.user._id);
			acc.save(function() {
				user.save(function() {
					res.status(200).json({
						status: 'User added as friend!'
					});
				});	
			});
		});
	});
});

router.get('/pic', function(req, res) {
	User.findById(req.user._id, function(err, acc) {
		if(err) {
			console.log(err);
			res.status(400).send('Invalid user.');
		}

		var payload = {
			profilePic: acc.profilePic,
			name: acc.username
		};

		res.status(200).json(payload);
	});
});

// for getting the saved events of the user
router.get('/events',function(req,res) {
	User.findById(req.user._id)
		.populate('event').exec(function(err, acc) {
			if(err) {
				console.log(err);
				return res.status(400).send('Invalid user.');
			}
			return res.status(200).json(acc.event);
		});
});


// to add new event
router.post('/events/add',function(req, res) {
	User.findById(req.user._id, function(err, acc) {
		if(err) {
			console.log(err);
			return res.status(400).send('Invalid user.');
		}
		if (acc) {
			var event = new Event(req.body.event);
			event.save(function(err) {
				if (err) {console.log(err);}
				acc.event.addToSet(event._id);
				acc.save(function(err) {
					console.log(err);
					return res.status(200).send();
				});
			});	
		} else {
			console.log("User not found : " + req.user._id);
		}
	});
});

// to delete event
router.delete('/events/delete/:eventId', function(req,res) {
	Event.findByIdAndRemove( req.params.eventId, function(err, event) {
		if (err) {
			console.log(err);
			return res.status(400).send()
		}
		console.log("Deleted event :- " + event);
	});
	res.status(200).send();
});

// to update event
router.put('/events/update/:eventId', function(req,res) {
	updatedEvent = new Event(req.body.updatedEvent);
	// console.log(updatedEvent);
	Event.update({_id: req.params.eventId},
		{$set: {
			title: updatedEvent.title,
			venue: updatedEvent.venue,
			color: updatedEvent.color,
			startsAt: updatedEvent.startsAt,
			endsAt: updatedEvent.endsAt,
			description: updatedEvent.description
		}}, function(err) {
			if(err) {
				console.log(err);
				return res.status(500).send()
			} else {
				return res.status(200).send();
			}
		});
});

module.exports = router;