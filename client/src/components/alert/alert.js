import React, { useState } from "react";

import "./alert.scss";

import { ReactComponent as ClearIcon } from "../../assets/icons/clear.svg";

const Alert = ({ text, clickHandler, position, type }) => {
	return (
		<div className={`alert text-small ${position}`}>
			<p className="alert-description">{text}</p>
			{type !== "no-remove" ? (
				<ClearIcon className="icon" onClick={clickHandler} />
			) : null}
		</div>
	);
};

export default Alert;
