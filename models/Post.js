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
		},
		comments: [
			{
				type: mongoose.ObjectId,
				ref: "Comment",
			},
		],
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
