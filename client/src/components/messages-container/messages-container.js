import React, { useState, useEffect, useRef, useContext } from "react";
import { connect, useDispatch } from "react-redux";
import io from "socket.io-client";

import "./messages-container.scss";

import { addMessage, updateMessage } from "../../redux/chat/chat.actions";

import { CurrentUserContext } from "../../contexts/current-user.context";

import { setMessagesSeen } from "../../api/api.messages";

import { ReactComponent as NoMessagesHuman } from "../../assets/humans/no-messages.svg";

import Message from "../message/message";
import ProfilePicture from "../profile-picture/profile-picture";

const MessagesContainer = ({
	messages,
	messagesMessage,
	chatID,
	currentChatUser,
}) => {
	const [typing, setTyping] = useState(false);

	const [currentUser, setCurrentUser] = useContext(CurrentUserContext);

	const dispatch = useDispatch();

	const bottomDivRef = useRef();

	useEffect(() => {
		const socket = io("http://socialnetworkawesome.herokuapp.com/");

		socket.on(
			"messageAdded",
			(data) => {
				if (chatID) {
					console.log(chatID);
					console.log(data);
					if (data.chat == chatID) {
						dispatch(addMessage(data));
					}
				}
			},
			[chatID]
		);

		socket.on("messageUpdated", (data) => {
			if (data.chat == chatID) {
				dispatch(updateMessage(data));
			}
		});

		socket.on("typing", (data) => {
			if (data.userID == currentChatUser._id) {
				setTyping(true);
			}
		});

		socket.on("not-typing", (data) => {
			if (data.userID == currentChatUser._id) {
				setTyping(false);
			}
		});

		return () => {
			socket.close();
		};
	}, [chatID]);

	useEffect(() => {
		if (bottomDivRef.current) {
			bottomDivRef.current.scrollIntoView();
		}

		setMessagesSeen(chatID, currentChatUser._id, currentUser.token).then(
			(data) => {
				console.log(data);
			}
		);
	}, [messages]);

	return (
		<div className="messages-container">
			{messages.length > 0 ? (
				messages.map((message) => {
					return <Message {...message} />;
				})
			) : messagesMessage === "messages not found" ? (
				<NoMessagesHuman className="human" />
			) : (
				<p className="info-message text-small">{messagesMessage}</p>
			)}
			{typing ? (
				<div className="user-typing">
					{" "}
					<ProfilePicture
						profilePictureURL={currentChatUser.profilePictureURL}
						size="smallest"
					/>{" "}
					<p className="text text-smaller">typing...</p>
				</div>
			) : null}{" "}
			<div className="bottom" ref={bottomDivRef}></div>
		</div>
	);
};

const mapStateToProps = (state) => {
	return {
		messages: state.chat.messages,
		chatID: state.chat.chatID,
		currentChatUser: state.chat.currentChatUser,
	};
};

export default connect(mapStateToProps)(MessagesContainer);
