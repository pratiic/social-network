const INITIAL_STATE = {
	showModal: false,
	modalTitle: "",
	modalConfirmationHandler: null,
};

export const modalReducer = (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case "SHOW_MODAL":
			return {
				...state,
				showModal: true,
				modalTitle: action.payload.modalTitle,
				modalConfirmationHandler: action.payload.confirmationHandler,
			};
		case "HIDE_MODAL":
			return {
				...state,
				showModal: false,
				modalTitle: "",
				modalConfirmationHandler: null,
			};
		default:
			return state;
	}
};
