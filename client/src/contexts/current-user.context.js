import React, { useState, createContext } from "react";

export const CurrentUserContext = createContext();

export const CurrentUserProvider = ({ children }) => {
	const [currentUser, setCurrentUser] = useState(null);
	const [currentUserProfile, setCurrentUserProfile] = useState(null);

	return (
		<CurrentUserContext.Provider
			value={[
				currentUser,
				setCurrentUser,
				currentUserProfile,
				setCurrentUserProfile,
			]}
		>
			{children}
		</CurrentUserContext.Provider>
	);
};
