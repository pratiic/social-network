import React, { useContext } from "react";
import { Link, useLocation, useHistory } from "react-router-dom";

import "./header.scss";

import { CurrentUserContext } from "../../contexts/current-user.context";

import { ReactComponent as SignInIcon } from "../../assets/icons/sign-in.svg";
import { ReactComponent as ChevronRightIcon } from "../../assets/icons/chevron-right.svg";

import Navbar from "../navbar/navbar";
import Button from "../button/button";
import NavControls from "../nav-controls/nav-controls";

const Header = () => {
	const location = useLocation();
	const history = useHistory();

	const [
		currentUser,
		setCurrentUser,
		currentUserProfile,
		setCurrentUserProfile,
	] = useContext(CurrentUserContext);

	const renderButton = () => {
		if (location.pathname === "/" || location.pathname === "/register") {
			return (
				<Button
					smaller
					clickHandler={() => {
						history.push("/signin");
					}}
				>
					<SignInIcon className="icon" />
					sign in
				</Button>
			);
		} else if (location.pathname === "/signin") {
			return (
				<Button
					smaller
					clickHandler={() => {
						history.push("/register");
					}}
				>
					<ChevronRightIcon className="icon" />
					register
				</Button>
			);
		}
	};

	return (
		<div
			className={`header ${
				location.pathname.includes("/chats/") ? "hide" : null
			}`}
		>
			<div className="wrapper">
				<Link className="logo" to="/">
					social network
				</Link>
				{currentUser && currentUserProfile ? (
					<Navbar />
				) : (
					renderButton()
				)}
			</div>
			<div className="just-for-layout"></div>
			<NavControls />
		</div>
	);
};

export default Header;
