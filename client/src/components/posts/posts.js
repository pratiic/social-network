import React, { useState, useEffect, useContext, memo } from "react";
import { connect, useDispatch } from "react-redux";
import io from "socket.io-client";

import "./posts.scss";

import { showNotification } from "../../redux/notification/notification.actions";

import {
	addPost,
	addPosts,
	deletePost,
	updatePost,
} from "../../redux/posts/posts.actions";
import { postsSelector } from "../../redux/posts/posts.selectors";
import {
	addUserNotification,
	increaseNewNotificationsNumber,
	setNewNotificationsNumber,
} from "../../redux/user-notifications/user-notifications.actions";

import { CurrentUserContext } from "../../contexts/current-user.context";

import { getPosts } from "../../api/api.posts";
import { getNotificationsNumber } from "../../api/api.notifications";
import { getUser } from "../../api/api.user";
import { getNotificationMessage } from "../utils/utils.notifications";

import { ReactComponent as ReloadIcon } from "../../assets/icons/reload.svg";
import { ReactComponent as NoFriendsPostsHuman } from "../../assets/humans/no-friends-posts.svg";
import { ReactComponent as NoPostsHuman } from "../../assets/humans/no-posts.svg";

import PostCreator from "../post-creator/post-creator";
import Post from "../post/post";
import Alert from "../alert/alert";
import Reload from "../reload/reload";
import Button from "../button/button";

const Posts = ({ posts, newNotifications }) => {
	const [postsMessage, setPostsMessage] = useState("");
	const [showAlert, setShowAlert] = useState(false);
	const [showReload, setShowReload] = useState(false);

	const [
		currentUser,
		setCurrentUser,
		currentUserProfile,
		setCurrentUserProfile,
	] = useContext(CurrentUserContext);

	const dispatch = useDispatch();

	useEffect(() => {
		const socket = io("http://socialnetworkawesome.herokuapp.com/");

		socket.on("postLikedOrDisliked", (data) => {
			dispatch(updatePost(data));
		});

		socket.on("postAdded", (data) => {
			console.log(data);

			if (
				data.user != currentUser._id &&
				data.for.some((dataItem) => dataItem == currentUser._id)
			) {
				setShowAlert(true);
				setShowReload(true);
			}
		});

		socket.on("postDeleted", (data) => {
			console.log(data);
			dispatch(deletePost(data));
		});

		fetchPosts();
	}, []);

	useEffect(() => {
		const socket = io("http://socialnetworkawesome.herokuapp.com/");

		socket.on("notificationAdded", (notification) => {
			if (notification.to == currentUser._id) {
				getUser(notification.from, currentUser.token).then((data) => {
					if (!data.error) {
						dispatch(addUserNotification({ ...data, user: data }));
						// dispatch(increaseNewNotificationsNumber());
						fetchNewNotificationsNumber();
						dispatch(
							showNotification(
								null,
								getNotificationMessage(
									data,
									notification.action,
									notification.postID,
									notification.type
								)
							)
						);
					}
				});
			}
		});

		fetchNewNotificationsNumber();
	}, []);

	useEffect(() => {
		return () => {
			dispatch(addPosts([]));
		};
	}, []);

	const fetchNewNotificationsNumber = () => {
		getNotificationsNumber(currentUser.token).then((data) => {
			if (!data.error) {
				dispatch(setNewNotificationsNumber(data.length));
			}
		});
	};

	const fetchPosts = () => {
		setShowAlert(false);
		setShowReload(false);
		setPostsMessage("loading posts...");
		getPosts(currentUser.token).then((data) => {
			if (data.error) {
				if (currentUserProfile.friends.length === 0) {
					return setPostsMessage(
						"you have no friends, add friends to view posts"
					);
				}
				return setPostsMessage("no posts found");
			}

			setPostsMessage("");
			dispatch(addPosts(data));
		});
	};

	const hideAlert = () => {
		setShowAlert(false);
	};

	return (
		<div className="posts">
			<PostCreator />
			{showAlert ? (
				<Alert text="new posts available" clickHandler={hideAlert} />
			) : null}
			{showReload ? (
				<Reload text="new posts" clickHandler={fetchPosts} />
			) : null}
			{posts.length > 0 ? (
				posts.map((post) => {
					return <Post {...post} key={post._id} />;
				})
			) : postsMessage === "loading posts..." ? (
				<p className="info-message text-small">{postsMessage}</p>
			) : currentUserProfile.friends.length === 0 ? (
				<NoFriendsPostsHuman className="human" />
			) : (
				<NoPostsHuman className="human" />
			)}
		</div>
	);
};

const mapStateToProps = (state) => {
	return {
		posts: postsSelector(state),
		newNotifications: state.userNotifications.newNotifications,
	};
};

export default connect(mapStateToProps)(Posts);
