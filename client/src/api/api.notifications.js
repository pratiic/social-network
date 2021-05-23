const baseURL = "http://localhost:5000/api/notifications";

export const getNotifications = async (token) => {
	const result = await fetch(`${baseURL}`, {
		headers: {
			"auth-token": token,
		},
	});
	const data = await result.json();
	return data;
};

export const getNotificationsNumber = async (token) => {
	const result = await fetch(`${baseURL}/number`, {
		headers: {
			"auth-token": token,
		},
	});
	const data = await result.json();
	return data;
};

export const updateNotifications = async (token) => {
	const result = await fetch(`${baseURL}`, {
		method: "PUT",
		headers: {
			"auth-token": token,
		},
	});
	const data = await result.json();
	return data;
};

export const deleteNotification = async (notificationID, token) => {
	const result = await fetch(`${baseURL}/${notificationID}`, {
		method: "DELETE",
		headers: {
			"auth-token": token,
		},
	});
	const data = await result.json();
	return data;
};
