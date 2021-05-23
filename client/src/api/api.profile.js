const baseURL = "http://localhost:5000/api/profile";

export const getProfile = async (userID, token) => {
	const result = await fetch(`${baseURL}/${userID}`, {
		headers: {
			"auth-token": token,
		},
	});
	const data = await result.json();
	return data;
};

export const addProfile = async (edit, profile, token) => {
	const method = edit ? "PUT" : "POST";

	const result = await fetch(`${baseURL}`, {
		method: method,
		headers: {
			"Content-Type": "application/json",
			"auth-token": token,
		},
		body: JSON.stringify(profile),
	});
	const data = await result.json();
	return data;
};
