const express = require("express");
const User = require("../models/User");
const Profile = require("../models/Profile");
const { auth } = require("../middleware/auth");
const Post = require("../models/Post");
const Notification = require("../models/Notification");

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
		const notification = new Notification({
			from: request.user,
			to: request.params.userID,
			action: "send",
			type: "user",
		});

		await Promise.all([userProfile.save(), notification.save()]);
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
		return response.status(400).send({ error: "user does not exist" });
	}

	profile.friends.push(request.params.userID);

	const addedUser = profile.friendRequests.find((friendRequest) => {
		return friendRequest == request.params.userID;
	});

	profile.friendRequests.remove(addedUser);

	userProfile.friends.push(request.user);

	try {
		const notification = new Notification({
			from: request.user,
			to: request.params.userID,
			action: "accept",
			type: "user",
		});

		await Promise.all([
			profile.save(),
			userProfile.save(),
			Post.updateMany(
				{ user: request.user },
				{ $push: { for: request.params.userID } }
			),
			Post.updateMany(
				{ user: request.params.userID },
				{ $push: { for: request.user } }
			),
			notification.save(),
		]);
		// await profile.save();
		// await userProfile.save();
		// await Post.updateMany(
		// 	{ user: request.user },
		// 	{ $push: { for: request.params.userID } }
		// );
		// await Post.updateMany(
		// 	{ user: request.params.userID },
		// 	{ $push: { for: request.user } }
		// );
		response.status(200).send({ message: "added to friends" });
	} catch (error) {
		response.status(500).send(error);
	}
});

//reject friend request
router.post("/reject/:userID", auth, async (request, response) => {
	const profile = await Profile.findOne({ user: request.user });

	profile.friendRequests.pull(request.params.userID);

	try {
		await profile.save();
		response.send({ message: "friend request rejected" });
	} catch (error) {
		response.status(500).send(error);
	}
});

//remove a friend
router.delete("/:userID", auth, async (request, response) => {
	const [profile, friendProfile] = await Promise.all([
		Profile.findOne({ user: request.user }),
		Profile.findOne({ user: request.params.userID }),
	]);

	if (!friendProfile) {
		return response.status(400).send({ error: "user does not exist" });
	}

	profile.friends.pull(request.params.userID);

	friendProfile.friends.pull(request.user);

	try {
		await Promise.all([profile.save(), friendProfile.save()]);
		response.send({ message: "removed from friends" });
	} catch (error) {
		response.status(500).send(error);
	}
});

module.exports = router;
