import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";

import "./comment.scss";

import { showNotification } from "../../redux/notification/notification.actions";

import { CurrentUserContext } from "../../contexts/current-user.context";

import { getUser } from "../../api/api.user";
import {
	likeOrDislikeComment,
	deleteOrEditComment,
} from "../../api/api.comments";
import { likedOrDislikedOrNot } from "../utils/utils.posts";

import { ReactComponent as ThumbsUpIcon } from "../../assets/icons/thumbs-up.svg";
import { ReactComponent as ThumbsDownIcon } from "../../assets/icons/thumbs-down.svg";
import { ReactComponent as EditIcon } from "../../assets/icons/edit.svg";
import { ReactComponent as TrashCanIcon } from "../../assets/icons/trash-can.svg";

import ProfilePicture from "../profile-picture/profile-picture";
import ContentControl from "../content-control/content-control";

const Comment = ({ user, description, likedBy, dislikedBy, _id }) => {
	const [currentUser, setCurrentUser] = useContext(CurrentUserContext);

	const history = useHistory();

	const dispatch = useDispatch();

	const handleLikeButtonClick = () => {
		likeOrDislikeComment("like", _id, currentUser.token).then((data) => {
			console.log(data);
		});
	};

	const handleDislikeButtonClick = () => {
		likeOrDislikeComment("dislike", _id, currentUser.token).then((data) => {
			console.log(data);
		});
	};

	const handleDeleteButtonClick = () => {
		deleteOrEditComment("delete", _id, null, currentUser.token).then(
			(data) => {
				if (data.message === "deleted") {
					dispatch(
						showNotification(true, "comment has been deleted")
					);
				}
			}
		);
	};

	const handleCommentHeaderClick = () => {
		history.push(`/profile/view/${user._id}`);
	};

	return (
		<div className="comment">
			<div className="comment-header" onClick={handleCommentHeaderClick}>
				<ProfilePicture
					profilePictureURL={user.profilePictureURL}
					profilePicture={user.profilePicture}
					id={user._id}
					size="smaller"
				/>
				<p className="username text-small">{user.username}</p>
			</div>
			<p className="comment-description text-small">{description}</p>
			<div className="comment-footer">
				<ContentControl
					count={likedBy.length}
					clickHandler={handleLikeButtonClick}
				>
					<ThumbsUpIcon
						className={`icon ${
							likedOrDislikedOrNot(likedBy, currentUser)
								? "active"
								: null
						}`}
					/>
				</ContentControl>
				<ContentControl
					count={dislikedBy.length}
					clickHandler={handleDislikeButtonClick}
				>
					<ThumbsDownIcon
						className={`icon ${
							likedOrDislikedOrNot(dislikedBy, currentUser)
								? "active"
								: null
						}`}
					/>
				</ContentControl>
				{user._id == currentUser._id ? (
					<React.Fragment>
						<ContentControl clickHandler={handleDeleteButtonClick}>
							<TrashCanIcon className="icon" />
						</ContentControl>
					</React.Fragment>
				) : null}
			</div>
		</div>
	);
};

export default Comment;
