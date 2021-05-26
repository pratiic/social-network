import React, { useContext } from "react";
import { useDispatch, connect } from "react-redux";
import { useHistory } from "react-router-dom";

import "./user-notification.scss";

import { showNotification } from "../../redux/notification/notification.actions";

import { CurrentUserContext } from "../../contexts/current-user.context";

import { getNotificationMessage } from "../utils/utils.notifications";
import { deleteNotification } from "../../api/api.notifications";
import { getHowLong } from "../utils/utils.date-and-time";

import { ReactComponent as ClearIcon } from "../../assets/icons/clear.svg";

import ProfilePicture from "../profile-picture/profile-picture";
import { addUserNotifications } from "../../redux/user-notifications/user-notifications.actions";

const UserNotification = ({
	from,
	action,
	postID,
	type,
	seen,
	_id,
	createdAt,
	userNotifications,
}) => {
	const [currentUser, setCurrentUser] = useContext(CurrentUserContext);

	const dispatch = useDispatch();

	const history = useHistory();

	const handleDeleteIconClick = () => {
		deleteNotification(_id, currentUser.token).then((data) => {
			if (data.message === "deleted") {
				dispatch(
					addUserNotifications(
						userNotifications.filter((userNotification) => {
							return userNotification._id != _id;
						})
					)
				);
				dispatch(
					showNotification(true, "notification has been deleted")
				);
			}
		});
	};

	const handleUserNotificationClick = () => {
		if (type === "post" || type === "comment") {
			history.push(`/post/${postID}`);
		} else if (type === "user") {
			if (action === "send") {
				history.push("/friend-requests");
			} else {
				history.push(`/friends/${currentUser._id}`);
			}
		}
	};

	return (
		<div
			className={`user-notification ${seen ? "seen" : "not-seen"} ${
				!from ? "deleted-notification" : null
			} `}
		>
			{from ? (
				<React.Fragment>
					<div
						className="notification-info"
						onClick={handleUserNotificationClick}
					>
						<ProfilePicture
							profilePictureURL={from.profilePictureURL}
							profilePicture={from.profilePicture}
							id={from._id}
						/>
						<div className="user-notification-text text-small">
							{getNotificationMessage(from, action, postID, type)}{" "}
							<p className="time-duration">
								{getHowLong(createdAt)}
							</p>
						</div>
					</div>
					<ClearIcon
						className="icon"
						onClick={handleDeleteIconClick}
					/>
				</React.Fragment>
			) : (
				<React.Fragment>
					<div className="deleted-notification text-smaller">
						the user who created this notification has been deleted
					</div>
					<ClearIcon
						className="icon"
						onClick={handleDeleteIconClick}
					/>
				</React.Fragment>
			)}
		</div>
	);
};

const mapStateToProps = (state) => {
	return {
		userNotifications: state.userNotifications.userNotifications,
	};
};

export default connect(mapStateToProps)(UserNotification);
