import React from "react";

import "./button.scss";

const Button = ({ children, type, full, outlined, white, clickHandler }) => {
	const getButtonClassName = () => {
		let buttonClassName = "button";

		if (full) {
			buttonClassName += " full";
		}

		if (outlined) {
			buttonClassName += " outlined";
		}

		if (white) {
			buttonClassName += " white";
		}

		return buttonClassName;
	};

	return (
		<button
			className={getButtonClassName()}
			type="type"
			onClick={clickHandler}
		>
			{children}
		</button>
	);
};

export default Button;
