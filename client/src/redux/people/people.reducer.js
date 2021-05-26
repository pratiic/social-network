const INITIAL_STATE = {
	people: [],
};

export const peopleReducer = (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case "SET_PEOPLE":
			return {
				...state,
				people: action.payload,
			};
		case "SET_PERSON":
			return {
				...state,
				people: [action.payload, ...state.people],
			};
		default:
			return state;
	}
};
