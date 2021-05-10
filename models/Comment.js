const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
	{
		description: String,
		likedBy: [
			{
				user: mongoose.ObjectId,
			},
		],
		dislikedBy: [
			{
				user: mongoose.ObjectId,
			},
		],
		user: {
			type: mongoose.ObjectId,
			ref: "User",
		},
		post: {
			type: mongoose.ObjectId,
		},
		replies: [
			{
				description: String,
				user: mongoose.ObjectId,
				createdAt: {
					type: Date,
					default: Date.now,
				},
			},
		],
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Comment", commentSchema);
