import React from "react";

import "./page-title.scss";

const PageTitle = ({ title, subtitle }) => {
	return (
		<div className="page-title">
			<p className="title text-big capitalize">{title}</p>
			<p className="subtitle">{subtitle}</p>
		</div>
	);
};

export default PageTitle;
