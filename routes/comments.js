const express = require("express");
const Comment = require("../models/Comment");
const { validateComment } = require("../validation/comment-validation");
const { auth } = require("../middleware/auth");

const router = express.Router();

//add a comment to a post
router.post("/:postID", auth, async (request, response) => {
	const error = validateComment({
		...request.body,
		user: request.user,
		post: request.params.postID,
	});

	if (error) {
		return response.status(400).send({ message: error });
	}

	const comment = new Comment({
		...request.body,
		user: request.user,
		post: request.params.postID,
	});

	try {
		const savedComment = await comment.save();
		response.status(201).send(savedComment);
	} catch (error) {
		response.status(500).send(error);
	}
});

//get all comments of a post
router.get("/:postID", auth, async (request, response) => {
	const comments = await Comment.find({
		post: request.params.postID,
	}).populate("user");

	if (comments.length === 0) {
		return response.status(400).send({ message: "no comments found" });
	}

	return response.send(comments);
});

//edit a comment
router.put("/:commentID", auth, async (request, response) => {
	const comment = await Post.findOne({
		_id: request.params.commentID,
		user: request.user,
	});

	if (!comment) {
		return response.status(400).send({ message: "comment doesnot exist" });
	}

	try {
		await Comment.findByIdAndUpdate(request.params.commentID, {
			...request.body,
		});
		response.send({ message: "updated" });
	} catch (error) {
		response.send(error);
	}
});

//delete a comment
router.delete("/:commentID", auth, async (request, response) => {
	const comment = await Comment.findOne({
		_id: request.params.commentID,
		user: request.user,
	});

	if (!comment) {
		return response.status(400).send({ message: "comment doesnot exist" });
	}

	try {
		await Comment.findByIdAndDelete(request.params.id);
		response.send({ message: "deleted" });
	} catch (error) {
		response.status(500).send(error);
	}
});

//add a reply to a comment
router.post("/:commentID/replies", auth, async (request, response) => {
	const comment = await Comment.findById(request.params.commentID);

	if (!comment) {
		return response.status(400).send({ message: "comment doesnot exist" });
	}

	comment.replies.push(request.body);

	try {
		const savedReply = await comment.save();
		response.status(201).send({ message: "reply added" });
	} catch (error) {
		response.status(500).send(error);
	}
});

//get all replies to a comment
router.get("/:commentID/replies", auth, async (request, response) => {
	const comment = await Comment.findById(request.params.commentID);

	if (!comment) {
		return response.status(400).send({ message: "comment doesnot exist" });
	}

	if (comment.replies.length === 0) {
		return response.status(400).send({ message: "no replies found" });
	}

	response.send(comment.replies);
});

//edit a reply
router.put("/:commentID/replies/:replyID", auth, async (request, response) => {
	const comment = await Comment.findById(request.params.commentID);

	if (!comment) {
		return response.status(400).send({ message: "comment doesnot exist" });
	}

	const reply = await comment.replies.id(request.params.replyID);

	if (!reply) {
		return response.status(400).send({ message: "reply doesnot exist" });
	}

	reply.description = request.body.description;

	try {
		await comment.save();
		response.send({ message: "edited" });
	} catch (error) {
		response.status(500).send(error);
	}
});

//delete a reply
router.delete(
	"/:commentID/replies/:replyID",
	auth,
	async (request, response) => {
		const comment = await Comment.findById(request.params.commentID);

		if (!comment) {
			return response
				.status(400)
				.send({ message: "comment doesnot exist" });
		}

		const reply = await comment.replies.id(request.params.replyID);

		if (!reply) {
			return response
				.status(400)
				.send({ message: "reply doesnot exist" });
		}

		comment.replies.id(request.params.replyID).remove();

		try {
			await comment.save();
			response.send({ message: "deleted" });
		} catch (error) {
			response.send(error);
		}
	}
);

//like a comment
router.put("/:commentID/likes", auth, async (request, response) => {
	const comment = await Comment.findById(request.params.commentID);

	if (!comment) {
		return response.status(400).send({ message: "comment doesnot exist" });
	}

	const likedByUser = comment.likedBy.find((like) => {
		return like.user == request.user;
	});

	if (!likedByUser) {
		comment.likedBy.push({ user: request.user });
	} else {
		response.status(400).send({ message: "already liked" });
	}

	const dislikedByUser = comment.dislikedBy.find((dislike) => {
		return dislike.user == request.user;
	});

	if (dislikedByUser) {
		comment.dislikedBy.id(dislikedByUser._id).remove();
	}

	try {
		await comment.save();
		response.send({ message: "liked" });
	} catch (error) {
		response.status(500).send(error);
	}
});

//dislike a comment
router.put("/:commentID/dislikes", auth, async (request, response) => {
	const comment = await Comment.findById(request.params.commentID);

	if (!comment) {
		return response.status(400).send({ message: "comment doesnot exist" });
	}

	const dislikedByUser = comment.dislikedBy.find((dislike) => {
		return dislike.user == request.user;
	});

	if (!dislikedByUser) {
		comment.dislikedBy.push({ user: request.user });
	} else {
		return response.status(400).send({ message: "already disliked" });
	}

	const likedByUser = comment.likedBy.find((like) => {
		return like.user == request.user;
	});

	if (likedByUser) {
		comment.likedBy.id(likedByUser._id).remove();
	}

	try {
		await comment.save();
		response.send({ message: "disliked" });
	} catch (error) {
		response.status(500).send(error);
	}
});

module.exports = router;
