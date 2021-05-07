const express = require("express");
const { validateUserProfile } = require("../validation/profile-validation");
const Profile = require("../models/Profile");
const { auth } = require("../middleware/auth");

const router = express.Router();

//create a profile
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
		user: request.user,
	});

	try {
		const savedProfile = await profile.save();
		response.status(201).send(savedProfile);
	} catch (error) {
		response.status(500).send(error);
	}
});

//get a profile
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

//edit a profile
router.put("/", auth, async (request, response) => {
	try {
		await Profile.findOneAndUpdate(
			{ user: request.user },
			{ ...request.body }
		);
		response.send({ message: "updated" });
	} catch (error) {
		response.status(500).send(error);
	}
});

module.exports = router;
