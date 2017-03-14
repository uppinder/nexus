var mongoose = require('mongoose');
// var deepPopulate = require('mongoose-deep-populate')(mongoose);
var Schema = mongoose.Schema;

var eventSchema = new Schema({
	title: {type: String},
	venue: {type: String},
	color: {
		primary: {type: String},
		secondary: {type: String}
	},
	startsAt: {type: Date, default: Date.now},
	endsAt: {type: Date, default: Date.now},
	description: {type: String},
	draggable: {type: Boolean, default: true},
	resizable: {type: Boolean, default: true}
});

// eventSchema.plugin(deepPopulate);

module.exports = mongoose.model('event', eventSchema);
