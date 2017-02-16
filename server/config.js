var mongoStore = require('connect-mongo')(require('express-session'));

mongoDB_URL = 'mongodb://localhost/nexus';

module.exports = {
	dbURL: mongoDB_URL,
	express_session: {
		name: 'nexus.sid',
		secret: 'nexuswebapp',
		resave: false,
		saveUninitialized: false,
		store: new mongoStore({
			url: mongoDB_URL // Collection name defaults to 'sessions'.
		})
	}
}