import React, { useContext, useEffect } from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import io from "socket.io-client";
import { useDispatch, connect } from "react-redux";

import "./app.scss";

import {
	addChat,
	addChatToTop,
	addNewMessage,
	increaseNewChatsNumber,
	setNewChatsNumber,
	setNewMessages,
} from "./redux/chat/chat.actions";
import { showNotification } from "./redux/notification/notification.actions";

import {
	CurrentUserProvider,
	CurrentUserContext,
} from "./contexts/current-user.context";

import { getNotSeenChatsNumber } from "./api/api.chats";
import { getUnseenMessages } from "./api/api.messages";

import Header from "./components/header/header";
import SignIn from "./components/sign-in/sign-in";
import Register from "./components/register/register";
import Welcome from "./components/welcome/welcome";
import ProfileAdder from "./components/profile-adder/profile-adder";
import Profile from "./components/profile/profile";
import Posts from "./components/posts/posts";
import People from "./components/people/people";
import Friends from "./components/friends/friends";
import FriendRequests from "./components/friend-requests/friend-requests";
import Notification from "./components/notification/notification";
import UserNotifications from "./components/user-notifications/user-notifications";
import PostPage from "./components/post-page/post-page";
import UserPosts from "./components/user-posts/user-posts";
import Chats from "./components/chats/chats";
import Chat from "./components/chat/chat";
import ProfilePictureAdder from "./components/profile-picture-adder/profile-picture-adder";
import Modal from "./components/modal/modal";

const App = ({ currentChatUser }) => {
	const [
		currentUser,
		setCurrentUser,
		currentUserProfile,
		setCurrentUserProfile,
	] = useContext(CurrentUserContext);

	const dispatch = useDispatch();

	useEffect(() => {
		const socket = io("https://socialnetworkawesome.herokuapp.com/");

		socket.on("profileUpdated", (data) => {
			if (currentUserProfile) {
				if (data._id === currentUserProfile._id) {
					setCurrentUserProfile({ ...data, user: currentUser });
				}
			}
		});
	}, [currentUserProfile]);

	useEffect(() => {
		const socket = io("https://socialnetworkawesome.herokuapp.com/");

		socket.on("chatAdded", (data) => {
			if (currentUser) {
				if (data.users.some((user) => user === currentUser._id)) {
					dispatch(increaseNewChatsNumber());
					dispatch(showNotification(true, "you have a new chat"));
				}
			}
		});
	}, [currentUser]);

	useEffect(() => {
		if (currentUser) {
			// getNotSeenChatsNumber(currentUser.token).then((data) => {
			// 	if (data.length > 0) {
			// 		dispatch(setNewChatsNumber(data.length));
			// 	}
			// });

			getUnseenMessages(currentUser.token).then((data) => {
				if (data.length > 0) {
					dispatch(setNewMessages(data));
				}
			});
		}
	}, [currentUser]);

	useEffect(() => {
		const socket = io("https://socialnetworkawesome.herokuapp.com/");

		socket.on("messageAdded", (data) => {
			if (currentUser) {
				if (data.to === currentUser._id) {
					if (currentChatUser) {
						if (data.user !== currentChatUser._id) {
							dispatch(addNewMessage(data));
						}
					} else {
						dispatch(addNewMessage(data));
					}
				}
			}
		});
	}, [currentUser]);

	return (
		<div className="app">
			<BrowserRouter>
				<Modal title="are you sure?" options={true} />
				<Header />
				<Notification />
				<Switch>
					<React.Fragment>
						<div className="wrapper">
							<div className="wrapper-small">
								<Route path="/" exact>
									{!currentUser ? (
										<Welcome />
									) : (
										<Redirect to="/posts" />
									)}
								</Route>
								<Route path="/signin">
									<SignIn />
								</Route>
								<Route path="/register">
									<Register />
								</Route>
								<Route path="/profile/view/:id" exact>
									{currentUserProfile ? (
										<Profile />
									) : (
										<Redirect to="/signin" />
									)}
								</Route>
								<Route path="/profile/add">
									{currentUser ? (
										<ProfileAdder />
									) : (
										<Redirect to="/signin" />
									)}
								</Route>
								<Route path="/posts" exact>
									{currentUserProfile ? (
										<Posts />
									) : (
										<Redirect to="/signin" />
									)}
								</Route>
								<Route path="/find">
									{currentUserProfile ? (
										<People />
									) : (
										<Redirect to="/signin" />
									)}
								</Route>
								<Route path="/friends/:id">
									{currentUserProfile ? (
										<Friends />
									) : (
										<Redirect to="/signin" />
									)}
								</Route>
								<Route path="/friend-requests">
									{currentUserProfile ? (
										<FriendRequests />
									) : (
										<Redirect to="/signin" />
									)}
								</Route>
								<Route path="/notifications">
									{currentUserProfile ? (
										<UserNotifications />
									) : (
										<Redirect to="/signin" />
									)}
								</Route>
								<Route path="/post/:id">
									{currentUserProfile ? (
										<PostPage />
									) : (
										<Redirect to="/signin" />
									)}
								</Route>
								<Route path="/posts/user/:id">
									{currentUserProfile ? (
										<UserPosts />
									) : (
										<Redirect to="/signin" />
									)}
								</Route>
								<Route path="/profile/edit">
									{currentUserProfile ? (
										<ProfileAdder />
									) : (
										<Redirect to="/signin" />
									)}
								</Route>
								<Route path="/chats" exact>
									{currentUserProfile ? (
										<Chats />
									) : (
										<Redirect to="/signin" />
									)}
								</Route>
							</div>
							<Route path="/profile-picture/add">
								{currentUserProfile ? (
									<ProfilePictureAdder />
								) : null}
							</Route>
							<Route path="/profile-picture/change">
								{currentUserProfile ? (
									<ProfilePictureAdder />
								) : (
									<Redirect to="/signin" />
								)}
							</Route>
						</div>
						<div className="wrapper-medium">
							<Route path="/chats/:id">
								{currentUserProfile ? (
									<Chat />
								) : (
									<Redirect to="/signin" />
								)}
							</Route>
						</div>
					</React.Fragment>
				</Switch>
			</BrowserRouter>
		</div>
	);
};

const mapStateToProps = (state) => {
	return {
		currentChatUser: state.chat.currentChatUser,
	};
};

export default connect(mapStateToProps)(App);
