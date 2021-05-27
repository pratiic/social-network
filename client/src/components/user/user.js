import React, { useEffect, useState, useContext } from "react";
import { useHistory } from "react-router-dom";

import "./user.scss";

import { CurrentUserContext } from "../../contexts/current-user.context";

import { getUser } from "../../api/api.user";

import ProfilePicture from "../profile-picture/profile-picture";

const User = ({ user, clickHandler, count }) => {
	const [userToDisplay, setUserToDisplay] = useState({});

	const [currentUser, setCurrentUser] = useContext(CurrentUserContext);

	const history = useHistory();

	useEffect(() => {
		if (user.username) {
			return setUserToDisplay(user);
		}

		getUser(user, currentUser.token).then((data) => {
			setUserToDisplay(data);
		});
	}, []);

	const handleUserClick = () => {
		if (userToDisplay._id) {
			if (clickHandler) {
				clickHandler(user);
			} else {
				history.push(`/profile/view/${userToDisplay._id}`);
			}
		}
	};

	return (
		<div
			className={`user ${count > 0 ? "active" : null}`}
			onClick={handleUserClick}
		>
			<ProfilePicture
				profilePictureURL={userToDisplay.profilePictureURL}
				profilePicture={userToDisplay.profilePicture}
				id={userToDisplay._id}
			/>
			<div className="user-info">
				<p className="username text-small">{userToDisplay.username}</p>
				<p className="email text-smaller">{userToDisplay.email}</p>
				{count > 0 ? (
					<p className="count text-smallest">{count}</p>
				) : null}
			</div>
		</div>
	);
};

export default User;
