import React, { useState, useEffect, useContext } from "react";
import { connect, useDispatch } from "react-redux";
import { useParams, withRouter } from "react-router-dom";

import "./post-page.scss";

import { addPosts } from "../../redux/posts/posts.actions";

import { CurrentUserContext } from "../../contexts/current-user.context";

import { getPost } from "../../api/api.posts";

import { ReactComponent as PostDeletedHuman } from "../../assets/humans/post-deleted.svg";

import Post from "../post/post";

const PostPage = ({ post }) => {
	const [postMessage, setPostMessage] = useState("");

	const params = useParams();

	const dispatch = useDispatch();

	const [currentUser, setCurrentUser] = useContext(CurrentUserContext);

	useEffect(() => {
		setPostMessage("loading post...");

		getPost(params.id, currentUser.token).then((data) => {
			if (!data.error) {
				console.log(data);
				return dispatch(addPosts([data]));
			}

			setPostMessage("post not found");
		});
	}, []);

	useEffect(() => {
		return () => {
			dispatch(addPosts([]));
		};
	}, []);

	return (
		<div className="post-page">
			{post ? (
				<Post {...post} />
			) : postMessage === "loading post..." ? (
				<p className="info-message text-small">{postMessage}</p>
			) : (
				<PostDeletedHuman className="human" />
			)}
		</div>
	);
};

const mapStateToProps = (state, props) => {
	return {
		post: state.posts.posts.find(
			(post) => post._id == props.match.params.id
		),
	};
};

export default withRouter(connect(mapStateToProps)(PostPage));
