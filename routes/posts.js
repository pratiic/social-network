const express = require("express");
const Post = require("../models/Post");
const { validatePost } = require("../validation/post-validation");
const { auth } = require("../middleware/auth");
const Profile = require("../models/Profile");
const Notification = require("../models/Notification");
const { getUpload } = require("../middleware/multer");
const Image = require("../models/Image");

const router = express.Router();

//create a post
const upload = getUpload(5);

router.post(
	"/",
	auth,
	upload.single("postImage"),
	async (request, response) => {
		const error = validatePost({ ...request.body, user: request.user });

		if (error) {
			return response.status(400).send({ message: error });
		}

		const profile = await Profile.findOne({ user: request.user });

		if (!profile) {
			return response.status(400).send({ error: "profile not found" });
		}

		try {
			const post = new Post({
				...request.body,
				image: request.file ? true : false,
				user: request.user,
				for: [...profile.friends, request.user],
			});
			const savedPost = await post.save();

			if (request.file) {
				const image = new Image({
					data: request.file.buffer,
					post: savedPost._id,
				});

				await image.save();
				return response.status(201).send(savedPost);
			}

			response.status(201).send(savedPost);
		} catch (error) {
			response.status(500).send(error);
		}
	},
	(error, request, response, next) => {
		response.status(400).send({ error: error.message });
	}
);

//get all posts of a user
router.get("/:id", auth, async (request, response) => {
	const posts = await Post.find({ user: request.params.id })
		.populate("user")
		.sort({ createdAt: -1 });

	if (posts.length === 0) {
		return response.status(400).send({ error: "no posts found" });
	}

	return response.send(posts);
});

//get all posts
router.get("/", auth, async (request, response) => {
	const posts = await Post.find({ for: request.user })
		.sort({
			createdAt: -1,
		})
		.populate("user");

	if (posts.length === 0) {
		return response.status(400).send({ error: "no posts found" });
	}

	return response.send(posts);
});

//get a post
router.get("/post/:postID", auth, async (request, response) => {
	const post = await Post.findById(request.params.postID).populate("user");

	if (!post) {
		return response.status(400).send({ error: "post not found" });
	}

	try {
		response.send(post);
	} catch (error) {
		response.status(500).send(error);
	}
});

//get image of a post
router.get("/image/:postID", async (request, response) => {
	const post = await Post.findById(request.params.postID);
	console.log(post);

	if (!post || !post.image) {
		return response.status(400).send({ error: "image not found" });
	}

	try {
		response.set("Content-Type", "image/jpg");

		response.send(post.image);
	} catch (error) {
		response.status(500).send(error);
	}
});

//edit a post
router.put("/:id", auth, async (request, response) => {
	const post = await Post.findOne({
		_id: request.params.id,
		user: request.user,
	});

	if (!post) {
		return response.status(400).send({ message: "post doesnot exist" });
	}

	try {
		await Post.findByIdAndUpdate(request.params.id, { ...request.body });
		response.send({ message: "updated" });
	} catch (error) {
		response.send(error);
	}
});

//delete a post
router.delete("/:id", auth, async (request, response) => {
	const post = await Post.findOne({
		_id: request.params.id,
		user: request.user,
	});

	if (!post) {
		return response.status(400).send({ error: "post doesnot exists" });
	}

	try {
		await Post.findByIdAndDelete(request.params.id);
		response.send({ message: "deleted" });
	} catch (error) {
		response.status(500).send(error);
	}
});

//like a post
router.put("/:postID/likes", auth, async (request, response) => {
	const post = await Post.findById(request.params.postID);

	if (!post) {
		return response.status(400).send({ message: "post doesnot exist" });
	}

	const likedByUser = post.likedBy.find((like) => {
		return like.user == request.user;
	});

	let count;

	if (!likedByUser) {
		count = post.likedBy.push({ user: request.user });
	} else {
		return response.status(400).send({ message: "already liked" });
	}

	const dislikedByUser = post.dislikedBy.find((dislike) => {
		return dislike.user == request.user;
	});

	if (dislikedByUser) {
		post.dislikedBy.id(dislikedByUser._id).remove();
	}

	try {
		if (!(post.user == request.user)) {
			const notification = new Notification({
				to: post.user,
				from: request.user,
				action: "like",
				postID: post._id,
				type: "post",
			});
			const savedNotification = await notification.save();
		}

		const savedPost = await post.save();
		response.send(savedPost);
	} catch (error) {
		response.status(500).send(error);
	}
});

//dislike a post
router.put("/:postID/dislikes", auth, async (request, response) => {
	const post = await Post.findById(request.params.postID);

	if (!post) {
		return response.status(400).send({ message: "post doesnot exist" });
	}

	const dislikedByUser = post.dislikedBy.find((dislike) => {
		return dislike.user == request.user;
	});

	if (!dislikedByUser) {
		post.dislikedBy.push({ user: request.user });
	} else {
		return response.status(400).send({ message: "already disliked" });
	}

	const likedByUser = post.likedBy.find((like) => {
		return like.user == request.user;
	});

	if (likedByUser) {
		post.likedBy.id(likedByUser._id).remove();
	}

	try {
		if (!(post.user == request.user)) {
			const notification = new Notification({
				to: post.user,
				from: request.user,
				action: "dislike",
				postID: post._id,
				type: "post",
			});
			const savedNotification = await notification.save();
		}

		const savedPost = await post.save();
		response.send(savedPost);
	} catch (error) {
		response.status(500).send(error);
	}
});

module.exports = router;
