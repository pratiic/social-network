import React, { useState, useEffect, useRef } from "react";
import { useDispatch, connect } from "react-redux";

import { resetEditingFields } from "../../redux/posts/posts.actions";

import { ReactComponent as SendIcon } from "../../assets/icons/send.svg";

import Button from "../button/button";

const TextPostCreator = ({
	posting,
	posted,
	submitHandler,
	editingPost,
	postDescription,
	postID,
	postType,
}) => {
	const [post, setPost] = useState("");

	const dispatch = useDispatch();

	const inputRef = useRef();

	useEffect(() => {
		console.log(posted);

		if (posted) {
			setPost("");
		}
	}, [posted]);

	useEffect(() => {
		if (editingPost && postType === "text") {
			setPost(postDescription);
			inputRef.current.scrollIntoView();
			window.scrollBy(0, -250);
			inputRef.current.focus();
		}
	}, [editingPost]);

	useEffect(() => {
		return () => {
			if (editingPost && postType === "text") {
				dispatch(resetEditingFields());
			}
		};
	}, [editingPost, postType]);

	const handleInputChange = (event) => {
		setPost(event.target.value);
	};

	const handleFormSubmit = (event) => {
		event.preventDefault();

		if (post.length > 0) {
			submitHandler(post);
		}
	};

	return (
		<form
			className="post-creator text-post-creator"
			onSubmit={handleFormSubmit}
		>
			<textarea
				placeholder="create a post..."
				className="text-smaller"
				value={post}
				ref={inputRef}
				onChange={handleInputChange}
			></textarea>
			{editingPost ? (
				<Button type="submit" secondary smaller align="right">
					{posting ? "editing" : "edit"} <SendIcon className="icon" />
				</Button>
			) : (
				<Button type="submit" secondary smaller align="right">
					{posting ? "creating" : "create"}{" "}
					<SendIcon className="icon" />
				</Button>
			)}
		</form>
	);
};

const mapStateToProps = (state) => {
	return {
		editingPost: state.posts.editingPost,
		postDescription: state.posts.postDescription,
		postType: state.posts.postType,
	};
};

export default connect(mapStateToProps)(TextPostCreator);
