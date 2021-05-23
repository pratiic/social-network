import React, { useContext, useState, useEffect } from "react";
import { Link, useLocation, useHistory } from "react-router-dom";
import { connect, useDispatch } from "react-redux";

import "./navbar.scss";

import { toggleNavbar } from "../../redux/navbar/navbar.actions";

import { CurrentUserContext } from "../../contexts/current-user.context";

import { ReactComponent as PostIcon } from "../../assets/icons/post.svg";
import { ReactComponent as PeopleIcon } from "../../assets/icons/people.svg";
import { ReactComponent as CommentIcon } from "../../assets/icons/comment.svg";
import { ReactComponent as NotificationIcon } from "../../assets/icons/notification.svg";

import ProfilePicture from "../profile-picture/profile-picture";
import ProfilePreview from "../profile-preview/profile-preview";

const Navbar = ({ newNotifications, newChats, newMessages, showNavbar }) => {
	const [navLinks, setNavLinks] = useState([
		{
			value: "posts",
			linkTo: "/posts",
			active: false,
			count: 0,
			icon: <PostIcon className="icon" />,
		},
		{
			value: "people",
			linkTo: "/find",
			active: false,
			count: 0,
			icon: <PeopleIcon className="icon" />,
		},
		{
			value: "chats",
			linkTo: "/chats",
			active: false,
			count: newChats,
			icon: <CommentIcon className="icon" />,
		},
		{
			value: "notifications",
			linkTo: "/notifications",
			active: false,
			count: newNotifications,
			icon: <NotificationIcon className="icon" />,
		},
	]);

	const [profileActive, setProfileActive] = useState(false);

	const [
		{ username, profilePictureURL, profilePicture, _id },
		setCurrentUser,
	] = useContext(CurrentUserContext);

	const location = useLocation();
	const history = useHistory();

	const dispatch = useDispatch();

	useEffect(() => {
		setNavLinks(
			navLinks.map((navLink) => {
				console.log(navLink.count);
				if (location.pathname.includes(navLink.linkTo)) {
					return { ...navLink, active: true };
				}

				return { ...navLink, active: false };
			})
		);

		if (location.pathname.includes("profile/view/me")) {
			setProfileActive(true);
		} else {
			setProfileActive(false);
		}
	}, [location]);

	useEffect(() => {
		updateNavlinks("notifications", newNotifications);
	}, [newNotifications]);

	useEffect(() => {
		updateNavlinks("chats", newMessages.length);
	}, [newChats, newMessages]);

	const handleProfilePreviewClick = () => {
		handleLinkClick();
		history.push("/profile/view/me");
	};

	const updateNavlinks = (value, count) => {
		setNavLinks(
			navLinks.map((navLink) => {
				if (navLink.value === value) {
					return { ...navLink, count: count };
				}

				return navLink;
			})
		);
	};

	const handleLinkClick = () => {
		if (showNavbar) {
			dispatch(toggleNavbar());
		}
	};

	return (
		<div className={`navbar ${!showNavbar ? "hide" : null}`}>
			{navLinks.map((navLink) => {
				return (
					<Link
						to={`${navLink.linkTo}`}
						className={`nav-link text-small capitalize ${
							navLink.active ? "active" : null
						} ${navLink.count > 0 ? "display" : null}`}
						onClick={handleLinkClick}
					>
						{" "}
						{navLink.icon}
						{navLink.value}{" "}
						{Number(navLink.count) > 0 ? (
							<p className="count text-smallest">
								{navLink.count}
							</p>
						) : null}
					</Link>
				);
			})}
			<ProfilePreview
				username={username}
				profilePictureURL={profilePictureURL}
				profilePicture={profilePicture}
				active={profileActive}
				id={_id}
				clickHandler={handleProfilePreviewClick}
			/>
		</div>
	);
};

const mapStateToProps = (state) => {
	return {
		newNotifications: state.userNotifications.newNotifications,
		newChats: state.chat.newChats,
		newMessages: state.chat.newMessages,
		showNavbar: state.navbar.showNavbar,
	};
};

export default connect(mapStateToProps)(Navbar);
