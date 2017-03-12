/**
 * Created by shivram on 11/3/17.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var groupSchema = new Schema({
    name: {type: String}, 
    description: {type: String},
    members: [
        {
            user: {type: Schema.Types.ObjectId, ref: 'User'},
            role: {type: String, default: 'member'}
        }
    ],
    posts: [
        {
            text: {type: String},
            meta: {
                poster: {type: Schema.Types.ObjectId, ref: 'User'},
                post_time: {type: Date}
            }
        }
    ]
});

module.exports = mongoose.model('group', groupSchema);