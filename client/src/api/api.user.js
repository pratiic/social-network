export const loginOrRegister = async (type, dataToSend) => {
	const result = await fetch(`http://localhost:5000/api/user/${type}`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(dataToSend),
	});
	const data = await result.json();
	return data;
};
