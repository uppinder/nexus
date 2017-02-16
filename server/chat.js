var User = require('./models/user.js');

var users_online = {};
var messages = [];

exports.initUser = function(socket, user) {
	User.findById(user._id, function(err, acc) {
		if(!err && acc) {
			me = {
				name: acc.name,
				pic: acc.profilePic	
			};
			
		socket.emit('init', {
			me: me,
			users_online: users_online,
			messages: messages
		});	

		users_online[user._id] = me;
		
		// console.log(users_online);
		// console.log(messages);

		socket.broadcast.emit('new_user', {
			user: user,
			users_online: users_online
		});

		}
	});	
};

exports.sendMessage = function(io, user, msg) {
	message = {
			user: user,
			body: msg.body,
			date: Date.now()
	};
	messages.push(message);

	io.sockets.emit('message', message);
};

exports.leave = function(socket, user) {
	delete users_online[user._id];
	socket.broadcast.emit('leave', {
		user: user,
		users_online: users_online
	});
};

