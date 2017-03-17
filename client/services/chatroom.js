angular.module('nexus')
	.factory('chatroom', function(chatSocket, $rootScope) {
		
		var me = {};
		var friends = {};
		var rooms = {};
		// var users_online = {};

		chatSocket.on('init', function(data) {
			// console.log(data);
			me = data.me;
			console.log(me);
			_.forEach(data.rooms, function(room) {
				if(room.is_private)
					friends[room.room_id] = room;
				else 
					rooms[room.room_id] = room;
			});

			// friends = _.keyBy(data.friends, o => o.username);
			// rooms = _.keyBy(data.rooms, o => o.room_id);
			// console.log(friends);
			// console.log(rooms);

			chatSocket.forward('update');
		});

		chatSocket.on('new_room', function(room) {
			console.log(room);
			rooms[room.room_id] = room;
			console.log(rooms);
			chatSocket.forward('update');
		});

		chatSocket.on('new_members', function(people, roomId) {
			console.log(people);
			rooms[roomId].members = rooms[roomId].members.concat(people);
			chatSocket.forward('update');
		});

		chatSocket.on('added_to_room', function(newRoom) {
			console.log(newRoom);
			chatSocket.emit('join_room', newRoom.room_id);
			rooms[newRoom.room_id] = newRoom;
			console.log(rooms);
			chatSocket.forward('update');
		});

		chatSocket.on('message', function(msg, roomId) {
			// console.log(msg,roomId);
			if(rooms[roomId])
				rooms[roomId].messages.push(msg);
			else
				friends[roomId].messages.push(msg);
			// console.log(rooms[roomId].messages);
			chatSocket.forward('update');
		});

		// chatSocket.on('leave', function(data) {
		// 	messages.push({
		// 		user: {
		// 			username: 'Server'
		// 		},
		// 		body: data.user.username + ' has left.',
		// 		date: Date.now()
		// 	});
		// 	users_online = data.users_online;
		// 	console.log(users_online);
		// 	chatSocket.forward('update');
		// });

		return {
			getMe: function() {
				return me;
			},
			getFriends: function() {
				return friends;
			},
			getPrivateMessages: function(roomId) {
				return friends[roomId] ? friends[roomId].messages : [];
			},
			getRooms: function() {
				return rooms;
			},
			getPrivateRoomName: function(roomId) {
				return friends[roomId] ? friends[roomId].name : "";
			},
			createRoom: function(name) {
				chatSocket.emit('create_room', {
					name: name,
					is_private: false
				});
			},
			getMessages: function(roomId) {
				// console.log(rooms[roomId]);
				// console.log([] || rooms[roomId].messages);
				return rooms[roomId] ? rooms[roomId].messages: [];
			},
			getMembers: function (roomId) {
				return rooms[roomId] ? rooms[roomId].members: [];
			},
			sendMessage: function(msg, roomId, is_private) {
				// console.log(rooms[roomId]);
				var room = {};
				if(is_private)
					room = {
						id: friends[roomId]._id,
						roomId: roomId
					};
				else
					room = {
						id: rooms[roomId]._id,
						roomId: roomId
					};

				chatSocket.emit('message', {
					body: msg,
					room: room 
				});
			},
			addFriends: function(users,roomId) {
				chatSocket.emit('new_users', {
					users: users,
					room: {
						id: rooms[roomId]._id,
						roomId: roomId
					}
				});
			}
		};
	}
);