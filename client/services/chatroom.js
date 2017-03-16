angular.module('nexus')
	.factory('chatroom', function(chatSocket, $rootScope) {
		
		var rooms = {};
		var users = {};
		// var users_online = {};

		chatSocket.on('init', function(data) {
			// console.log(data);
			$rootScope.currentUser = data.me;
			rooms = _.keyBy(data.rooms, o => o.room_id);
			// console.log(rooms);
			chatSocket.forward('update');
		});

		chatSocket.on('new_room', function(room) {
			console.log(room);
			rooms[room.room_id] = room;
			// console.log(rooms);
			chatSocket.forward('update');
		});

		// chatSocket.on('new_user', function(data) {
		// 	messages.push({
		// 		user: {
		// 			name: {username: 'Server'}
		// 		},
		// 		body: data.user.username + ' has joined.',
		// 		date: Date.now()
		// 	});
		// 	users_online = data.users_online;
		// 	console.log(users_online);
		// 	chatSocket.forward('update');
		// });

		chatSocket.on('message', function(msg, roomId) {
			// console.log(msg,roomId);
			rooms[roomId].messages.push(msg);
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
			getRooms: function() {
				return rooms;
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
			sendMessage: function(msg, roomId) {
				// console.log(rooms[roomId]);
				chatSocket.emit('message', {
					body: msg,
					room: {
						id: rooms[roomId]._id,
						roomId: roomId
					} 
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