var passportSocketIo = require('passport.socketio');
var User = require('./models/user.js');
var chatCtrl = require('./chat.js');

module.exports = function(io, passport, cookieParser, expressConfig) {
	io.use(passportSocketIo.authorize({
		passport: passport,
		cookieParser: cookieParser,
		key: expressConfig.name,
		secret: expressConfig.secret,
		store: expressConfig.store,
		success: onAuthorizeSuccess,
		fail: onAuthorizeFail
	}));

	io.on('connection', function(socket) {

		var user = socket.request.user;
		// console.log(socket.adapter);
		// console.log(user);
		// console.log(socket.rooms);
		
		chatCtrl.initUser(socket, user);

		socket.on('message', function(data) {
			chatCtrl.sendMessage(io, user , data.body, data.room);
		});

		socket.on('is_typing', function(room) {
			chatCtrl.isTyping(socket, user, room);
		});

		socket.on('stop_typing', function(room) {
			chatCtrl.stopTyping(socket, user, room);
		});

		socket.on('create_room', function(room) {
			console.log(room);
			chatCtrl.createRoom(socket, user, room.name, room.is_private);
		});

		socket.on('join_room', function(roomId) {
			chatCtrl.joinRoom(socket, roomId);
		});

		socket.on('new_users', function(data) {
			chatCtrl.addUsers(io, data.users, data.room);
		});

		socket.on('disconnect', function() {
			chatCtrl.leave(socket, user);
		});
	});
}

function onAuthorizeSuccess(data, accept) {
	accept(null, true);
}

function onAuthorizeFail(data, msg, err, accept) {
	accept(null, false);
}