export const displayNotification = (notificationType, notificationText) => {
	return {
		type: "SHOW_NOTIFICATION",
		payload: { text: notificationText, success: notificationType },
	};
};

export const hideNotification = () => {
	return {
		type: "HIDE_NOTIFICATION",
	};
};

export const showNotification = (notificationType, notificationText) => {
	return (dispatch) => {
		dispatch(displayNotification(notificationType, notificationText));

		setTimeout(() => {
			dispatch(hideNotification());
		}, 2500);
	};
};
