import React from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";

import { showNotification } from "../../redux/notification/notification.actions";

import { CurrentUserContext } from "../../contexts/current-user.context";

import { loginOrRegister } from "../../api/api.user";
import { getProfile } from "../../api/api.profile";
import { setFieldError, clearFieldErrors } from "../utils/utils.forms";

import { ReactComponent as SignInIcon } from "../../assets/icons/sign-in.svg";

import CustomInput from "../custom-input/custom-input";
import Button from "../button/button";
import FormHeader from "../form-header/form-header";

class SignIn extends React.Component {
	constructor() {
		super();

		this.state = {
			email: "",
			password: "",
			emailError: "",
			passwordError: "",
			signingIn: false,
		};

		this.setFieldError = setFieldError.bind(this);
		this.clearFieldErrors = clearFieldErrors.bind(this);
	}

	static contextType = CurrentUserContext;

	fieldNames = ["email", "password"];

	componentDidMount() {
		const [
			currentUser,
			setCurrentUser,
			currentUserProfile,
			setCurrentUserProfile,
		] = this.context;
		setCurrentUser(null);
		setCurrentUserProfile(null);
	}

	handleInputChange = (event) => {
		this.setState({ [event.target.name]: event.target.value });
	};

	handleFormSubmit = (event) => {
		event.preventDefault();

		this.clearFieldErrors();

		this.setState({ signingIn: true });

		loginOrRegister("login", {
			email: this.state.email,
			password: this.state.password,
		}).then((data) => {
			if (data.message === `"email" is not allowed to be empty`) {
				this.setFieldError("email", "email cannot be empty");
			} else if (
				data.message === `"password" is not allowed to be empty`
			) {
				this.setFieldError("password", "password cannot be empty");
			} else if (data.message === `"email" must be a valid email`) {
				this.setFieldError("email", "email must be valid");
			} else if (
				data.message ===
				`"password" length must be at least 7 characters long`
			) {
				this.setFieldError(
					"password",
					"password must be atleast 7 characters"
				);
				this.setFieldError(
					"repeatedPassword",
					"password must be atleast 7 characters"
				);
			} else if (
				data.message ===
				`"username" length must be at least 5 characters long`
			) {
				this.setFieldError(
					"username",
					"username must be atleast 5 characters"
				);
			} else if (data.message === `email or password is incorrect`) {
				this.setFieldError("email", "email or password is incorrent");
				this.setFieldError(
					"password",
					"email or password is incorrect"
				);
			} else {
				this.handleUserLogin(data);
			}

			this.setState({ signingIn: false });
		});
	};

	handleUserLogin = (user) => {
		const [
			currentUser,
			setCurrentUser,
			currentUserProfile,
			setCurrentUserProfile,
		] = this.context;

		setCurrentUser(user);

		getProfile(user._id, user.token).then((data) => {
			if (data.error) {
				this.props.history.push("/profile/add");
			} else {
				setCurrentUserProfile(data);
				this.props.history.push("./posts");
				this.props.showNotification(true, "you are signed in");
			}
		});
	};

	render() {
		return (
			<div className="sign-in form-container">
				<FormHeader
					title="sign in to social network"
					subtitle="Do not have an account?"
					link="register"
					linkTo="register"
				/>
				<form className="sign-in form" onSubmit={this.handleFormSubmit}>
					<CustomInput
						value={this.state.email}
						label="email"
						type="text"
						name="email"
						error={this.state.emailError}
						inputChangeHandler={this.handleInputChange}
					/>
					<CustomInput
						value={this.state.password}
						label="password"
						type="password"
						name="password"
						error={this.state.passwordError}
						inputChangeHandler={this.handleInputChange}
					/>
					<Button type="submit" full>
						<SignInIcon className="icon" />{" "}
						{this.state.signingIn ? "signing in" : "sign in"}
					</Button>
				</form>
			</div>
		);
	}
}

export const mapDispatchToProps = (dispatch) => {
	return {
		showNotification: (notificationType, notificationText) => {
			dispatch(showNotification(notificationType, notificationText));
		},
	};
};

export default withRouter(connect(null, mapDispatchToProps)(SignIn));
