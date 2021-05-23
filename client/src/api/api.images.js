const baseURL = "/api/images";

export const addProfilePicture = async (formData, token) => {
	const result = await fetch(`${baseURL}/user`, {
		method: "POST",
		headers: {
			"auth-token": token,
		},
		body: formData,
	});
	const data = await result.json();
	return data;
};
