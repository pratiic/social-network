const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
	{
		text: String,
		user: {
			type: mongoose.ObjectId,
			ref: "User",
		},
		seen: {
			type: Boolean,
			default: false,
		},
		chat: {
			type: String,
			ref: "Chat",
		},
		to: mongoose.ObjectId,
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("Message", messageSchema);
