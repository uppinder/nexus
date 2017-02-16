var mongoose = require('mongoose');
var userSchema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var User = new userSchema({
	username: {type: String},
	name: {
		firstname: {type: String},
		lastname: {type: String}
	},
	gender: {type: String},
	profilePic: {type: String, default: 'SkqEWypDx.jpg'},
	verified: {type: Boolean, default: false}
});

User.plugin(passportLocalMongoose, {
	selectFields : 'username verified'
});

module.exports = mongoose.model('User', User);
