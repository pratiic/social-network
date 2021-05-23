import React from "react";

import "./profile-picture.scss";

const ProfilePicture = ({ profilePictureURL, profilePicture, id, size }) => {
	return (
		<div className={`profile-picture ${size ? size : null}`}>
			{profilePicture ? (
				<img src={`/api/images/user/${id}`} alt="ava" />
			) : profilePictureURL ? (
				<img src={profilePictureURL} alt="ava" />
			) : null}
		</div>
	);
};

export default ProfilePicture;
