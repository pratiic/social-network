import React, { useContext } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

import "./profile-adder.scss";

import { showNotification } from "../../redux/notification/notification.actions";

import { CurrentUserContext } from "../../contexts/current-user.context";

import { addProfile } from "../../api/api.profile";
import { setFieldError, clearFieldErrors } from "../utils/utils.forms";

import { ReactComponent as UserIcon } from "../../assets/icons/user.svg";

import CustomInput from "../custom-input/custom-input";
import FormHeader from "../form-header/form-header";
import Button from "../button/button";

class ProfileAdder extends React.Component {
	constructor() {
		super();

		this.state = {
			address: "",
			hobbies: "",
			description: "",
			dateOfBirth: "",
			job: "",
			relationshipStatus: "",
			likes: "",
			dislikes: "",
			education: "",
			addressError: "",
			descriptionError: "",
			dateOfBirthError: "",
			jobError: "",
			currentUser: null,
			registering: false,
			currentUserProfile: null,
			editing: false,
		};

		this.setFieldError = setFieldError.bind(this);
		this.clearFieldErrors = clearFieldErrors.bind(this);
	}

	static contextType = CurrentUserContext;

	fieldNames = ["address", "description", "dateOfBirth", "job"];

	allFieldNames = [
		"address",
		"hobbies",
		"description",
		"dateOfBirth",
		"job",
		"relationshipStatus",
		"likes",
		"dislikes",
		"education",
	];

	componentDidMount() {
		this.setState({ currentUser: this.context[0] });
		this.setState({ currentUserProfile: this.context[2] });

		if (this.context[2]) {
			this.setFieldValues(this.context[2]);
		}
	}

	handleInputChange = (event) => {
		this.setState({ [`${event.target.name}`]: event.target.value });
	};

	handleFormSubmit = (event) => {
		event.preventDefault();

		if (
			this.state.currentUserProfile &&
			this.state.currentUserProfile.editingCurrentUserProfile
		) {
			this.setState({ editing: true });
		} else {
			this.setState({ registering: true });
		}

		addProfile(
			this.state.currentUserProfile &&
				this.state.currentUserProfile.editingCurrentUserProfile
				? true
				: false,
			{
				address: this.state.address,
				hobbies: this.state.hobbies,
				description: this.state.description,
				dateOfBirth: this.state.dateOfBirth,
				job: this.state.job,
				relationshipStatus: this.state.relationshipStatus,
				likes: this.state.likes,
				dislikes: this.state.dislikes,
				education: this.state.education,
			},
			this.state.currentUser.token
		).then((data) => {
			if (data.error) {
				this.props.showNotification(
					false,
					"check the fields for error"
				);
			}

			if (data.error === `"address" is not allowed to be empty`) {
				this.setFieldError("address", "address cannot be empty");
			} else if (
				data.error === `"description" is not allowed to be empty`
			) {
				this.setFieldError(
					"description",
					"description cannot be empty"
				);
			} else if (
				data.error ===
				`"description" length must be at least 75 characters long`
			) {
				this.setFieldError(
					"description",
					"description must be atleast 75 characters"
				);
			} else if (data.error === `"dateOfBirth" must be a valid date`) {
				this.setFieldError(
					"dateOfBirth",
					"date of birth must be a valid date"
				);
			} else if (data.error === `"job" is not allowed to be empty`) {
				this.setFieldError("job", "job cannot be empty");
			} else {
				const [
					currentUser,
					setCurrentUser,
					currentUserProfile,
					setCurrentUserProfile,
				] = this.context;
				setCurrentUserProfile(data);

				if (
					this.state.currentUserProfile &&
					this.state.currentUserProfile.editingCurrentUserProfile
				) {
					this.props.history.push("/profile/view/me");
					this.props.showNotification(
						true,
						"profile has been edited"
					);
					return;
				}

				// this.props.history.push("/posts");
				this.props.history.push("/profile-picture/add");
				this.props.showNotification(true, "profile has been created");
			}

			this.setState({ registering: false });
		});
	};

	renderTitle = (currentUserProfile) => {
		return currentUserProfile &&
			currentUserProfile.editingCurrentUserProfile
			? "edit your profile"
			: `welcome ${
					this.state.currentUser
						? this.state.currentUser.username
						: null
			  }`;
	};

	renderSubtitle = (currentUserProfile) => {
		return currentUserProfile &&
			currentUserProfile.editingCurrentUserProfile
			? null
			: "lets set up your profile";
	};

	setFieldValues = (currentUserProfile) => {
		this.allFieldNames.forEach((fieldName) => {
			this.setState({
				[`${fieldName}`]: currentUserProfile[`${fieldName}`],
			});
		});
	};

	render() {
		const [
			currentUser,
			setCurrentUser,
			currentUserProfile,
			setCurrentUserProfile,
		] = this.context;

		return (
			<div className="profile-adder form-container">
				<FormHeader
					title={this.renderTitle(currentUserProfile)}
					subtitle={this.renderSubtitle(currentUserProfile)}
				/>
				<form className="form" onSubmit={this.handleFormSubmit}>
					<CustomInput
						value={this.state.address}
						label="tell us where you live"
						type="text"
						name="address"
						error={this.state.addressError}
						inputChangeHandler={this.handleInputChange}
					/>
					<CustomInput
						value={this.state.hobbies}
						label="hobbies (optional) (separate with commas)"
						type="text"
						name="hobbies"
						inputChangeHandler={this.handleInputChange}
						renderAs="textarea"
						size="smaller"
					/>
					<CustomInput
						value={this.state.description}
						label="tell us a little about yourself"
						type="text"
						name="description"
						error={this.state.descriptionError}
						inputChangeHandler={this.handleInputChange}
						renderAs="textarea"
					/>
					<CustomInput
						value={this.state.dateOfBirth}
						label="date of birth"
						type="text"
						name="dateOfBirth"
						error={this.state.dateOfBirthError}
						inputChangeHandler={this.handleInputChange}
					/>
					<CustomInput
						value={this.state.job}
						label="job"
						type="text"
						name="job"
						inputChangeHandler={this.handleInputChange}
					/>
					<CustomInput
						value={this.state.relationshipStatus}
						label="relationship status (optional)"
						type="text"
						name="relationshipStatus"
						inputChangeHandler={this.handleInputChange}
					/>
					<CustomInput
						value={this.state.likes}
						label="what are your likes? (optional) (separate with commas)"
						type="text"
						name="likes"
						inputChangeHandler={this.handleInputChange}
						renderAs="textarea"
						size="smaller"
					/>
					<CustomInput
						value={this.state.dislikes}
						label="what are your dislikes? (optional) (separate with commas)"
						type="text"
						name="dislikes"
						inputChangeHandler={this.handleInputChange}
						renderAs="textarea"
						size="smaller"
					/>
					<CustomInput
						value={this.state.education}
						label="education (optional)"
						type="text"
						name="education"
						inputChangeHandler={this.handleInputChange}
					/>
					<Button type="submit" full>
						<UserIcon className="icon" />
						{this.state.currentUserProfile &&
						this.state.currentUserProfile.editingCurrentUserProfile
							? this.state.editing
								? "editing profile"
								: "edit profile"
							: this.state.registering
							? "adding profile"
							: "add my profile"}
					</Button>
				</form>
			</div>
		);
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		showNotification: (...notificationInfo) => {
			dispatch(showNotification(...notificationInfo));
		},
	};
};

export default withRouter(connect(null, mapDispatchToProps)(ProfileAdder));
