const express = require("express");
const User = require("../models/User");
const Profile = require("../models/Profile");
const { auth } = require("../middleware/auth");

const router = express.Router();

//send friend request
router.post("/requests/:userID", auth, async (request, response) => {
	const userProfile = await Profile.findOne({ user: request.params.userID });

	if (!userProfile) {
		return response.status(400).send({ message: "user does not exist" });
	}

	const alreadyFriend = userProfile.friends.find((friend) => {
		return friend == request.user;
	});

	if (alreadyFriend) {
		return response.status(400).send({ message: "already friends" });
	}

	userProfile.friendRequests.push(request.user);

	try {
		await userProfile.save();
		response.status(201).send({ message: "friend request sent" });
	} catch (error) {
		response.status(500).send(error);
	}
});

//add to friends
router.post("/:userID", auth, async (request, response) => {
	const profile = await Profile.findOne({ user: request.user });

	const userProfile = await Profile.findOne({ user: request.params.userID });

	if (!userProfile) {
		return response.status(400).send({ message: "user does not exist" });
	}

	profile.friends.push(request.params.userID);

	console.log(profile.friendRequests);
	const addedUser = profile.friendRequests.find((friendRequest) => {
		return friendRequest == request.params.userID;
	});
	console.log(addedUser);

	profile.friendRequests.remove(addedUser);

	userProfile.friends.push(request.user);

	try {
		await profile.save();
		await userProfile.save();
		response.status(200).send({ message: "added to friends" });
	} catch (error) {
		response.status(500).send(error);
	}
});

module.exports = router;
