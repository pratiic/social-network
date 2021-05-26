import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { connect, useDispatch } from "react-redux";

import { addPosts } from "../../redux/posts/posts.actions";

import { CurrentUserContext } from "../../contexts/current-user.context";

import { getUserPosts } from "../../api/api.posts";

import { ReactComponent as NoPostsHuman } from "../../assets/humans/no-posts.svg";

import Post from "../post/post";
import PageTitle from "../page-title/page-title";

const UserPosts = ({ currentlyViewedProfile, userPosts }) => {
	const [userPostsMessage, setUserPostsMessage] = useState("");

	const [currentUser, setCurrentUser] = useContext(CurrentUserContext);

	const params = useParams();

	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(addPosts([]));

		setUserPostsMessage("loading posts...");

		getUserPosts(params.id, currentUser.token).then((data) => {
			if (!data.error) {
				dispatch(addPosts(data));
				setUserPostsMessage("");
				return;
			}

			setUserPostsMessage("no posts found");
		});

		return () => {
			dispatch(addPosts([]));
		};
	}, []);

	return (
		<div className="posts-page">
			<PageTitle
				title={
					params.id == currentUser._id
						? "your posts"
						: `${currentlyViewedProfile.user.username}'s posts`
				}
			/>
			{userPosts.length > 0 ? (
				userPosts.map((userPost) => {
					return <Post {...userPost} />;
				})
			) : userPostsMessage === "loading posts..." ? (
				<p className="info-message text-small">{userPostsMessage}</p>
			) : (
				<NoPostsHuman className="human" />
			)}
		</div>
	);
};

const mapStateToProps = (state) => {
	return {
		currentlyViewedProfile: state.profile.currentlyViewedProfile,
		userPosts: state.posts.posts,
	};
};

export default connect(mapStateToProps)(UserPosts);
