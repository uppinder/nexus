var mongoose = require('mongoose');
var deepPopulate = require('mongoose-deep-populate')(mongoose);
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
	friends: [{type: Schema.Types.ObjectId, ref: 'User'}],
	chatRooms: [{type:Schema.Types.ObjectId, ref: 'Chatroom'}],
    groups: [{type:Schema.Types.ObjectId, ref: 'group'}]
});

userSchema.plugin(passportLocalMongoose, {
	selectFields : 'username verified'
});

userSchema.plugin(deepPopulate);

module.exports = mongoose.model('User', userSchema);
