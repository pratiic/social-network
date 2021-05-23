import React from "react";
import { useHistory } from "react-router-dom";

import "./welcome.scss";

import { ReactComponent as WelcomePageHuman } from "../../assets/humans/welcome-page.svg";

import Button from "../button/button";

const Welcome = () => {
	const history = useHistory();

	return (
		<div className="welcome">
			<div className="welcome-header">
				<p className="heading text-bigger capitalize">
					welcome to social network
				</p>
				<p className="sub-heading text-medium">
					find your friends and have a lot of fun
				</p>
			</div>
			<div className="welcome-body">
				<WelcomePageHuman />
				<div className="create-account">
					<p className="text-small uppercase">
						create an account here
					</p>
					<Button
						outlined
						clickHandler={() => {
							history.push("/register");
						}}
					>
						register
					</Button>
				</div>
			</div>
		</div>
	);
};

export default Welcome;
