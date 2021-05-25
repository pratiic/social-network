export const showModal = (modalTitle, confirmationHandler) => {
	return {
		type: "SHOW_MODAL",
		payload: {
			modalTitle,
			confirmationHandler,
		},
	};
};

export const hideModal = () => {
	return {
		type: "HIDE_MODAL",
	};
};
