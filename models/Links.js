var mongoose = require('mongoose');

var linksSchema = new mongoose.Schema({
	name: String,
	link: String,
	parent: String
});
module.exports = mongoose.model('Links', linksSchema);
