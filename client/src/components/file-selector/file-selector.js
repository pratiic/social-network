import React, { useRef } from "react";

import "./file-selector.scss";

import { ReactComponent as CameraIcon } from "../../assets/icons/camera.svg";

import Button from "../button/button";

const FileSelector = ({ changeHandler, filename, align }) => {
	const inputRef = useRef();

	console.log(filename);

	const handleFileHandlerButtonClick = (event) => {
		event.preventDefault();
		inputRef.current.click();
	};

	return (
		<div className={`file-selector ${align ? align : null}`}>
			<input
				type="file"
				className="file"
				ref={inputRef}
				onChange={changeHandler}
			/>
			<Button secondary clickHandler={handleFileHandlerButtonClick}>
				<CameraIcon className="icon" /> select image
			</Button>
			{filename ? (
				<p className="file-name text-smaller"> {filename} </p>
			) : null}
		</div>
	);
};

export default FileSelector;
