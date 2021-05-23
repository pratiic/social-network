import React, { useState, useEffect } from "react";

import { ReactComponent as SendIcon } from "../../assets/icons/send.svg";

import Button from "../button/button";

const TextPostCreator = ({ posting, posted, submitHandler }) => {
	const [post, setPost] = useState("");

	useEffect(() => {
		console.log(posted);

		if (posted) {
			setPost("");
		}
	}, [posted]);

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
				onChange={handleInputChange}
			></textarea>
			<Button type="submit" secondary smaller align="right">
				{posting ? "creating" : "create"} <SendIcon className="icon" />
			</Button>
		</form>
	);
};

export default TextPostCreator;
