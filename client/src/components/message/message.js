import React, { useContext } from "react";
import { connect } from "react-redux";

import "./message.scss";

import { CurrentUserContext } from "../../contexts/current-user.context";

import { getTime } from "../utils/utils.date-and-time";

import { ReactComponent as VerticalDotMenu } from "../../assets/icons/vertical-dot-menu.svg";
import { ReactComponent as TickIcon } from "../../assets/icons/tick.svg";
import { ReactComponent as DoubleTicksIcon } from "../../assets/icons/double-tick.svg";

import ProfilePicture from "../profile-picture/profile-picture";

const Message = ({ text, user, currentChatUser, createdAt, seen }) => {
	const [currentUser, setCurrentUser] = useContext(CurrentUserContext);

	return (
		<div
			className={`message ${
				user !== currentUser._id ? "incoming" : null
			}`}
		>
			{/* <VerticalDotMenu className="icon" /> */}
			<div className="text text-small">
				{text}
				<div className="message-info">
					<p className="time text-smallest">{getTime(createdAt)}</p>
					{user === currentUser._id ? (
						seen ? (
							<DoubleTicksIcon className="icon" />
						) : (
							<TickIcon className="icon" />
						)
					) : null}
				</div>
			</div>
			{user !== currentUser._id ? (
				<ProfilePicture
					profilePictureURL={currentChatUser.profilePictureURL}
					profilePicture={currentChatUser.profilePicture}
					id={user}
					size="smallest"
				/>
			) : null}
		</div>
	);
};

const mapStateToProps = (state) => {
	return {
		currentChatUser: state.chat.currentChatUser,
	};
};

export default connect(mapStateToProps)(Message);
