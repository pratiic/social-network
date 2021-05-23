const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
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
		comments: [
			{
				type: mongoose.ObjectId,
				ref: "Comment",
			},
		],
		for: [
			{
				type: mongoose.ObjectId,
			},
		],
		image: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
