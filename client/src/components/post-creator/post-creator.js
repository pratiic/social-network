import React, { useState, useContext, useEffect } from "react";
import { connect, useDispatch } from "react-redux";

import "./post-creator.scss";

import {
	addPost,
	addPosts,
	resetEditingFields,
} from "../../redux/posts/posts.actions";
import { showNotification } from "../../redux/notification/notification.actions";
import { hideModal, showModal } from "../../redux/modal/modal.actions";

import { CurrentUserContext } from "../../contexts/current-user.context";
import { PostsContext } from "../../contexts/posts.context";

import { createPost, editOrDeletePost } from "../../api/api.posts";

import { ReactComponent as SendIcon } from "../../assets/icons/send.svg";

import Button from "../button/button";
import TextPostCreator from "../text-post-creator/text-post-creator";
import ImagePostCreator from "../image-post-creator/image-post-creator";
import Alert from "../alert/alert";

const PostCreator = ({ posts, postTypeRedux, editingPost, postID }) => {
	const [posting, setPosting] = useState(false);
	const [postType, setPostType] = useState("image");
	const [posted, setPosted] = useState(false);
	const [error, setError] = useState("");

	const [currentUser, setCurrentUser] = useContext(CurrentUserContext);

	const dispatch = useDispatch();

	useEffect(() => {
		if (postTypeRedux) {
			setPostType(postTypeRedux);
		}
	}, [postTypeRedux]);

	const createTextPost = (post) => {
		if (post.length !== 0) {
			setPosting(true);
			setPosted(false);

			if (editingPost && postType === "text") {
				dispatch(showModal("editing the post..."));

				return editOrDeletePost(
					"edit",
					postID,
					{ description: post },
					currentUser.token
				).then((data) => {
					setPosting(false);
					dispatch(hideModal());

					if (data.message === "updated") {
						setPosted(true);
						dispatch(
							showNotification(true, "post has been edited")
						);
						dispatch(resetEditingFields());
					}
				});
			}

			dispatch(showModal("creating your post..."));

			createPost("text", { description: post }, currentUser.token).then(
				(data) => {
					setPosting(false);
					dispatch(hideModal());

					if (!data.error) {
						dispatch(addPost({ ...data, user: currentUser }));
						setPosted(true);

						dispatch(
							showNotification(true, "post has been created")
						);
					}
				}
			);
		}
	};

	const createImagePost = (post) => {
		setPosting(true);

		setPosted(false);

		clearError();

		if (editingPost && postType === "image") {
			dispatch(showModal("editing the post..."));

			return editOrDeletePost(
				"edit",
				postID,
				{ description: post.description },
				currentUser.token
			).then((data) => {
				setPosting(false);
				dispatch(hideModal());

				if (data.message === "updated") {
					setPosted(true);
					dispatch(showNotification(true, "post has been edited"));
					dispatch(resetEditingFields());
				}
			});
		}

		if (!post.file) {
			setError("you haven't selected an image");
			return setPosting(false);
		}

		const formData = new FormData();
		formData.append("postImage", post.file);
		formData.append("description", post.description);

		dispatch(showModal("creating the post. This may take a while..."));

		createPost("image", formData, currentUser.token).then((data) => {
			setPosting(false);
			dispatch(hideModal());

			if (!data.error) {
				dispatch(addPost({ ...data, user: currentUser }));

				setPosted(true);

				dispatch(showNotification(true, "post has been created"));
			} else {
				if (data.error) {
					if (data.error === "please upload a valid image") {
						return setError(
							"please upload a valid image. jpg, jpeg, png images can be uploaded"
						);
					}
					if (data.error === "File too large") {
						return setError(
							"you can only upload images upto 5 mb in size"
						);
					}
				}
			}
		});
	};

	const clearError = () => {
		setError("");
	};

	return (
		<div className="post-creator">
			<div className="post-type text-smaller">
				<div
					className={`post-type-toggler ${
						postType === "image" ? "active" : null
					}`}
					onClick={() => {
						setPostType("image");
					}}
				>
					image post
				</div>
				<div
					className={`post-type-toggler ${
						postType === "text" ? "active" : null
					}`}
					onClick={() => {
						setPostType("text");
					}}
				>
					text post
				</div>
			</div>
			{editingPost ? (
				<Alert text="edit mode on" type="no-remove" />
			) : null}
			{postType === "image" ? (
				<ImagePostCreator
					submitHandler={createImagePost}
					error={error}
					clearError={clearError}
					posting={posting}
					posted={posted}
				/>
			) : (
				<TextPostCreator
					posting={posting}
					posted={posted}
					submitHandler={createTextPost}
				/>
			)}
		</div>
	);
};

const mapStateToProps = (state) => {
	return {
		posts: state.posts.posts,
		postTypeRedux: state.posts.postType,
		editingPost: state.posts.editingPost,
		postID: state.posts.postID,
	};
};

export default connect(mapStateToProps)(PostCreator);
