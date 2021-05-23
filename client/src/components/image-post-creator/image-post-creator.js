import React, { useState, useEffect } from "react";

import "./image-post-creator.scss";

import { ReactComponent as SendIcon } from "../../assets/icons/send.svg";

import Button from "../button/button";
import FileSelector from "../file-selector/file-selector";

const ImagePostCreator = ({
	submitHandler,
	error,
	clearError,
	posting,
	posted,
}) => {
	const [file, setFile] = useState(null);
	const [description, setDescription] = useState("");

	useEffect(() => {
		if (posted) {
			setFile(null);
		}
	}, [posted]);

	const handleInputChange = (event) => {
		setDescription(event.target.value);
	};

	const handleFileChange = (event) => {
		console.log(event.target.files[0]);
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
			<FileSelector
				changeHandler={handleFileChange}
				filename={file ? file.name : ""}
			/>
			<p className="error text-smaller">{error}</p>
			<div className="input-group">
				{/* <label className="text-smaller">
					description (not required)
				</label> */}
				<textarea
					placeholder="description"
					className="text-smaller smaller"
					onChange={handleInputChange}
				></textarea>
			</div>
			<Button secondary smaller align="right">
				<SendIcon className="icon" /> {posting ? "creating" : "create"}
			</Button>
		</form>
	);
};

export default ImagePostCreator;
