const INITIAL_STATE = {
	currentChatUser: null,
	messages: [],
	chatID: "",
	chats: [],
	newChats: 0,
	newMessages: [],
};

export const chatReducer = (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case "SET_CURRENT_CHAT_USER":
			return {
				...state,
				currentChatUser: action.payload,
			};
		case "ADD_MESSAGES":
			return {
				...state,
				messages: action.payload,
			};
		case "ADD_MESSAGE":
			return {
				...state,
				messages: [...state.messages, action.payload],
			};
		case "SET_CHAT_ID":
			return {
				...state,
				chatID: action.payload,
			};
		case "ADD_CHATS":
			return {
				...state,
				chats: action.payload,
			};
		case "ADD_CHAT":
			return {
				...state,
				// chats: state.chats.some(
				// 	(chat) => chat._id == action.payload._id
				// )
				// 	? state.chats
				// 	: [action.payload, ...state.chats],
				chats: [action.payload, ...state.chats],
			};
		case "RESET_CHAT":
			return {
				...state,
				currentChatUser: null,
				messages: [],
				chatID: "",
				chats: [],
			};
		case "SET_NEW_CHATS_NUMBER":
			return {
				...state,
				newChats: action.payload,
			};
		case "INCREASE_NEW_CHATS_NUMBER":
			return {
				...state,
				newChats: state.newChats + 1,
			};
		case "UPDATE_MESSAGE":
			return {
				...state,
				messages: state.messages.map((message) => {
					if (message._id === action.payload._id) {
						return { ...message, ...action.payload };
					}

					return message;
				}),
			};
		case "SET_NEW_MESSAGES":
			return {
				...state,
				newMessages: action.payload,
			};
		case "ADD_NEW_MESSAGE":
			return {
				...state,
				newMessages: [action.payload, ...state.newMessages],
			};
		case "DELETE_NEW_MESSAGES":
			return {
				...state,
				newMessages: state.newMessages.filter(
					(newMessage) => newMessage.chat !== action.payload
				),
			};
		case "ADD_CHAT_TO_TOP":
			return {
				...state,
				chats: addChatToTop(action.payload, state.chats),
			};
		default:
			return state;
	}
};

const addChatToTop = (chatID, chats) => {
	const chat = chats.find((chat) => chat._id === chatID);
	const updatedChats = [chat, ...chats.filter((chat) => chat._id !== chatID)];
	return updatedChats;
};
