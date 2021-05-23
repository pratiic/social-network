import React, { useEffect, useContext, useState } from "react";
import { useDispatch, connect } from "react-redux";

import {
	addUserNotifications,
	setNewNotificationsNumber,
} from "../../redux/user-notifications/user-notifications.actions";

import { CurrentUserContext } from "../../contexts/current-user.context";

import {
	getNotifications,
	updateNotifications,
} from "../../api/api.notifications";

import { ReactComponent as NoNotificationsHuman } from "../../assets/humans/no-notifications.svg";

import UserNotification from "../user-notification/user-notification";
import PageTitle from "../page-title/page-title";

const UserNotifications = ({ userNotifications }) => {
	const [currentUser, setCurrentUser] = useContext(CurrentUserContext);
	const [userNotificationsMessage, setUserNotificationsMessage] =
		useState("");

	const dispatch = useDispatch();

	useEffect(() => {
		setUserNotificationsMessage("loading notifications...");

		getNotifications(currentUser.token).then((data) => {
			if (!data.error) {
				dispatch(addUserNotifications(data));

				updateNotifications(currentUser.token).then((data) => {
					if (data.message === "updated") {
						dispatch(setNewNotificationsNumber(0));
					}
				});
			} else {
				setUserNotificationsMessage("notifications not found");
			}
		});
	}, []);

	return (
		<div className="user-notifications">
			<PageTitle title="your notifications" />

			{userNotifications.length > 0 ? (
				userNotifications.map((userNotification) => {
					return <UserNotification {...userNotification} />;
				})
			) : userNotificationsMessage === "loading notifications..." ? (
				<p className="info-message text-small">
					{userNotificationsMessage}
				</p>
			) : (
				<NoNotificationsHuman className="human" />
			)}
		</div>
	);
};

const mapStateToProps = (state) => {
	return {
		userNotifications: state.userNotifications.userNotifications,
	};
};

export default connect(mapStateToProps)(UserNotifications);
