const INITIAL_STATE = {
	userNotifications: [],
	newNotifications: 0,
	clearedAllNotifications: false,
};

export const userNotificationsReducer = (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case "ADD_USER_NOTIFICATIONS":
			return {
				...state,
				userNotifications: action.payload,
				clearedAllNotifications: false,
			};
		case "SET_NEW_NOTIFICATIONS_NUMBER":
			return { ...state, newNotifications: action.payload };
		case "ADD_USER_NOTIFICATION":
			return {
				...state,
				userNotifications: !state.userNotifications.some(
					(userNotification) =>
						userNotification._id === action.payload._id
				)
					? [action.payload, ...state.userNotifications]
					: state.userNotifications,
				clearedAllNotifications: false,
			};
		case "INCREASE_NEW_NOTIFICATIONS_NUMBER":
			return { ...state, newNotifications: state.newNotifications + 1 };
		case "CLEAR_ALL_NOTIFICATIONS":
			return {
				...state,
				userNotifications: [],
				clearedAllNotifications: true,
			};
		default:
			return state;
	}
};
