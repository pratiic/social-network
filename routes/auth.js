const express = require("express");
const {
	validateUserRegistration,
	validateUserLogin,
} = require("../validation/user-validation");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { auth } = require("../middleware/auth");
const Post = require("../models/Post");
const Profile = require("../models/Profile");
const gravatar = require("gravatar");
const { getUpload } = require("../middleware/multer");

const router = express.Router();

//register
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

	const imageURL = gravatar.url(request.body.email, {
		protocol: "https",
		s: "400",
		d: "retro",
	});

	const user = new User({
		...request.body,
		password: hash,
		profilePictureURL: imageURL,
	});

	try {
		const savedUser = await user.save();
		response.status(201).send(savedUser);
	} catch (error) {
		response.status(500).send(error);
	}
});

//login
router.post("/login", async (request, response) => {
	const error = validateUserLogin(request.body);

	if (error) {
		return response.status(400).send({ message: error });
	}

	const user = await User.findOne({ email: request.body.email });

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

	response.send({
		_id: user._id,
		username: user.username,
		email: user.email,
		password: user.password,
		token,
		profilePictureURL: user.profilePictureURL,
		profilePicture: user.profilePicture,
	});
});

//delete a user
router.delete("/delete", auth, async (request, response) => {
	try {
		await User.findByIdAndDelete(request.user);
		await Post.deleteMany({ user: request.user });
		await Profile.deleteMany({ user: request.user });
		response.send({ message: "deleted" });
	} catch (error) {
		response.status(500).send(error);
	}
});

//get a user
router.get("/:userID", auth, async (request, response) => {
	const user = await User.findById(request.params.userID);

	if (!user) {
		return response.status(400).send({ error: "user not found" });
	}

	response.send(user);
});

//get all users
router.get("/", auth, async (request, response) => {
	const users = await User.find({}).sort({ createdAt: -1 });

	if (users.length === 0) {
		return response.status(400).send({ error: "users not found" });
	}

	try {
		response.send(users);
	} catch (error) {
		response.status(500).send(error);
	}
});

//add a profile picture
const upload = getUpload(1);

router.post(
	"/profile-picture",
	auth,
	upload.single("profilePicture"),
	async (request, response) => {
		const user = await User.findById(request.user);

		if (!user) {
			return response.status(400).send({ error: "user does not exist" });
		}

		try {
			const updatedUser = await User.findByIdAndUpdate(request.user, {
				profilePicture: request.file.buffer,
			});
			response.send({ message: "profile picture added" });
		} catch (error) {
			response.status(500).send({ error: error.message });
		}
	},
	(error, request, response, next) => {
		response.send({ error: error.message });
	}
);

//get profile picture
router.get("/profile-picture/:userID", async (request, response) => {
	const user = await User.findById(request.params.userID);

	if (!user) {
		return response.status(400).send({ error: "user not found" });
	}

	response.set("Content-Type", "image/jpg");

	try {
		response.send(user.profilePicture);
	} catch (error) {
		response.send(error);
	}
});

//search for users
router.get("/search/:searchValue", async (request, response) => {
	const searchValue = request.params.searchValue;

	const users = await User.find({
		$or: [
			// {
			// 	username: {
			// 		$regex: /searchValue/,
			// 		$options: "i",
			// 	},
			// },
			// { email: { $regex: /searchValue/, $options: "i" } },
			{
				username: searchValue,
			},
			{
				email: searchValue,
			},
		],
	});

	if (users.length === 0) {
		return response.status(400).send({ error: "users not found" });
	}

	try {
		response.send(users);
	} catch (error) {
		response.status(500).send(error);
	}
});

module.exports = router;
