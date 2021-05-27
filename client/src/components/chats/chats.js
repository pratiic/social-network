import React, { useState, useEffect, useContext } from "react";
import { useDispatch, connect } from "react-redux";
import { useHistory } from "react-router-dom";

import {
	addChats,
	setCurrentChatUser,
	setNewChatsNumber,
} from "../../redux/chat/chat.actions";

import { CurrentUserContext } from "../../contexts/current-user.context";

import { getChats, setChatsSeen } from "../../api/api.chats";

import { ReactComponent as NoChatsHuman } from "../../assets/humans/no-chats.svg";

import PageTitle from "../page-title/page-title";
import User from "../user/user";
import Alert from "../alert/alert";
import Reload from "../reload/reload";

const Chats = ({ chats, newChats, newMessages }) => {
	const [chatsMessage, setChatsMessage] = useState("");
	const [showAlert, setShowAlert] = useState(false);
	const [showReload, setShowReload] = useState(false);

	const [currentUser, setCurrentUser] = useContext(CurrentUserContext);

	const dispatch = useDispatch();

	const history = useHistory();

	useEffect(() => {
		dispatch(setNewChatsNumber(0));

		fetchChats();
	}, []);

	useEffect(() => {
		if (newChats) {
			setShowAlert(true);
			setShowReload(true);
		} else {
			setShowAlert(false);
			setShowReload(false);
		}
	}, [newChats]);

	const getOtherUser = (chat) => {
		const user = chat.users.find((user) => {
			if (user.username) {
				return user._id != currentUser._id;
			}

			return user != currentUser._id;
		});
		return user;
	};

	const handleUserClick = (user) => {
		dispatch(setCurrentChatUser(user));
		history.push(`/chats/${user._id}`);
	};

	const fetchChats = () => {
		setChatsMessage("loading chats...");
		dispatch(addChats([]));
		setShowAlert(false);
		setShowReload(false);
		getChats(currentUser.token).then((data) => {
			if (data.error) {
				return setChatsMessage("chats not found");
			}
			dispatch(addChats(data));
			setChatsMessage("");
		});
	};

	const hideAlert = () => {
		setShowAlert(false);
	};

	return (
		<div className="chats">
			<PageTitle title="your chats" />
			{showAlert ? (
				<Alert text="new chats available" clickHandler={hideAlert} />
			) : null}
			{showReload ? (
				<Reload text="new chats" clickHandler={fetchChats} />
			) : null}
			{chats.length > 0 ? (
				chats.map((chat) => {
					return (
						<User
							user={getOtherUser(chat)}
							count={
								newMessages.filter(
									(newMessage) => newMessage.chat === chat._id
								).length
							}
							clickHandler={handleUserClick}
						/>
					);
				})
			) : chatsMessage === "loading chats..." ? (
				<p className="info-message text-small">{chatsMessage}</p>
			) : (
				<NoChatsHuman className="human" />
			)}
		</div>
	);
};

const mapStateToProps = (state) => {
	return {
		chats: state.chat.chats,
		newChats: state.chat.newChats,
		newMessages: state.chat.newMessages,
	};
};

export default connect(mapStateToProps)(Chats);
