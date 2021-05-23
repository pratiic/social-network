const INITIAL_STATE = {
	showNavbar: false,
};

export const navbarReducer = (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case "TOGGLE_NAVBAR":
			return {
				...state,
				showNavbar: !state.showNavbar,
			};
		default:
			return state;
	}
};
