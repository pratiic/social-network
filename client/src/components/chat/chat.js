import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, connect } from "react-redux";
import io from "socket.io-client";

import "./chat.scss";

import {
	addMessages,
	deleteNewMessages,
	resetChat,
	setChatID,
} from "../../redux/chat/chat.actions";

import { CurrentUserContext } from "../../contexts/current-user.context";

import { getChatID, createChat } from "../../api/api.chats";
import { getMessages, createMessage } from "../../api/api.messages";

import MessagesContainer from "../messages-container/messages-container";
import InputBox from "../input-box/input-box";
import ChatHeader from "../chat-header/chat-header";

const Chat = ({ messages, chatID, currentChatUser }) => {
	const [messagesMessage, setMessagesMessage] = useState("");
	const [socket, setSocket] = useState(null);
	const [friends, setFriends] = useState(true);

	const [
		currentUser,
		setCurrentUser,
		currentUserProfile,
		setCurrentUserProfile,
	] = useContext(CurrentUserContext);

	const params = useParams();

	const dispatch = useDispatch();

	useEffect(() => {
		setMessagesMessage("loading...");

		getChatID(params.id, currentUser.token).then((data) => {
			dispatch(setChatID(data.chatID));
		});

		if (
			!currentUserProfile.friends.some(
				(friend) => friend == currentChatUser._id
			)
		) {
			setFriends(false);
		}

		return () => {
			dispatch(resetChat());
			emitNotTypingEvent();
		};
	}, []);

	useEffect(() => {
		if (chatID) {
			getMessages(chatID, currentUser.token).then((data) => {
				if (data.error === "messages not found") {
					return setMessagesMessage("messages not found");
				}

				dispatch(addMessages(data));
			});
		}

		return () => {
			if (chatID) {
				dispatch(deleteNewMessages(chatID));
			}
		};
	}, [chatID]);

	useEffect(() => {
		setSocket(io("/"));
	}, []);

	const handleFormSubmit = (event, message) => {
		event.preventDefault();

		emitNotTypingEvent();

		if (messages.length === 0) {
			return createChat(
				chatID,
				{
					users: [currentUser._id, params.id],
					notSeenBy: [currentUser._id, params.id],
				},
				currentUser.token
			).then((data) => {
				if (!data.error) {
					addMessage(message);
				}
			});
		}

		addMessage(message);
	};

	const addMessage = (message) => {
		console.log(chatID);
		createMessage(
			chatID,
			{ text: message, to: currentChatUser._id },
			currentUser.token
		).then((data) => {
			console.log(data);
		});
	};

	const handleInputChange = (event) => {
		if (event.target.value.length > 0) {
			socket.emit("typing", { userID: currentUser._id });
		} else {
			emitNotTypingEvent();
		}
	};

	const emitNotTypingEvent = () => {
		if (socket) {
			console.log("pratiic");
			socket.emit("not-typing", { userID: currentUser._id });
		}
	};

	return (
		<div className="chat">
			<ChatHeader />
			<MessagesContainer
				messages={messages}
				messagesMessage={messagesMessage}
			/>
			{friends ? (
				<InputBox
					placeholder="write a message..."
					formSubmitHandler={handleFormSubmit}
					changeHandler={handleInputChange}
				/>
			) : (
				<div className="user-not-available text-smaller">
					you cannot chat with this user anymore
				</div>
			)}
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

export default connect(mapStateToProps)(Chat);
