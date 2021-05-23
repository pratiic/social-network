import React from "react";

import "./profile-info.scss";

const ProfileInfo = ({ title, description, items }) => {
	return (
		<div className="profile-info">
			<p className="info-title">{title}</p>
			{description ? (
				<p className="info-description">{description}</p>
			) : null}

			{items ? (
				<div className="collection">
					{items.map((item) => {
						return <p className="info-description">{item}</p>;
					})}
				</div>
			) : null}
		</div>
	);
};

export default ProfileInfo;
