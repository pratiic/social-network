import { createSelector } from "reselect";

export const postsReducerSelector = (state) => state.posts;

export const postsSelector = createSelector(
	[postsReducerSelector],
	(posts) => posts.posts
);
