const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
	address: String,
	description: String,
	dateOfBirth: Date,
	job: String,
	relationshipStatus: {
		type: String,
		default: "",
	},
	hobbies: {
		type: String,
		default: "",
	},
	likes: {
		type: String,
		default: "",
	},
	dislikes: {
		type: String,
		default: "",
	},
	education: {
		type: String,
		default: "",
	},
	user: {
		type: mongoose.ObjectId,
		ref: "User",
	},
	friendRequests: [
		{
			type: mongoose.ObjectId,
		},
	],
	friends: [
		{
			type: mongoose.ObjectId,
		},
	],
});

module.exports = mongoose.model("Profile", profileSchema);
