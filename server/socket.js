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
		console.log(io.engine.clientsCount);
		
		chatCtrl.initUser(socket, user);

		socket.on('message', function(msg) {
			chatCtrl.sendMessage(io, user , msg);
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