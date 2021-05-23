import { profileActionTypes } from "./profile.types";

const INITIAL_STATE = {
	currentlyViewedProfile: {},
};

export const profileReducer = (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case profileActionTypes.SET_CURRENTLY_VIEWED_PROFILE:
			return {
				...state,
				currentlyViewedProfile: action.payload,
			};
		default:
			return state;
	}
};
