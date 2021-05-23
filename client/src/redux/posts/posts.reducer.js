import posts from "../../components/posts/posts";
import { postsActionTypes } from "./posts.types";

const INITIAL_STATE = {
	posts: [],
};

export const postsReducer = (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case postsActionTypes.ADD_POSTS:
			return { ...state, posts: action.payload };
		case postsActionTypes.UPDATE_POST:
			return {
				...state,
				posts: state.posts.map((post) => {
					if (post._id == action.payload._id) {
						return {
							...post,
							...action.payload,
							user: post.user,
							comments: post.comments,
						};
					}

					return post;
				}),
			};
		case postsActionTypes.ADD_POST:
			return {
				...state,
				posts: addPost(action.payload, state),
			};
		case postsActionTypes.DELETE_POST:
			return {
				...state,
				posts: state.posts.filter((post) => {
					return post._id != action.payload._id;
				}),
			};
		case postsActionTypes.ADD_COMMENT:
			return {
				...state,
				posts: addComments(false, state, action),
			};
		case postsActionTypes.ADD_COMMENTS:
			return {
				...state,
				posts: addComments(true, state, action),
			};
		case postsActionTypes.UPDATE_COMMENT:
			return {
				...state,
				posts: state.posts.map((post) => {
					if (post._id == action.payload.post) {
						return {
							...post,
							comments: post.comments.map((comment) => {
								if (comment._id == action.payload.comment._id) {
									return {
										...comment,
										...action.payload.comment,
										user: comment.user,
									};
								}

								return comment;
							}),
						};
					}

					return post;
				}),
			};
		case "DELETE_COMMENT":
			return {
				...state,
				posts: state.posts.map((post) => {
					if (post._id == action.payload.post) {
						return {
							...post,
							comments: post.comments.filter(
								(comment) =>
									comment._id != action.payload.comment
							),
						};
					}
					return post;
				}),
			};
		default:
			return state;
	}
};

const addPost = (postToBeAdded, state) => {
	if (state.posts.some((post) => post._id == postToBeAdded._id)) {
		return [...state.posts];
	} else {
		return [postToBeAdded, ...state.posts];
	}
};

const addComments = (many, state, action) => {
	const comments = state.posts.map((post) => {
		if (post._id == action.payload.post) {
			return {
				...post,
				comments: many
					? [...action.payload.comments]
					: [action.payload.comment, ...post.comments],
			};
		}

		return post;
	});

	return comments;
};
