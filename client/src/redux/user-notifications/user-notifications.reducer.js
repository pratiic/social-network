const INITIAL_STATE = {
	userNotifications: [],
	newNotifications: 0,
};

export const userNotificationsReducer = (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case "ADD_USER_NOTIFICATIONS":
			return { ...state, userNotifications: action.payload };
		case "SET_NEW_NOTIFICATIONS_NUMBER":
			return { ...state, newNotifications: action.payload };
		case "ADD_USER_NOTIFICATION":
			return {
				...state,
				userNotifications: [action.payload, ...state.userNotifications],
			};
		case "INCREASE_NEW_NOTIFICATIONS_NUMBER":
			return { ...state, newNotifications: state.newNotifications + 1 };
		default:
			return state;
	}
};
