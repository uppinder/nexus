// dependencies
var express = require('express');
var peer = require('peer');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var bluebird = require('bluebird');
var logger = require('morgan');
var path = require('path');
var passport = require('passport'); // for user authentication
var localStrategy = require('passport-local').Strategy; // for passport-local authentication system

//Import configuration settings
var config = require('./config.js');

//Connect to MongoDB
mongoose.Promise = bluebird;
mongoose.connect(config.dbURL);

mongoose.connection.on('connected', function(){
	console.log('Connected to MongoDB.');
});

// Users model/schema
var User = require('./models/user.js');
// events model schema 
// var Event = require('./models/event.js')

//routes
var authRoutes = require('./routes/auth.js');
var dataRoutes = require('./routes/userdata.js');
var uploadRoutes = require('./routes/upload.js');
var searchRoutes = require('./routes/search.js');
var downloadRoutes = require('./routes/download.js');

var app = express();

// middleware
app.use(express.static(path.join(__dirname, '../client'))); // to use the app named 'CLIENT' and sendFile of that app
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// express session (for session,cookies)
app.use(require('express-session')(config.express_session));

app.use(passport.initialize());
app.use(passport.session());

// configure passport
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

var server = require('https').createServer(config.ssl, app);
var	io     = require('socket.io')(server);
var ExpressPeerServer = require('peer').ExpressPeerServer;

//Socket.io Configuration
require('./socket.js')(io, passport, cookieParser, config.express_session);

// routes
app.use('/peerjs', ExpressPeerServer(server, { debug: true}));
app.use('/auth', authRoutes);
app.use('/user_data', dataRoutes);
app.use('/upload', uploadRoutes);
app.use('/search', searchRoutes);
app.use('/d', downloadRoutes);

app.get('*', function(req, res) {
	// console.log(req);
	res.sendFile(path.join(__dirname, '../client', 'index.html'));
});

app.use(function(err, req, res, next) {
	res.status(err.status || 500);
});

module.exports = server;