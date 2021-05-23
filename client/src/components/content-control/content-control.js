import React from "react";

import "./content-control.scss";

const ContentControl = ({ count, children, clickHandler }) => {
	return (
		<div className="content-control" onClick={clickHandler}>
			{children} <p className="text-smallest">{count}</p>
		</div>
	);
};

export default ContentControl;
