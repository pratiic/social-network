import React from "react";

import "./profile-preview.scss";

import ProfilePicture from "../profile-picture/profile-picture";

const ProfilePreview = ({
	username,
	profilePictureURL,
	profilePicture,
	id,
	active,
	clickHandler,
}) => {
	return (
		<div
			className={`profile-preview ${active ? "active" : null} `}
			onClick={clickHandler}
		>
			<p className="username text-small">{username}</p>
			<ProfilePicture
				profilePictureURL={profilePictureURL}
				profilePicture={profilePicture}
				id={id}
			/>
		</div>
	);
};

export default ProfilePreview;
