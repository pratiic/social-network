const baseURL = "/api";

export const getPosts = async (token) => {
	const result = await fetch(`${baseURL}/posts`, {
		headers: {
			"auth-token": token,
		},
	});
	const data = await result.json();
	return data;
};

export const createPost = async (type, post, token) => {
	const headers =
		type === "text" ? { "Content-Type": "application/json" } : {};

	const result = await fetch(`${baseURL}/posts`, {
		method: "POST",
		headers: {
			...headers,
			"auth-token": token,
		},
		body: type === "text" ? JSON.stringify(post) : post,
	});
	const data = await result.json();
	return data;
};

export const likeOrDislikePost = async (type, postID, token) => {
	const result = await fetch(
		`${baseURL}/posts/${postID}/${type === "like" ? "likes" : "dislikes"}`,
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

export const editOrDeletePost = async (type, postID, editedPost, token) => {
	const method = type === "delete" ? "delete" : "put";

	const result = await fetch(`${baseURL}/posts/${postID}`, {
		method: method,
		headers: {
			"Content-Type": "application/json",
			"auth-token": token,
		},
		body: type === "edit" ? JSON.stringify(editedPost) : null,
	});
	const data = await result.json();
	return data;
};

export const getUserPosts = async (userID, token) => {
	const result = await fetch(`${baseURL}/posts/${userID}`, {
		headers: {
			"auth-token": token,
		},
	});
	const data = await result.json();
	return data;
};

export const getPost = async (postID, token) => {
	const result = await fetch(`${baseURL}/posts/post/${postID}`, {
		headers: {
			"auth-token": token,
		},
	});
	const data = await result.json();
	return data;
};
