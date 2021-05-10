import React from "react";
import { Link, useLocation, useHistory } from "react-router-dom";

import "./header.scss";

import Navbar from "../navbar/navbar";
import Button from "../button/button";

const Header = () => {
	const location = useLocation();
	const history = useHistory();

	const renderButton = () => {
		if (location.pathname === "/" || location.pathname === "/register") {
			return (
				<Button
					white
					clickHandler={() => {
						history.push("/signin");
					}}
				>
					sign in
				</Button>
			);
		} else if (location.pathname === "/signin") {
			return (
				<Button
					white
					clickHandler={() => {
						history.push("/register");
					}}
				>
					register
				</Button>
			);
		}
	};

	return (
		<div className="header">
			<div className="wrapper">
				<Link className="logo" to="/">
					social network
				</Link>
				<Navbar />
				{renderButton()}
			</div>
		</div>
	);
};

export default Header;
