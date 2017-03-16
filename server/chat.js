var User = require('./models/user.js');
var Chatroom = require('./models/chatroom.js');
var shortid = require('shortid');
var _ = require('lodash');

// var rooms = {};

exports.initUser = function(socket, user) {

	User.findById(user._id).
	populate({
		path: 'chatRooms',
		populate: {path: 'messages.meta.sender members.user '}
	})
	.exec(function(err, self) {
		if(!err && self) {
			me = {
				name: self.name,
				pic: self.profilePic
			};

			// console.log(self.chatRooms[0].messages);

			self.chatRooms.forEach(function(room) {
				socket.join(room.room_id);
			});

			// console.log(self.chatRooms[0].messages);
			// console.log(self.chatRooms[0].members);
			socket.emit('init', {
				me: me,
				rooms: self.chatRooms
			});
		} 
	});	
};

exports.createRoom = function(socket, user, name, is_private) {
	var room = new Chatroom({
		name: name,
		room_id: shortid.generate(),
		is_private: is_private,
		members: [],
		messages: []
	});

	room.members.addToSet({
		user: { _id : user._id } ,
		role: 'admin'
	});

	console.log(room);
	room.save(function(err) {
		if(!err) {
			// console.log(room);
			socket.join(room.room_id);	
			socket.emit('new_room', room);
		}
	});

	User.findById(user._id, function(err, self) {
		if(!err && self) {
			self.chatRooms.addToSet(room._id);
			self.save();
		}
	});
}

exports.sendMessage = function(io, user, msg, room) {

	// console.log(user, msg, room);
	
	var message = {
		text: msg,
		meta: {
			sender: { _id: user._id},
			sent_time: Date.now()
		}
	}

	Chatroom.findById(room.id, function(err, Room) {
		if(!err && Room) {
			Room.messages.push(message);
			Room.save();
		}
	});

	console.log(message);

	io.sockets.in(room.roomId).emit('message', message, room.roomId);
};

exports.addUsers = function(io, users, room) {
	console.log(users, room);
	Chatroom.findById(room.id, function(err, room) {
		if(!err && room) {
			_.forEach(users, function(user, id) {
				User.findById(user._id, function(err,user) {
					user.chatRooms.addToSet({_id: room._id});
						user.save();
				});
				room.members.addToSet({
					role: 'member',
					user: { _id: user._id } 
				});
			});
			room.save();
		}
	});
}

exports.leave = function(socket, user) {
	// delete users_online[user._id];
	socket.broadcast.emit('leave', {
		user: user,
		// users_online: users_online
	});
};

