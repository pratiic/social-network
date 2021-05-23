import React, { useState } from "react";

import "./alert.scss";

import { ReactComponent as ClearIcon } from "../../assets/icons/clear.svg";

const Alert = ({ text, clickHandler }) => {
	return (
		<div className={`alert text-small`}>
			<p className="alert-description">{text}</p>
			<ClearIcon className="icon" onClick={clickHandler} />
		</div>
	);
};

export default Alert;
