var mongoose = require('mongoose');
var deepPopulate = require('mongoose-deep-populate')(mongoose);
var Schema = mongoose.Schema;

var chatRoomSchema = new Schema({
	name: {type: String},
	room_id: {type: String},
	is_private: {type: Boolean},
	members: [
			{
				user: {type: Schema.Types.ObjectId, ref: 'User'},
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

chatRoomSchema.plugin(deepPopulate);

module.exports = mongoose.model('Chatroom', chatRoomSchema);
