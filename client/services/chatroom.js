angular.module('nexus')
	.factory('chatroom', function(chatSocket, $rootScope) {
		var users_online = {};
		var messages = [];

		chatSocket.on('init', function(data) {
			// console.log(data);
			$rootScope.currentUser = data.me;
			messages = data.messages;
			// console.log(messages);
			users_online = data.users_online;
			chatSocket.forward('update');
		});

		chatSocket.on('new_user', function(data) {
			messages.push({
				user: {
					name: {username: 'Server'}
				},
				body: data.user.username + ' has joined.',
				date: Date.now()
			});
			users_online = data.users_online;
			console.log(users_online);
			chatSocket.forward('update');
		});

		chatSocket.on('message', function(msg) {
			// console.log(msg);
			messages.push(msg);
			chatSocket.forward('update');
		});

		chatSocket.on('leave', function(data) {
			messages.push({
				user: {
					username: 'Server'
				},
				body: data.user.username + ' has left.',
				date: Date.now()
			});
			users_online = data.users_online;
			console.log(users_online);
			chatSocket.forward('update');
		});

		return {
			getMessages: function() {
				return messages;
			},
			sendMessage: function(msg) {
				chatSocket.emit('message', {
					body: msg
				});
			}
		};
	}
);