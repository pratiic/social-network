const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
	address: String,
	hobbies: Array,
	description: String,
	dateOfBirth: Date,
	createdAt: {
		type: Date,
		default: Date.now,
	},
	job: String,
	relationshipStatus: String,
	likes: Array,
	dislikes: Array,
	education: String,
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
