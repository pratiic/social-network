import React from "react";

import "./custom-input.scss";

const CustomInput = ({
	value,
	label,
	error,
	type,
	name,
	inputChangeHandler,
}) => {
	return (
		<div className={`custom-input ${error ? "error" : null}`}>
			<label className="text-small">{label}</label>
			<input
				type={type}
				value={value}
				name={name}
				className="text-small"
				onChange={(event) => {
					inputChangeHandler(event);
				}}
			/>
			<p className="error text-small">{error}</p>
		</div>
	);
};

export default CustomInput;
