import React, { useContext } from "react";
import { useDispatch } from "react-redux";

import "./friend-request.scss";

import { showNotification } from "../../redux/notification/notification.actions";

import { CurrentUserContext } from "../../contexts/current-user.context";

import {
	acceptFriendRequest,
	rejectFriendRequest,
} from "../../api/api.friends";

import { ReactComponent as AddFriendIcon } from "../../assets/icons/add-friend.svg";
import { ReactComponent as RemoveFriendIcon } from "../../assets/icons/remove-friend.svg";

import User from "../user/user";
import Button from "../button/button";

const FriendRequest = ({ user, removeFriendRequest }) => {
	const [
		currentUser,
		setCurrentUser,
		currentUserProfile,
		setCurrentUserProfile,
	] = useContext(CurrentUserContext);

	const dispatch = useDispatch();

	const handleAcceptButtonClick = () => {
		acceptFriendRequest(user, currentUser.token).then((data) => {
			if (data.message === "added to friends") {
				dispatch(showNotification(true, "added to friends"));
			}
		});
	};

	const handleRejectButtonClick = () => {
		rejectFriendRequest(user, currentUser.token).then((data) => {
			if (data.message === "friend request rejected") {
				dispatch(
					showNotification(true, "friend request has been deleted")
				);
			}
		});
	};

	return (
		<div className="friend-request">
			<User user={user} />
			<div className="friend-request-controls">
				<Button
					secondary
					smaller
					clickHandler={handleAcceptButtonClick}
				>
					<AddFriendIcon className="icon" /> accept
				</Button>
				<Button smaller red clickHandler={handleRejectButtonClick}>
					<RemoveFriendIcon className="icon" /> reject
				</Button>
			</div>
		</div>
	);
};

export default FriendRequest;
