import React, { useState, useEffect, useRef } from "react";
import { useDispatch, connect } from "react-redux";

import "./image-post-creator.scss";

import { resetEditingFields } from "../../redux/posts/posts.actions";

import { ReactComponent as SendIcon } from "../../assets/icons/send.svg";

import Button from "../button/button";
import FileSelector from "../file-selector/file-selector";

const ImagePostCreator = ({
	submitHandler,
	error,
	clearError,
	posting,
	posted,
	editingPost,
	postDescription,
	postType,
}) => {
	const [file, setFile] = useState(null);
	const [description, setDescription] = useState("");

	const dispatch = useDispatch();

	const inputRef = useRef();

	useEffect(() => {
		if (posted) {
			setFile(null);
			setDescription("");
		}
	}, [posted]);

	useEffect(() => {
		return () => {
			if (editingPost && postType === "image") {
				dispatch(resetEditingFields());
			}
		};
	}, [editingPost, postType]);

	useEffect(() => {
		if (editingPost && postType === "image") {
			setDescription(postDescription);
			inputRef.current.scrollIntoView();
			window.scrollBy(0, -250);
			inputRef.current.focus();
		}
	}, [editingPost, postDescription]);

	const handleInputChange = (event) => {
		setDescription(event.target.value);
	};

	const handleFileChange = (event) => {
		setFile(event.target.files[0]);
		clearError();
	};

	const handleFormSubmit = (event) => {
		event.preventDefault();

		submitHandler({ file: file, description: description });
	};

	return (
		<form
			className="post-creator image-post-creator"
			onSubmit={handleFormSubmit}
		>
			{!(editingPost && postType === "image") ? (
				<React.Fragment>
					<FileSelector
						changeHandler={handleFileChange}
						filename={file ? file.name : ""}
					/>
					<p className="error text-smaller">{error}</p>
				</React.Fragment>
			) : null}

			<div className="input-group">
				{/* <label className="text-smaller">
					description (not required)
				</label> */}
				<textarea
					placeholder="description"
					className="text-smaller smaller"
					ref={inputRef}
					value={description}
					onChange={handleInputChange}
				></textarea>
			</div>
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

export default connect(mapStateToProps)(ImagePostCreator);
