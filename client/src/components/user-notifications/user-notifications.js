import React, { useEffect, useContext, useState } from "react";
import { useDispatch, connect } from "react-redux";

import "./user-notifications.scss";

import {
	addUserNotifications,
	clearAllNotifications,
	setNewNotificationsNumber,
} from "../../redux/user-notifications/user-notifications.actions";
import { hideModal, showModal } from "../../redux/modal/modal.actions";

import { CurrentUserContext } from "../../contexts/current-user.context";

import {
	getNotifications,
	updateNotifications,
	deleteAllNotifications,
} from "../../api/api.notifications";

import { ReactComponent as NoNotificationsHuman } from "../../assets/humans/no-notifications.svg";

import UserNotification from "../user-notification/user-notification";
import PageTitle from "../page-title/page-title";

const UserNotifications = ({ userNotifications, clearedAllNotifications }) => {
	const [currentUser, setCurrentUser] = useContext(CurrentUserContext);
	const [userNotificationsMessage, setUserNotificationsMessage] =
		useState("");

	const dispatch = useDispatch();

	useEffect(() => {
		setUserNotificationsMessage("loading notifications...");

		getNotifications(currentUser.token).then((data) => {
			setUserNotificationsMessage("");

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

	const handleClearAllClick = () => {
		dispatch(showModal("deleting all notifications..."));
		deleteAllNotifications(currentUser.token).then((data) => {
			dispatch(hideModal());
			if (data.message === "deleted") {
				dispatch(clearAllNotifications());
			}
		});
	};

	return (
		<div className="user-notifications">
			<div
				className={`user-notifications-header ${
					userNotifications.length > 0 ? "space" : "no-space"
				}`}
			>
				<PageTitle title="your notifications" />
				{userNotifications.length > 0 ? (
					<p
						className="user-notifications-clear text-small"
						onClick={handleClearAllClick}
					>
						clear all
					</p>
				) : null}
			</div>

			{clearedAllNotifications ? (
				<NoNotificationsHuman className="human" />
			) : userNotifications.length > 0 ? (
				userNotifications.map((userNotification) => {
					return (
						<UserNotification
							{...userNotification}
							key={userNotification._id}
						/>
					);
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
		clearedAllNotifications:
			state.userNotifications.clearedAllNotifications,
	};
};

export default connect(mapStateToProps)(UserNotifications);
