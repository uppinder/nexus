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
				room.istyping = {};
				if(room.is_private) 
					friends[room.room_id] = room;
				else 
					rooms[room.room_id] = room;
			});

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
			console.log(me.pic);
			if(me.name != msg.meta.sender.username){
				console.log('notification');
				if(window.Notification && Notification.permission !== "denied") {
					Notification.requestPermission(function(status) {  // status is "granted", if accepted by user
						var n = new Notification('Message from '+msg.meta.sender.name.firstname, { 
							body: msg.text,
							icon: me.profilePic // optional
						}); 
					});

				}
			}
			if(rooms[roomId]){
				rooms[roomId].messages.push(msg);
			}
			else{
				friends[roomId].messages.push(msg);
			}
			// console.log(rooms[roomId].messages);
			chatSocket.forward('update');
		});

		chatSocket.on('user_typing', function(user, roomId) {
			console.log(rooms, user, roomId);
			if(rooms[roomId])
				rooms[roomId].istyping[user._id] = user;
			else
				friends[roomId].istyping[user._id] = user;
			chatSocket.forward('update');
		});

		chatSocket.on('user_stop_typing', function(user, roomId) {
			if(rooms[roomId])
				delete rooms[roomId].istyping[user._id];
			else
				delete friends[roomId].istyping[user._id];
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
			getPrivateIsTyping: function(roomId) {
				return friends[roomId] ? friends[roomId].istyping : {};
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
			getIsTyping: function(roomId) {
				return rooms[roomId] ? rooms[roomId].istyping: {};
			},
			getMembers: function (roomId) {
				return rooms[roomId] ? rooms[roomId].members: [];
			},
			isTyping: function(roomId, is_private) {
				var room = {
					id: is_private? friends[roomId]._id: rooms[roomId]._id,
					roomId: roomId
				};

				chatSocket.emit('is_typing', room);
			},
			stopTyping: function(roomId, is_private) {
				var room = {
					id: is_private? friends[roomId]._id: rooms[roomId]._id,
					roomId: roomId
				};

				chatSocket.emit('stop_typing', room);
			},
			sendMessage: function(msg, roomId, is_private) {
				// console.log(rooms[roomId]);
				var room = {
					id: is_private? friends[roomId]._id: rooms[roomId]._id,
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
			},
			sendFriendRequest: function(user){
				chatSocket.emit('send_friend_request',user);
			}
		};
	}
);