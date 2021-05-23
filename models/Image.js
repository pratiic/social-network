const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
	data: {
		type: Buffer,
	},
	user: mongoose.ObjectId,
	post: mongoose.ObjectId,
});

module.exports = mongoose.model("Image", imageSchema);
