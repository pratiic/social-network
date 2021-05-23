const baseURL = "/api/comments";

export const addComment = async (postID, comment, token) => {
	const commentToAdd = JSON.stringify(comment);
	console.log(commentToAdd);

	const result = await fetch(`${baseURL}/${postID}`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"auth-token": token,
		},
		body: commentToAdd,
	});
	const data = await result.json();
	return data;
};

export const getComments = async (postID, token) => {
	const result = await fetch(`${baseURL}/${postID}`, {
		headers: {
			"auth-token": token,
		},
	});
	const data = await result.json();
	return data;
};

export const likeOrDislikeComment = async (type, commentID, token) => {
	const result = await fetch(
		`${baseURL}/${commentID}/${type === "like" ? "likes" : "dislikes"}`,
		{
			method: "PUT",
			headers: {
				"auth-token": token,
			},
		}
	);
	const data = await result.json();
	return data;
};

export const deleteOrEditComment = async (type, commentID, update, token) => {
	const method = type === "delete" ? "DELETE" : "PUT";

	const result = await fetch(`${baseURL}/${commentID}`, {
		method: method,
		headers: {
			"Content-Type": "application/json",
			"auth-token": token,
		},
		body: type === "delete" ? null : JSON.stringify(update),
	});
	const data = await result.json();
	return data;
};
