const mongoose = require("mongoose");

const Username = new mongoose.Schema({
	username: {
		type: String,
		required: true,
		unique: true,
	},
	mailadress: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
	},
	selectedChats: {
		type: Array,
		required: true,
	},
	isAdmin: {
		type: Boolean,
		default: false,
	},
});

module.exports = mongoose.model("Username", Username);
