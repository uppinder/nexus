var mongoStore = require('connect-mongo')(require('express-session'));
var fs = require('fs');
var path = require('path');

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
	},
	ssl: {
		key: fs.readFileSync(path.join(__dirname, '../ssl.pem')),
		cert: fs.readFileSync(path.join(__dirname, '../ssl.crt'))
	}
}