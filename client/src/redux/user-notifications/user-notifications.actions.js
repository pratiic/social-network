export const addUserNotifications = (userNotifications) => {
	return {
		type: "ADD_USER_NOTIFICATIONS",
		payload: userNotifications,
	};
};

export const setNewNotificationsNumber = (newNotificationsNumber) => {
	return {
		type: "SET_NEW_NOTIFICATIONS_NUMBER",
		payload: newNotificationsNumber,
	};
};

export const addUserNotification = (userNotification) => {
	return {
		type: "ADD_USER_NOTIFICATION",
		payload: userNotification,
	};
};

export const increaseNewNotificationsNumber = () => {
	return {
		type: "INCREASE_NEW_NOTIFICATIONS_NUMBER",
	};
};
