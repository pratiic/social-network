export const setCurrentChatUser = (currentChatUser) => {
	return {
		type: "SET_CURRENT_CHAT_USER",
		payload: currentChatUser,
	};
};

export const addMessages = (messages) => {
	return {
		type: "ADD_MESSAGES",
		payload: messages,
	};
};

export const addMessage = (message) => {
	return {
		type: "ADD_MESSAGE",
		payload: message,
	};
};

export const setChatID = (chatID) => {
	return {
		type: "SET_CHAT_ID",
		payload: chatID,
	};
};

export const addChats = (chats) => {
	return {
		type: "ADD_CHATS",
		payload: chats,
	};
};

export const addChat = (chat) => {
	return {
		type: "ADD_CHAT",
		payload: chat,
	};
};

export const resetChat = () => {
	return {
		type: "RESET_CHAT",
	};
};

export const setNewChatsNumber = (newChatsNumber) => {
	return {
		type: "SET_NEW_CHATS_NUMBER",
		payload: newChatsNumber,
	};
};

export const increaseNewChatsNumber = () => {
	return {
		type: "INCREASE_NEW_CHATS_NUMBER",
	};
};

export const updateMessage = (message) => {
	return {
		type: "UPDATE_MESSAGE",
		payload: message,
	};
};

export const setNewMessages = (newMessages) => {
	return {
		type: "SET_NEW_MESSAGES",
		payload: newMessages,
	};
};

export const addNewMessage = (newMessage) => {
	return {
		type: "ADD_NEW_MESSAGE",
		payload: newMessage,
	};
};

export const deleteNewMessages = (chatID) => {
	return {
		type: "DELETE_NEW_MESSAGES",
		payload: chatID,
	};
};

export const addChatToTop = (chatID) => {
	return {
		type: "ADD_CHAT_TO_TOP",
		payload: chatID,
	};
};
