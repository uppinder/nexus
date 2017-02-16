var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var bluebird = require('bluebird');
var logger = require('morgan');
var path = require('path');
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;

//Import configuration settings
var config = require('./config.js');

//Connect to MongoDB
mongoose.Promise = bluebird;
mongoose.connect(config.dbURL);

mongoose.connection.on('connected', function(){
	console.log('Connected to MongoDB.');
});

//user schema
var User = require('./models/user.js');

//routes
var authRoutes = require('./routes/auth.js');
var dataRoutes = require('./routes/userdata.js');
var uploadRoutes = require('./routes/upload.js');

var app = express();

//middleware
app.use(express.static(path.join(__dirname, '../client')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

//express session (for session,cookies)
app.use(require('express-session')(config.express_session));

app.use(passport.initialize());
app.use(passport.session());

// configure passport
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

var server = require('http').createServer(app);
var	io     = require('socket.io')(server);

//Socket.io Configuration
require('./socket.js')(io, passport, cookieParser, config.express_session);

// routes
app.use('/auth', authRoutes);
app.use('/user', dataRoutes);
app.use('/upload', uploadRoutes);

app.get('*', function(req, res) {
	// console.log(req);
	res.sendFile(path.join(__dirname, '../client', 'index.html'));
});

app.use(function(err, req, res, next) {
	res.status(err.status || 500);
});

module.exports = server;