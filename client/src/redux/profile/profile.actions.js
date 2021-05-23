import { profileActionTypes } from "./profile.types";

export const setCurrentlyViewedProfile = (currentlyViewedProfile) => {
	return {
		type: profileActionTypes.SET_CURRENTLY_VIEWED_PROFILE,
		payload: currentlyViewedProfile,
	};
};
