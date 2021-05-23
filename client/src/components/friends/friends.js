import React, { useContext, useState, useEffect } from "react";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";

import { CurrentUserContext } from "../../contexts/current-user.context";

import { getUser } from "../../api/api.user";

import { ReactComponent as NoFriendsHuman } from "../../assets/humans/no-friends.svg";

import PageTitle from "../page-title/page-title";
import UsersList from "../users-list/users-list";

const Friends = ({ userID, currentlyViewedProfile }) => {
	const [friends, setFriends] = useState([]);
	const [username, setUsername] = useState("");

	const [
		currentUser,
		setCurrentUser,
		currentUserProfile,
		setCurrentUserProfile,
	] = useContext(CurrentUserContext);

	const params = useParams();

	useEffect(() => {
		if (params.id == currentUser._id) {
			setFriends(currentUserProfile.friends);
			setUsername(currentUser.username);
		} else {
			setFriends(currentlyViewedProfile.friends);
			setUsername(currentlyViewedProfile.user.username);
		}
	}, []);

	return (
		<div className="friends">
			<PageTitle
				title={
					params.id == currentUser._id
						? "your friends"
						: `friends of ${username}`
				}
			/>
			{friends.length > 0 ? (
				<UsersList users={friends} />
			) : (
				<NoFriendsHuman className="human" />
			)}
		</div>
	);
};

const mapStateToProps = (state) => {
	return {
		currentlyViewedProfile: state.profile.currentlyViewedProfile,
	};
};

export default connect(mapStateToProps)(Friends);
