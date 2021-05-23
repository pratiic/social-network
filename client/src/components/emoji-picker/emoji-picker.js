import React from "react";
import Picker from "emoji-picker-react";

import "./emoji-picker.scss";

const EmojiPicker = ({ show, insertEmoji }) => {
	const handleEmojiClick = (event, emoji) => {
		insertEmoji(emoji.emoji);
	};

	return (
		<div className={`emoji-picker-container ${show ? "show" : null}`}>
			<Picker className="emoji-picker" onEmojiClick={handleEmojiClick} />
		</div>
	);
};

export default EmojiPicker;
