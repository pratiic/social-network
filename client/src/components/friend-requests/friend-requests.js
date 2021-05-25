import React, { useState, useContext, useEffect } from "react";

import { CurrentUserContext } from "../../contexts/current-user.context";

import { getUser } from "../../api/api.user";

import { ReactComponent as NoFriendRequestsHuman } from "../../assets/humans/no-friend-requests.svg";

import FriendRequest from "../friend-request/friend-request";
import PageTitle from "../page-title/page-title";

const FriendRequests = () => {
	const [
		currentUser,
		setCurrentUser,
		currentUserProfile,
		setCurrentUserProfile,
	] = useContext(CurrentUserContext);

	return (
		<div className="friend-requests">
			<PageTitle title="friend requests" />
			{currentUserProfile.friendRequests.length > 0 ? (
				currentUserProfile.friendRequests.map((friendRequest) => {
					return (
						<FriendRequest
							user={friendRequest}
							key={friendRequest}
						/>
					);
				})
			) : (
				<NoFriendRequestsHuman className="human" />
			)}
		</div>
	);
};

export default FriendRequests;
