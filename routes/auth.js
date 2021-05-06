const express = require("express");
const {
	validateUserRegistration,
	validateUserLogin,
} = require("../validation/user-validation");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const router = express.Router();

router.post("/register", async (request, response) => {
	const error = validateUserRegistration(request.body);

	if (error) {
		return response.status(400).send({ message: error });
	}

	const userExists = await User.findOne({ email: request.body.email });

	if (userExists) {
		return response.status(400).send({ message: "user already exists" });
	}

	const salt = await bcrypt.genSalt(10);
	const hash = await bcrypt.hash(request.body.password, salt);

	const user = new User({
		...request.body,
		password: hash,
	});

	try {
		const savedUser = await user.save();
		response.status(201).send(savedUser);
	} catch (error) {
		response.status(500).send(error);
	}
});

router.post("/login", async (request, response) => {
	const error = validateUserLogin(request.body);

	if (error) {
		return response.status(400).send({ message: error });
	}

	const user = await User.findOne({ email: request.body.email });
	console.log(user);

	if (!user) {
		return response
			.status(400)
			.send({ message: "email or password is incorrect" });
	}

	const validPassword = await bcrypt.compare(
		request.body.password,
		user.password
	);

	if (!validPassword) {
		return response
			.status(400)
			.send({ message: "email or password is incorrect" });
	}

	const token = jwt.sign({ id: user._id }, process.env.SECRET);

	console.log(user);
	response.send({
		_id: user._id,
		username: user.username,
		email: user.email,
		password: user.password,
		token,
	});
});

module.exports = router;
