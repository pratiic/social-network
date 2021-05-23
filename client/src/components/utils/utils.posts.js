export const likedOrDislikedOrNot = (arr, element) => {
	return arr.some((arrItem) => arrItem.user === element._id);
};
