import React from "react";

import "./reload.scss";

import { ReactComponent as ReloadIcon } from "../../assets/icons/reload.svg";

const Reload = ({ text, clickHandler }) => {
	return (
		<div className="reload" onClick={clickHandler}>
			<p className="text text-smallest">{text}</p>
			<ReloadIcon className="icon" />
		</div>
	);
};

export default Reload;
