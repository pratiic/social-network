const INITIAL_STATE = {
	showNotification: false,
	notificationText: "",
	successTypeNotification: true,
};

export const notificationReducer = (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case "SHOW_NOTIFICATION":
			return {
				...state,
				showNotification: true,
				notificationText: action.payload.text,
				successTypeNotification: action.payload.success,
			};
		case "HIDE_NOTIFICATION":
			return {
				...state,
				showNotification: false,
				notificationText: "",
				successTypeNotification: true,
			};
		default:
			return state;
	}
};
