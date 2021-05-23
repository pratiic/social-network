const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
	{
		_id: String,
		users: [
			{
				type: mongoose.ObjectId,
				ref: "User",
			},
		],
		notSeenBy: [
			{
				type: mongoose.ObjectId,
			},
		],
		newMessages: {
			type: Boolean,
			default: false,
		},
		lastMessage: {
			type: String,
			default: "",
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("Chat", chatSchema);
