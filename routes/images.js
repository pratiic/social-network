const express = require("express");
const Image = require("../models/Image");
const { auth } = require("../middleware/auth");
const Post = require("../models/Post");
const User = require("../models/User");
const { getUpload } = require("../middleware/multer");

const router = express.Router();

// //create a post image
// const uploadOne = getUpload(2);

// router.post(
// 	"/post/:postID",
// 	auth,
// 	uploadOne.single("postImage"),
// 	async (request, response) => {
// 		const post = await Post.findById(request.params.postID);

// 		if (!post) {
// 			return response.status(400).send({ error: "post not found" });
// 		}

// 		try {
// 			const image = new Image({
// 				data: request.file.buffer,
// 				post: postID,
// 			});

// 			post.image = true;

// 			const [savedImage, updatedPost] = await Promise.all([
// 				image.save(),
// 				post.save(),
// 			]);
// 			response.send(savedImage);
// 		} catch (error) {
// 			response.status(500).send(error);
// 		}
// 	}
// );

//create a user image
const upload = getUpload(1);

router.post(
	"/user",
	auth,
	upload.single("profilePicture"),
	async (request, response) => {
		const [user, image] = await Promise.all([
			User.findById(request.user),
			Image.findOne({ user: request.user }),
		]);

		if (!user) {
			return response.status(400).send({ error: "user not found" });
		}

		user.profilePicture = true;

		try {
			if (image) {
				image.data = request.file.buffer;

				const [savedImage, updatedUser] = await Promise.all([
					image ? image.save() : newImage.save(),
					user.save(),
				]);

				return response.send(savedImage);
			}

			const newImage = new Image({
				data: request.file.buffer,
				user: request.user,
			});

			const [savedImage, updatedUser] = await Promise.all([
				newImage.save(),
				user.save(),
			]);

			response.send(savedImage);
		} catch (error) {
			response.status(500).send(error);
		}
	}
);

//get a post image
router.get("/post/:postID", async (request, response) => {
	const image = await Image.findOne({ post: request.params.postID });

	if (!image) {
		return response.status(400).send({ error: "image not found" });
	}

	response.set("Content-Type", "image/jpg");

	try {
		response.send(image.data);
	} catch (error) {
		response.send(error);
	}
});

//get a user image
router.get("/user/:userID", async (request, response) => {
	const image = await Image.findOne({ user: request.params.userID });

	if (!image) {
		return response.status(400).send({ error: "image not found" });
	}

	response.set("Content-Type", "image/jpg");

	try {
		response.send(image.data);
	} catch (error) {
		response.send(error);
	}
});

module.exports = router;
