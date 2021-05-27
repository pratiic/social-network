export const getNotificationMessage = (from, action, postID, type) => {
	const username = from.username;
	let notificationMessage = "prat";

	switch (action) {
		case "like":
			if (type === "post") {
				notificationMessage = `${username} liked your post`;
			} else if (type === "comment") {
				notificationMessage = `${username} liked your comment`;
			}
			break;
		case "dislike":
			if (type === "post") {
				notificationMessage = `${username} disliked your post`;
			} else if (type === "comment") {
				notificationMessage = `${username} disliked you comment`;
			}
			break;
		case "comment":
			notificationMessage = `${username} commented on your post`;
			break;
		case "send":
			notificationMessage = `${username} sent you a friend request`;
			break;
		case "accept":
			notificationMessage = `${username} accepted your friend request`;
			break;
		default:
			return null;
	}
	return notificationMessage;
};
