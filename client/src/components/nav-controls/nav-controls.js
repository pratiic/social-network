import React, { useState, useEffect } from "react";
import { connect, useDispatch } from "react-redux";
import { Link, useLocation } from "react-router-dom";

import "./nav-controls.scss";

import { toggleNavbar } from "../../redux/navbar/navbar.actions";

import { ReactComponent as CommentIcon } from "../../assets/icons/comment.svg";
import { ReactComponent as NotificationIcon } from "../../assets/icons/notification.svg";
import { ReactComponent as MenuIcon } from "../../assets/icons/menu.svg";
import { ReactComponent as ClearIcon } from "../../assets/icons/clear.svg";

const NavControls = ({ showNavbar, newNotifications, newMessages }) => {
	const dispatch = useDispatch();

	const location = useLocation();

	const handleMenuIconClick = () => {
		dispatch(toggleNavbar());
	};

	console.log(showNavbar);

	console.log(location);

	const [controls, setControls] = useState([
		{
			icon: <CommentIcon className="icon" />,
			count: 0,
			value: "chats",
			linkTo: "/chats",
			active: false,
		},
		{
			icon: <NotificationIcon className="icon" />,
			count: 0,
			value: "notifications",
			linkTo: "/notifications",
			active: false,
		},
		{
			icon: <MenuIcon className="icon" onClick={handleMenuIconClick} />,
			count: 0,
			value: "menu",
			active: false,
		},
	]);

	useEffect(() => {
		if (showNavbar) {
			setValue("menu", "active", true);
		} else {
			setValue("menu", "active", false);
		}
	}, [showNavbar]);

	useEffect(() => {
		setValue("notifications", "count", newNotifications);
	}, [newNotifications]);

	useEffect(() => {
		setValue("chats", "count", newMessages.length);
	}, [newMessages]);

	// useEffect(() => {
	// 	controls.forEach((control) => {
	// 		console.log(location);
	// 		if (
	// 			location.pathname.includes(control.value) &&
	// 			control.value !== "menu"
	// 		) {
	// 			setValue(control.value, "active", true);
	// 		} else {
	// 			setValue(control.value, "active", false);
	// 		}
	// 	});
	// }, [location]);

	// useEffect(() => {
	// 	if (location.pathname.includes("chats")) {
	// 		setValue("chats", "active", true);
	// 	} else {
	// 		setValue("chats", "active", false);
	// 	}

	// 	if (location.pathname.includes("notifications")) {
	// 		setValue("notifications", "active", true);
	// 	} else {
	// 		setValue("chats", "active", false);
	// 	}
	// }, [location]);

	useEffect(() => {
		setControls(
			controls.map((control) => {
				if (
					location.pathname.includes(control.linkTo) &&
					control.value !== "menu"
				) {
					return { ...control, active: true };
				}

				return { ...control, active: false };
			})
		);
	}, [location]);

	const setValue = (navControlValue, field, value) => {
		setControls(
			controls.map((control) => {
				if (control.value === navControlValue) {
					return {
						...control,
						[`${field}`]: value,
					};
				}

				return control;
			})
		);
	};

	return (
		<div
			className={`nav-controls ${
				!(
					location.pathname.includes("signin") ||
					location.pathname.includes("register") ||
					location.pathname.length === 1 ||
					location.pathname.includes("profile/add")
				)
					? "show"
					: null
			}`}
		>
			{controls.map((control) => {
				return control.value !== "menu" ? (
					<Link
						to={control.linkTo}
						className={`nav-control ${
							control.active ? "active" : null
						}`}
					>
						{control.icon}

						{control.count > 0 ? (
							<p className="count"> {control.count}</p>
						) : null}
					</Link>
				) : (
					<p
						className={`nav-control ${
							control.active ? "active" : null
						}`}
					>
						{control.icon}
					</p>
				);
			})}
		</div>
	);
};

const mapStateToProps = (state) => {
	return {
		showNavbar: state.navbar.showNavbar,
		newNotifications: state.userNotifications.newNotifications,
		newMessages: state.chat.newMessages,
	};
};

export default connect(mapStateToProps)(NavControls);
