const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
	username: String,
	email: String,
	password: String,
	profile: {
		type: mongoose.ObjectId,
		ref: "Profile",
	},
});

module.exports = mongoose.model("User", userSchema);
