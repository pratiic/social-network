import React, { useState, useContext, useEffect } from "react";
import io from "socket.io-client";
import { connect, useDispatch } from "react-redux";

import "./comments.scss";

import {
	addComment as addCommentToReduxStore,
	addComments,
	deleteComment,
	updateComment,
} from "../../redux/posts/posts.actions";

import { CurrentUserContext } from "../../contexts/current-user.context";

import { getComments, addComment } from "../../api/api.comments";

import { ReactComponent as ReloadIcon } from "../../assets/icons/reload.svg";

import InputBox from "../input-box/input-box";
import Comment from "../comment/comment";
import Alert from "../alert/alert";
import Reload from "../reload/reload";

const Comments = ({ postID, comments }) => {
	const [commentsMessage, setCommentsMessage] = useState("");
	const [showAlert, setShowAlert] = useState(false);
	const [showReload, setShowReload] = useState(false);
	const [commenting, setCommenting] = useState(false);

	const [currentUser, setCurrentUser] = useContext(CurrentUserContext);

	const dispatch = useDispatch();

	useEffect(() => {
		fetchComments();
	}, []);

	useEffect(() => {
		const socket = io("https://socialnetworkawesome.herokuapp.com/");

		socket.on("commentAdded", (data) => {
			console.log(data);
			if (data.post == postID && data.user != currentUser._id) {
				setShowAlert(true);
				setShowReload(true);
			}
		});

		socket.on("commentLikedOrDisliked", (data) => {
			console.log(data);
			dispatch(updateComment(postID, data));
		});

		socket.on("commentDeleted", (data) => {
			dispatch(deleteComment(postID, data._id));
		});
	}, []);

	const fetchComments = () => {
		setShowAlert(false);
		setShowReload(false);
		setCommentsMessage("loading...");

		getComments(postID, currentUser.token).then((data) => {
			if (data.error === "no comments found") {
				setCommentsMessage("no comments");
			} else {
				dispatch(addComments(data, postID));

				setCommentsMessage("");
			}
		});
	};

	const handleCommentSubmit = (event, value) => {
		event.preventDefault();

		setCommenting(true);

		if (value.length > 0) {
			addComment(postID, { description: value }, currentUser.token).then(
				(data) => {
					setCommenting(false);

					if (!data.error) {
						dispatch(
							addCommentToReduxStore(
								{ ...data, user: currentUser },
								postID
							)
						);
					}
				}
			);
		}
	};

	const hideAlert = () => {
		setShowAlert(false);
	};

	return (
		<div className="comments">
			<InputBox
				placeholder="write a comment..."
				formSubmitHandler={handleCommentSubmit}
			/>

			{showAlert ? (
				<Alert text="new comments available" clickHandler={hideAlert} />
			) : null}

			{showReload ? (
				<Reload text="new comments" clickHandler={fetchComments} />
			) : null}

			{commenting ? (
				<p className="info-message text-smaller info-message-posting-comment">
					posting your comment...
				</p>
			) : null}

			<div className="comments-main">
				{comments.length > 0 ? (
					comments.map((comment) => {
						return <Comment {...comment} key={comment._id} />;
					})
				) : (
					<p className="info-message text-smaller">
						{commentsMessage}
					</p>
				)}
			</div>
		</div>
	);
};

const mapStateToProps = (state, props) => {
	return {
		comments: state.posts.posts.find((post) => post._id == props.postID)
			.comments,
	};
};

export default connect(mapStateToProps)(Comments);
