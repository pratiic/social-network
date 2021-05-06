const express = require("express");
const { validateUserProfile } = require("../validation/profile-validation");
const Profile = require("../models/Profile");
const { auth } = require("../middleware/auth");

const router = express.Router();

router.post("/", auth, async (request, response) => {
	const error = validateUserProfile(request.body);

	if (error) {
		return response.status(400).send({ message: error });
	}

	const profileExists = await Profile.findOne({ user: request.user });

	if (profileExists) {
		return response.status(400).send({ message: "profile already exists" });
	}

	const profile = new Profile({
		...request.body,
	});

	try {
		const savedProfile = await profile.save();
		response.status(201).send(savedProfile);
	} catch (error) {
		response.status(500).send(error);
	}
});

router.get("/:id", async (request, response) => {
	try {
		const profile = await Profile.findOne({
			user: request.params.id,
		}).populate("user");
		response.send(profile);
	} catch (error) {
		response.status(500).send(error);
	}
});

module.exports = router;
