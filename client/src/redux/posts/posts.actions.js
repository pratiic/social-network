import { postsActionTypes } from "./posts.types";

export const addPosts = (posts) => {
	return {
		type: postsActionTypes.ADD_POSTS,
		payload: posts,
	};
};

export const updatePost = (post) => {
	return {
		type: postsActionTypes.UPDATE_POST,
		payload: post,
	};
};

export const addPost = (post) => {
	return {
		type: postsActionTypes.ADD_POST,
		payload: post,
	};
};

export const deletePost = (data) => {
	return {
		type: postsActionTypes.DELETE_POST,
		payload: data,
	};
};

export const addComment = (comment, postID) => {
	return {
		type: postsActionTypes.ADD_COMMENT,
		payload: { comment, post: postID },
	};
};

export const addComments = (comments, postID) => {
	return {
		type: postsActionTypes.ADD_COMMENTS,
		payload: { comments, post: postID },
	};
};

export const updateComment = (postID, comment) => {
	return {
		type: postsActionTypes.UPDATE_COMMENT,
		payload: { post: postID, comment: comment },
	};
};

export const deleteComment = (postID, commentID) => {
	return {
		type: "DELETE_COMMENT",
		payload: { post: postID, comment: commentID },
	};
};
