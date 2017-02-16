var mongoose = require('mongoose');
var userSchema = mongoose.Schema;

var tempUser = new userSchema({
	username: {type: String, unique: true},
	token: {type: String}
});

module.exports = mongoose.model('tempUser', tempUser);
