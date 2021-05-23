import React from "react";
import { Link } from "react-router-dom";

import "./form-header.scss";

const FormHeader = ({ title, subtitle, link, linkTo }) => {
	return (
		<div className="form-header">
			<p className="title text-big">{title}</p>
			<p className="subtitle text-small">
				{subtitle} <Link to={`/${linkTo}`}>{link}</Link>
			</p>
		</div>
	);
};

export default FormHeader;
