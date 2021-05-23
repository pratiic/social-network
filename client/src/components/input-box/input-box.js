import React, { useState, useRef } from "react";
import { useLocation } from "react-router-dom";

import "./input-box.scss";

import { ReactComponent as SendIcon } from "../../assets/icons/send.svg";
import { ReactComponent as ClearIcon } from "../../assets/icons/clear.svg";
import { ReactComponent as EmojiIcon } from "../../assets/icons/emoji.svg";

import EmojiPicker from "../emoji-picker/emoji-picker";

const InputBox = ({ placeholder, formSubmitHandler, changeHandler }) => {
	const [input, setInput] = useState("");
	const [showEmoji, setShowEmoji] = useState(false);

	const inputRef = useRef();

	const location = useLocation();

	const handleInputChange = (event) => {
		setInput(event.target.value);

		if (changeHandler) {
			changeHandler(event);
		}
	};

	const handleFormSubmit = (event) => {
		formSubmitHandler(event, input);
		setInput("");
	};

	const insertEmoji = (emoji) => {
		setInput(`${input}${emoji}`);
		inputRef.current.focus();
	};

	const handleEmojiIconClick = () => {
		setShowEmoji(!showEmoji);
	};

	const handleClearIconClick = () => {
		setInput("");
		inputRef.current.focus();
	};

	return (
		<form className="input-box" onSubmit={handleFormSubmit}>
			<div className="input-group">
				{location.pathname.includes("chat") ? (
					<EmojiPicker show={showEmoji} insertEmoji={insertEmoji} />
				) : null}
				<input
					type="text"
					placeholder={placeholder}
					className="text-smaller"
					value={input}
					ref={inputRef}
					onChange={handleInputChange}
				/>
				<div className="buttons">
					<ClearIcon
						className="icon"
						onClick={handleClearIconClick}
					/>
					{location.pathname.includes("chat") ? (
						<EmojiIcon
							className="icon emoji-icon"
							onClick={handleEmojiIconClick}
						/>
					) : null}
					<SendIcon className="icon" onClick={handleFormSubmit} />
				</div>
			</div>
		</form>
	);
};

export default InputBox;
