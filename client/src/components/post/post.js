import React, { useContext, useState, useEffect, memo } from "react";
import { useDispatch, connect } from "react-redux";
import { useHistory } from "react-router-dom";

import "./post.scss";

import { showNotification } from "../../redux/notification/notification.actions";
import { setEditingFields } from "../../redux/posts/posts.actions";
import { hideModal, showModal } from "../../redux/modal/modal.actions";

import { CurrentUserContext } from "../../contexts/current-user.context";

import { getUser } from "../../api/api.user";
import { getDate, getTime, getHowLong } from "../utils/utils.date-and-time";
import { editOrDeletePost, likeOrDislikePost } from "../../api/api.posts";
import { likedOrDislikedOrNot } from "../utils/utils.posts";

import { ReactComponent as ThumbsUpIcon } from "../../assets/icons/thumbs-up.svg";
import { ReactComponent as ThumbsDownIcon } from "../../assets/icons/thumbs-down.svg";
import { ReactComponent as TrashCanIcon } from "../../assets/icons/trash-can.svg";
import { ReactComponent as EditIcon } from "../../assets/icons/edit.svg";
import { ReactComponent as CommentIcon } from "../../assets/icons/comment.svg";
import { ReactComponent as ImageIcon } from "../../assets/icons/image.svg";

import ProfilePicture from "../profile-picture/profile-picture";
import ContentControl from "../content-control/content-control";
import Comments from "../comments/comments";
import Modal from "../modal/modal";

const Post = ({
	description,
	createdAt,
	user,
	_id,
	likedBy,
	dislikedBy,
	image,
	comments,
}) => {
	const [showComments, setShowComments] = useState(true);

	const [currentUser, setCurrentUser] = useContext(CurrentUserContext);

	const dispatch = useDispatch();

	const history = useHistory();

	const handleLikeButtonClick = () => {
		likeOrDislikePost("like", _id, currentUser.token).then((data) => {
			if (data.message !== "already liked") {
			}
		});
	};

	const handleDislikeButtonClick = () => {
		likeOrDislikePost("dislike", _id, currentUser.token).then((data) => {
			if (data.message !== "already disliked") {
			}
		});
	};

	const handleDeleteButtonClick = () => {
		dispatch(
			showModal("are you sure you want to delete this post ?", deletePost)
		);
	};

	const deletePost = () => {
		dispatch(hideModal());
		dispatch(showModal("deleting the post..."));

		editOrDeletePost("delete", _id, null, currentUser.token).then(
			(data) => {
				dispatch(hideModal());

				if (data.message === "deleted") {
					dispatch(
						showNotification(
							true,
							"post has been successfully deleted"
						)
					);
				}
			}
		);
	};

	const handleCommentButtonClick = () => {
		setShowComments(!showComments);
	};

	const handlePostClick = () => {
		history.push(`/post/${_id}`);
	};

	const handleProfileInfoClick = () => {
		if (user._id === currentUser._id) {
			history.push("/profile/view/me");
		} else {
			history.push(`/profile/view/${user._id}`);
		}
	};

	const handleEditButtonClick = () => {
		dispatch(setEditingFields(description, _id, image ? "image" : "text"));
	};

	return (
		<div className="post">
			<div className="post-header">
				<div className="profile-info" onClick={handleProfileInfoClick}>
					<ProfilePicture
						profilePictureURL={user.profilePictureURL}
						profilePicture={user.profilePicture}
						id={user._id}
						size="smaller"
					/>
					<p className="username text-small">{user.username}</p>
				</div>
				<p className="time-duration text-smallest">
					{getHowLong(createdAt)}
				</p>
			</div>
			{image ? (
				<div className="post-image" onClick={handlePostClick}>
					<ImageIcon className="background" />
					<img src={`/api/images/post/${_id}`} alt="post-imag" />
				</div>
			) : null}
			{description ? (
				<p
					className="post-description text-small"
					onClick={handlePostClick}
				>
					{description}
				</p>
			) : null}
			<div className={`post-footer ${description ? "separate" : null}`}>
				{/* <div className="post-info">
					<p className="date text-smallest">{getDate(createdAt)}</p>
					<p className="time text-smallest"> {getTime(createdAt)} </p>
				</div> */}
				<div className="post-controls">
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
					<ContentControl
						count={comments.length}
						clickHandler={handleCommentButtonClick}
					>
						<CommentIcon
							className={`icon ${showComments ? "active" : null}`}
						/>
					</ContentControl>
					{currentUser._id === user._id ? (
						<React.Fragment>
							<ContentControl
								clickHandler={handleEditButtonClick}
							>
								<EditIcon className="icon" />
							</ContentControl>
							<ContentControl
								clickHandler={handleDeleteButtonClick}
							>
								<TrashCanIcon className="icon" />
							</ContentControl>
						</React.Fragment>
					) : null}
					{/* <p className="time text-smallest"> {getTime(createdAt)} </p> */}
				</div>
			</div>
			{showComments ? (
				<Comments show={showComments} postID={_id} />
			) : null}
		</div>
	);
};

const mapStateToProps = (state, props) => {
	return {
		comments: state.posts.posts.find((post) => post._id == props._id)
			.comments,
	};
};

export default connect(mapStateToProps)(Post);
