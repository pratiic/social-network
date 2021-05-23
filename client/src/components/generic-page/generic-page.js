import React from "react";

const GenericPage = ({ title, children }) => {
	return (
		<div className="generic-page">
			<div className="page-title">{title}</div>
			{children}
		</div>
	);
};

export default GenericPage;
