import React from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { connect } from "react-redux";

import "./chat-header.scss";

import ProfilePreview from "../profile-preview/profile-preview";

const ChatHeader = ({ currentChatUser }) => {
	const history = useHistory();

	const params = useParams();

	const handleProfilePreviewClick = () => {
		history.push(`/profile/view/${params.id}`);
	};

	return (
		<div className="chat-header">
			<Link to="/" className="logo logo-smaller">
				social network
			</Link>
			<ProfilePreview
				username={currentChatUser.username}
				profilePictureURL={currentChatUser.profilePictureURL}
				clickHandler={handleProfilePreviewClick}
			/>
		</div>
	);
};

const mapStateToProps = (state) => {
	return {
		currentChatUser: state.chat.currentChatUser,
	};
};

export default connect(mapStateToProps)(ChatHeader);
