const express = require("express");
const Post = require("../models/Post");
const { validatePost } = require("../validation/post-validation");
const { auth } = require("../middleware/auth");

const router = express.Router();

//create a post
router.post("/", auth, async (request, response) => {
	const error = validatePost({ ...request.body, user: request.user });

	if (error) {
		return response.status(400).send({ message: error });
	}

	const post = new Post({
		...request.body,
		user: request.user,
	});

	try {
		const savedPost = await post.save();
		response.status(201).send(savedPost);
	} catch (error) {
		response.status(500).send(error);
	}
});

//get all posts of a user
router.get("/:id", auth, async (request, response) => {
	const posts = await Post.find({ user: request.params.id });

	if (posts.length === 0) {
		return response.status(400).send({ message: "no posts found" });
	}

	return response.send(posts);
});

//get all posts
router.get("/", auth, async (request, response) => {
	const posts = await Post.find();

	if (posts.length === 0) {
		return response.status(400).send({ message: "no posts found" });
	}

	return response.send(posts);
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
		return response.status(400).send({ message: "post doesnot exists" });
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

	if (!likedByUser) {
		post.likedBy.push({ user: request.user });
	} else {
		response.status(400).send({ message: "already liked" });
	}

	const dislikedByUser = post.dislikedBy.find((dislike) => {
		return dislike.user == request.user;
	});

	if (dislikedByUser) {
		post.dislikedBy.id(dislikedByUser._id).remove();
	}

	try {
		await post.save();
		response.send({ message: "liked" });
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
		await post.save();
		response.send({ message: "disliked" });
	} catch (error) {
		response.status(500).send(error);
	}
});

module.exports = router;
