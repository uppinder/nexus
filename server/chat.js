var User = require('./models/user.js');
var Chatroom = require('./models/chatroom.js');
var shortid = require('shortid');
var _ = require('lodash');

var sockets = {};

exports.initUser = function(socket, user) {

	User.findById(user._id).
	populate({
		path: 'chatRooms',
		populate: {path: 'messages.meta.sender members.user'}
	})
	.exec(function(err, self) {
		if(!err && self) {
			me = {
				name: self.username,
				pic: self.profilePic
			};

			// console.log(self.chatRooms);

			self.chatRooms.forEach(function(room) {
				socket.join(room.room_id);
			});
      
			socket.emit('init', {
				me: me,	
				rooms: self.chatRooms
			});

			sockets[user._id] = socket.id;
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

	User.findById(user._id, function(err, self) {
		if(!err && self) {
			room.members.addToSet({
				user: self,
				role: 'admin'
			});
			
			socket.join(room.room_id);
			socket.emit('new_room', room);

			room.save();
		
			self.chatRooms.addToSet(room._id);
			self.save();
		}
	});
}

exports.sendMessage = function(io, user, msg, room) {

	// console.log(user, msg, room);
	User.findById(user._id, function(err, self) {
		if(!err && self) {

			var message = {
				text: msg,
				meta: {
					sender: self,
					sent_time: Date.now()
				}
			}

			Chatroom.findById(room.id, function(err, Room) {
				if(!err && Room) {
					// console.log(Room);
					Room.messages.push(message);
					Room.save();
				}
			});

			console.log(message);

			io.sockets.in(room.roomId).emit('message', message, room.roomId);
		}
	});	
};

exports.isTyping = function(socket, user, room) {
	User.findById(user._id, function(err, self) {
		socket.in(room.roomId).emit('user_typing', self, room.roomId);
	});
}

exports.stopTyping = function(socket, user, room) {
	User.findById(user._id, function(err, self) {
		socket.in(room.roomId).emit('user_stop_typing', self, room.roomId);	
	});
}

exports.addUsers = function(io, users, chatroom) {
	console.log(users, chatroom);
	Chatroom.findById(chatroom.id, function(err, room) {
		if(!err && room) {
			var people = [];
			_.forEach(users, function(user, id) {
				// Add user in room
				// Add room to user document
				User.findById(user._id, function (err, self) {
					console.log(err,self);
					if(!err && self) {

						room.members.addToSet({
							role: 'member',
							user: {_id: self._id}
						});

						people.push({
							user: self,
							role: 'member'
						});

						self.chatRooms.addToSet({_id:room._id});
						self.save();
					}
				});
			});
			// After adding user to chat room
			// Emit socket event to all users that
			// were already in room, and then
			// emit to newly joined users about group
			room.save(function(err) {
				if(!err) {

					Chatroom.findById(room._id).
					populate({
						path: 'members.user messages.meta.sender'
					}).
					exec(function(err, Room) {
						if(!err) {
							io.in(room.room_id).emit('new_members',people,room.room_id);

							// Emit to all users in people
							_.forEach(people, function(p) {
								io.to(sockets[p.user._id]).emit('added_to_room', Room);
								// io.join(sockets[p.user._id], room.room_id);
							});
						}
					});

				}
			});
		}
	});
}

exports.joinRoom = function(socket, roomId) {
	socket.join(roomId);
};

exports.leave = function(socket, user) {
	delete sockets[user._id];
	// socket.broadcast.emit('leave', {
	// 	user: user,
	// 	// users_online: users_online
	// });
};

