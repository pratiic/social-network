const baseURL = "/api/user";

export const loginOrRegister = async (type, dataToSend) => {
	const result = await fetch(`${baseURL}/${type}`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(dataToSend),
	});
	const data = await result.json();
	return data;
};

export const getUser = async (userID, token) => {
	const result = await fetch(`${baseURL}/${userID}`, {
		headers: {
			"auth-token": token,
		},
	});
	const data = await result.json();
	return data;
};

export const getAllUsers = async (token) => {
	const result = await fetch(`${baseURL}`, {
		headers: {
			"auth-token": token,
		},
	});
	const data = await result.json();
	return data;
};

export const addProfilePicture = async (formData, token) => {
	const result = await fetch(`${baseURL}/profile-picture`, {
		method: "POST",
		headers: {
			"auth-token": token,
		},
		body: formData,
	});
	const data = await result.json();
	return data;
};

export const searchUser = async (searchValue, token) => {
	const result = await fetch(`${baseURL}/search/${searchValue}`, {
		headers: {
			"auth-token": token,
		},
	});
	const data = await result.json();
	return data;
};
