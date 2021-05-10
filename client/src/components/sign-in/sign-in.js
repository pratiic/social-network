import React from "react";
import { Link } from "react-router-dom";

import { loginOrRegister } from "../../api/api.user";

import { setFieldError, clearFieldErrors } from "../utils/utils.forms";

import CustomInput from "../custom-input/custom-input";
import Button from "../button/button";

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

	fieldNames = ["email", "password"];

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
			console.log(data);

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
			}

			this.setState({ signingIn: false });
		});
	};

	render() {
		return (
			<div className="sign-in form-container">
				<div className="form-header">
					<p className="title text-big">sign in to social network</p>
					<p className="subtitle text-small">
						Do not have an account?{" "}
						<Link to="/register">register</Link>
					</p>
				</div>
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
						{this.state.signingIn ? "signing in" : "sign in"}
					</Button>
				</form>
			</div>
		);
	}
}

export default SignIn;
