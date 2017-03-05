var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var chatRoomSchema = new Schema({
	name: {type: String},
	members: [
			{
				user: {type: Schema.Types.ObjectId, ref: 'User', unique: true},
				role: {type: String, default: 'member'}
			}
		],
	messages: [
			{
				text: {type: String},
				meta: {
					sender: {type: Schema.Types.ObjectId, ref: 'User'},
					sent_time: {type: Date}
				}
			}
		] 
});

module.exports = mongoose.model('chatRoom', chatRoomSchema);
