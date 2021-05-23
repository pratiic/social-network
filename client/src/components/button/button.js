import React from "react";

import "./button.scss";

const Button = ({
	children,
	type,
	full,
	outlined,
	white,
	bigger,
	smaller,
	secondary,
	active,
	red,
	align,
	className,
	clickHandler,
}) => {
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

		if (bigger) {
			buttonClassName += " bigger";
		}

		if (smaller) {
			buttonClassName += " smaller";
		}

		if (secondary) {
			buttonClassName += " secondary";
		}

		if (active) {
			buttonClassName += " active";
		}

		if (red) {
			buttonClassName += " red";
		}

		if (align) {
			buttonClassName += ` ${align}`;
		}

		if (className) {
			buttonClassName += ` ${className}`;
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
