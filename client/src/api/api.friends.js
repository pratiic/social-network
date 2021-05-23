const baseURL = "/api/friends";

export const addFriend = async (userID, token) => {
	const result = await fetch(`${baseURL}/requests/${userID}`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"auth-token": token,
		},
		body: JSON.stringify({}),
	});
	const data = await result.json();
	return data;
};

export const acceptFriendRequest = async (userID, token) => {
	const result = await fetch(`${baseURL}/${userID}`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"auth-token": token,
		},
		body: JSON.stringify({}),
	});
	const data = await result.json();
	return data;
};

export const rejectFriendRequest = async (userID, token) => {
	const result = await fetch(`${baseURL}/reject/${userID}`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"auth-token": token,
		},
		body: JSON.stringify({}),
	});
	const data = await result.json();
	return data;
};

export const removeFriend = async (userID, token) => {
	const result = await fetch(`${baseURL}/${userID}`, {
		method: "DELETE",
		headers: {
			"auth-token": token,
		},
	});
	const data = await result.json();
	return data;
};
