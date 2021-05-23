const baseURL = "http://localhost:5000/api/chats";

export const createChat = async (chatID, chat, token) => {
	const result = await fetch(`${baseURL}/${chatID}`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"auth-token": token,
		},
		body: JSON.stringify(chat),
	});
	const data = await result.json();
	return data;
};

export const getChats = async (token) => {
	const result = await fetch(`${baseURL}`, {
		headers: {
			"auth-token": token,
		},
	});
	const data = await result.json();
	return data;
};

export const getChatID = async (chatUserID, token) => {
	const result = await fetch(`${baseURL}/chatID/${chatUserID}`, {
		headers: {
			"auth-token": token,
		},
	});
	const data = await result.json();
	return data;
};

export const getNotSeenChatsNumber = async (token) => {
	const result = await fetch(`${baseURL}/unseen`, {
		headers: {
			"auth-token": token,
		},
	});
	const data = await result.json();
	return data;
};

export const setChatsSeen = async (token) => {
	const result = await fetch(`${baseURL}/unseen`, {
		method: "PUT",
		headers: {
			"auth-token": token,
		},
	});
	const data = await result.json();
	return data;
};
