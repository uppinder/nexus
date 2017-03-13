var mongoose = require('mongoose');
var deepPopulate = require('mongoose-deep-populate')(mongoose);
var Schema = mongoose.Schema;

var complaintsschema = new Schema({
    body:{type:String},
    user:{type:Schema.Types.ObjectId, ref: 'User'},
    isanonymous:{type:Boolean},
    file: {type: String, default: null}
});

module.exports = mongoose.model('Complaint', complaintsschema);
