var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var userSchema = new Schema({
	username: {type: String},
	name: {
		firstname: {type: String},
		lastname: {type: String}
	},
	gender: {type: String},
	profilePic: {type: String, default: 'SkqEWypDx.jpg'},
	verified: {type: Boolean, default: false},
	friends: [{type: Schema.Types.ObjectId, ref: 'User', unique: true}],
	chatRooms: [{type:Schema.Types.ObjectId, ref: 'chatRoom'}]
});

userSchema.plugin(passportLocalMongoose, {
	selectFields : 'username verified'
});

module.exports = mongoose.model('User', userSchema);
