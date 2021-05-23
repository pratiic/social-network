const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
	{
		to: mongoose.ObjectId,
		from: {
			type: mongoose.ObjectId,
			ref: "User",
		},
		action: String,
		postID: mongoose.ObjectId,
		type: String,
		seen: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
