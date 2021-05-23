import React, { useState, useContext } from "react";
import { connect, useDispatch } from "react-redux";

import "./post-creator.scss";

import { addPost, addPosts } from "../../redux/posts/posts.actions";
import { showNotification } from "../../redux/notification/notification.actions";

import { CurrentUserContext } from "../../contexts/current-user.context";
import { PostsContext } from "../../contexts/posts.context";

import { createPost } from "../../api/api.posts";

import { ReactComponent as SendIcon } from "../../assets/icons/send.svg";

import Button from "../button/button";
import TextPostCreator from "../text-post-creator/text-post-creator";
import ImagePostCreator from "../image-post-creator/image-post-creator";

const PostCreator = ({ posts }) => {
	const [posting, setPosting] = useState(false);
	const [postType, setPostType] = useState("image");
	const [posted, setPosted] = useState(false);
	const [error, setError] = useState("");

	const [currentUser, setCurrentUser] = useContext(CurrentUserContext);

	const dispatch = useDispatch();

	const createTextPost = (post) => {
		if (post.length !== 0) {
			console.log(currentUser);
			setPosting(true);
			setPosted(false);

			createPost("text", { description: post }, currentUser.token).then(
				(data) => {
					setPosting(false);

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
		if (!post.file) {
			return setError("you haven't selected an image");
		}

		const formData = new FormData();
		formData.append("postImage", post.file);
		formData.append("description", post.description);

		setPosting(true);

		setPosted(false);

		clearError();

		createPost("image", formData, currentUser.token).then((data) => {
			setPosting(false);

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
							"you can only upload images upto 2 mb in size"
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
	};
};

export default connect(mapStateToProps)(PostCreator);
