const baseURL = "/api/messages";

export const createMessage = async (chatID, message, token) => {
	const result = await fetch(`${baseURL}/${chatID}`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"auth-token": token,
		},
		body: JSON.stringify(message),
	});
	const data = await result.json();
	return data;
};

export const getMessages = async (chatID, token) => {
	const result = await fetch(`${baseURL}/${chatID}`, {
		headers: {
			"auth-token": token,
		},
	});
	const data = await result.json();
	return data;
};

export const setMessagesSeen = async (chatID, user, token) => {
	const result = await fetch(`${baseURL}/seen/${chatID}`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
			"auth-token": token,
		},
		body: JSON.stringify({ user: user }),
	});
	const data = await result.json();
	return data;
};

export const getUnseenMessages = async (token) => {
	const result = await fetch(`${baseURL}/unseen/all`, {
		headers: {
			"auth-token": token,
		},
	});
	const data = await result.json();
	return data;
};
