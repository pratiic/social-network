import React from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";

import { showNotification } from "../../redux/notification/notification.actions";

import { loginOrRegister } from "../../api/api.user";
import { setFieldError, clearFieldErrors } from "../utils/utils.forms";

import { ReactComponent as ChevronRightIcon } from "../../assets/icons/chevron-right.svg";

import CustomInput from "../custom-input/custom-input";
import Button from "../button/button";
import FormHeader from "../form-header/form-header";

class Register extends React.Component {
	constructor() {
		super();

		this.state = {
			username: "",
			email: "",
			password: "",
			repeatedPassword: "",
			usernameError: "",
			emailError: "",
			passwordError: "",
			repeatedPasswordError: "",
			registering: false,
		};

		this.setFieldError = setFieldError.bind(this);
		this.clearFieldErrors = clearFieldErrors.bind(this);
	}

	fieldNames = ["username", "email", "password", "repeatedPassword"];

	handleInputChange = (event) => {
		this.setState({ [event.target.name]: event.target.value });
	};

	handleFormSubmit = (event) => {
		event.preventDefault();

		this.clearFieldErrors();

		if (this.state.password !== this.state.repeatedPassword) {
			this.setFieldError("password", "these passwords do not match");
			this.setFieldError(
				"repeatedPassword",
				"these passwords do not match"
			);
			return;
		}

		this.setState({ registering: true });

		loginOrRegister("register", {
			username: this.state.username,
			email: this.state.email,
			password: this.state.password,
		}).then((data) => {
			if (data.message === `"username" is not allowed to be empty`) {
				this.setFieldError("username", "username cannot be empty");
			} else if (data.message === `"email" is not allowed to be empty`) {
				this.setFieldError("email", "email cannot be empty");
			} else if (
				data.message === `"password" is not allowed to be empty`
			) {
				this.setFieldError("password", "password cannot be empty");
			} else if (data.message === "user already exists") {
				this.setFieldError("email", "this email already exists");
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
			} else {
				this.props.history.push("/signin");
				this.props.showNotification(
					true,
					"you are successfully registered"
				);
			}

			this.setState({ registering: false });
		});
	};

	render() {
		return (
			<div className="register form-container">
				<FormHeader
					title="register in to social network"
					subtitle="Already have an account?"
					link="sign in"
					linkTo="signin"
				/>
				<form
					className="register form"
					onSubmit={this.handleFormSubmit}
				>
					<CustomInput
						value={this.state.username}
						label="username"
						type="text"
						name="username"
						error={this.state.usernameError}
						inputChangeHandler={this.handleInputChange}
					/>
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
					<CustomInput
						value={this.state.repeatedPassword}
						label="retype password"
						type="password"
						name="repeatedPassword"
						error={this.state.repeatedPasswordError}
						inputChangeHandler={this.handleInputChange}
					/>
					<Button type="submit" full>
						<ChevronRightIcon className="icon" />{" "}
						{this.state.registering ? "registering" : "register"}
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

export default withRouter(connect(null, mapDispatchToProps)(Register));
