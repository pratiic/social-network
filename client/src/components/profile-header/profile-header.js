import React, { useContext, useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";

import "./profile-header.scss";

import { showNotification } from "../../redux/notification/notification.actions";
import { setCurrentChatUser } from "../../redux/chat/chat.actions";
import { hideModal, showModal } from "../../redux/modal/modal.actions";

import { CurrentUserContext } from "../../contexts/current-user.context";

import {
	addFriend,
	acceptFriendRequest,
	removeFriend,
} from "../../api/api.friends";

import { ReactComponent as EditIcon } from "../../assets/icons/edit.svg";
import { ReactComponent as UserIcon } from "../../assets/icons/user.svg";
import { ReactComponent as PostIcon } from "../../assets/icons/post.svg";
import { ReactComponent as AddFriendIcon } from "../../assets/icons/add-friend.svg";
import { ReactComponent as TickIcon } from "../../assets/icons/tick.svg";
import { ReactComponent as SignOutIcon } from "../../assets/icons/sign-out.svg";
import { ReactComponent as RemoveFriendIcon } from "../../assets/icons/remove-friend.svg";
import { ReactComponent as CommentIcon } from "../../assets/icons/comment.svg";
import { ReactComponent as CameraIcon } from "../../assets/icons/camera.svg";

import ProfilePicture from "../profile-picture/profile-picture";
import Button from "../button/button";

const ProfileHeader = ({ profile }) => {
	const [friendRequestSent, setFriendRequestSent] = useState(false);
	const [friends, setFriends] = useState(false);
	const [friendRequest, setFriendRequest] = useState(false);

	const params = useParams();
	const history = useHistory();

	const dispatch = useDispatch();

	const [
		currentUser,
		setCurrentUser,
		currentUserProfile,
		setCurrentUserProfile,
	] = useContext(CurrentUserContext);

	useEffect(() => {
		if (
			currentUserProfile.friends.some(
				(friend) => friend === profile.user._id
			)
		) {
			return setFriends(true);
		}
		if (
			profile.friendRequests.some(
				(friendRequest) => friendRequest === currentUser._id
			)
		) {
			return setFriendRequestSent(true);
		}
		if (
			currentUserProfile.friendRequests.some(
				(friendRequest) => friendRequest === profile.user._id
			)
		) {
			return setFriendRequest(true);
		}
	}, []);

	const handleAddFriendButtonClick = () => {
		addFriend(profile.user._id, currentUser.token).then((data) => {
			setFriendRequestSent(true);
		});
	};

	const handleAcceptFriendRequestButtonClick = () => {
		acceptFriendRequest(profile.user._id, currentUser.token).then(
			(data) => {
				if (data.message === "added to friends") {
					setFriends(true);
					dispatch(showNotification(true, "added to friends"));
				}
			}
		);
	};

	const handleFriendsButtonClick = () => {
		history.push(`/friends/${profile.user._id}`);
	};

	const handleFriendRequestsButtonClick = () => {
		history.push("/friend-requests");
	};

	const handleSignOutButtonClick = () => {
		setCurrentUser(null);
		setCurrentUserProfile(null);
		dispatch(showNotification(true, "you have been signed out"));
	};

	const handlePostsButtonClick = () => {
		history.push(`/posts/user/${profile.user._id}`);
	};

	const handleEditProfileButtonClick = () => {
		setCurrentUserProfile({
			...currentUserProfile,
			editingCurrentUserProfile: true,
		});
		history.push("/profile/edit");
	};

	const handleRemoveFriendButtonClick = () => {
		dispatch(
			showModal(
				"are you sure you want to remove this user as your friend ?",
				removeFromFriends
			)
		);
	};

	const removeFromFriends = () => {
		dispatch(hideModal());
		dispatch(showModal("removing the user from friends..."));

		removeFriend(profile.user._id, currentUser.token).then((data) => {
			dispatch(hideModal());

			if (data.message === "removed from friends") {
				setFriends(false);
				dispatch(
					showNotification(true, "removed from friends successfully")
				);
			}
		});
	};

	const handleSendMessageButtonClick = () => {
		dispatch(setCurrentChatUser(profile.user));
		history.push(`/chats/${profile.user._id}`);
	};

	const handleChangePictureButtonClick = () => {
		history.push("/profile-picture/change");
	};

	return (
		<div className="profile-header">
			<ProfilePicture
				profilePictureURL={profile.user.profilePictureURL}
				profilePicture={profile.user.profilePicture}
				id={profile.user._id}
				size="bigger"
			/>
			{params.id === "me" ? (
				<Button
					secondary
					smaller
					align="center"
					clickHandler={handleChangePictureButtonClick}
				>
					<CameraIcon className="icon" /> change picture
				</Button>
			) : null}

			<p className="username text-small">{profile.user.username}</p>
			<p className="email text-smaller">{profile.user.email}</p>
			<div className="buttons">
				{params.id !== "me" ? (
					friends ? (
						<React.Fragment>
							<Button
								red
								active
								clickHandler={handleRemoveFriendButtonClick}
							>
								{" "}
								<RemoveFriendIcon className="icon" /> remove
								friend
							</Button>
							<Button clickHandler={handleSendMessageButtonClick}>
								<CommentIcon className="icon" /> send message
							</Button>
						</React.Fragment>
					) : friendRequestSent ? (
						<Button secondary active>
							{" "}
							<TickIcon className="icon" /> friend request sent
						</Button>
					) : friendRequest ? (
						<Button
							secondary
							clickHandler={handleAcceptFriendRequestButtonClick}
						>
							{" "}
							<AddFriendIcon className="icon" /> accept friend
							request{" "}
						</Button>
					) : (
						<Button
							secondary
							clickHandler={handleAddFriendButtonClick}
						>
							<AddFriendIcon className="icon" /> add friend
						</Button>
					)
				) : (
					<React.Fragment>
						<Button
							secondary
							clickHandler={handleEditProfileButtonClick}
						>
							{" "}
							<EditIcon className="icon" /> edit profile
						</Button>
						<Button
							secondary
							clickHandler={handleFriendRequestsButtonClick}
						>
							<AddFriendIcon className="icon" /> friend requests (
							{profile.friendRequests.length})
						</Button>
					</React.Fragment>
				)}
				<Button secondary clickHandler={handlePostsButtonClick}>
					<PostIcon className="icon" /> posts
				</Button>
				<Button secondary clickHandler={handleFriendsButtonClick}>
					{" "}
					<UserIcon className="icon" /> friends (
					{profile.friends.length})
				</Button>
				{params.id === "me" ? (
					<Button red clickHandler={handleSignOutButtonClick}>
						<SignOutIcon className="icon" />
						sign out
					</Button>
				) : null}
			</div>
		</div>
	);
};

export default ProfileHeader;
