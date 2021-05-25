import React, { useRef, useState, useContext, useEffect } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";

import "./profile-picture-adder.scss";

import { showNotification } from "../../redux/notification/notification.actions";
import { hideModal, showModal } from "../../redux/modal/modal.actions";

import { CurrentUserContext } from "../../contexts/current-user.context";

import { addProfilePicture } from "../../api/api.images";

import { ReactComponent as CameraIcon } from "../../assets/icons/camera.svg";

import PageTitle from "../page-title/page-title";
import Button from "../button/button";
import FileSelector from "../file-selector/file-selector";
import ProfilePicture from "../profile-picture/profile-picture";

const ProfilePictureAdder = () => {
	const [file, setFile] = useState(null);
	const [error, setError] = useState("");
	const [uploading, setUploading] = useState(false);
	const [add, setAdd] = useState(true);

	const inputRef = useRef();
	const formRef = useRef();

	const [currentUser, setCurrentUser] = useContext(CurrentUserContext);

	const location = useLocation();
	const history = useHistory();

	const dispatch = useDispatch();

	useEffect(() => {
		if (location.pathname.includes("add")) {
			setAdd(true);
		} else {
			setAdd(false);
		}
	}, []);

	const handleChange = (event) => {
		setError("");
		setFile(event.target.files[0]);
	};

	const handleFormSubmit = (event) => {
		console.log("pratiic");
		event.preventDefault();

		setError("");

		if (file) {
			setUploading(true);

			const formData = new FormData();
			formData.append("profilePicture", file);

			dispatch(
				showModal(
					` ${
						add ? "adding" : "changing"
					} your profile picture. This might take a while...`
				)
			);

			addProfilePicture(formData, currentUser.token).then((data) => {
				console.log(data);
				setUploading(false);
				dispatch(hideModal());
				if (data.error) {
					if (data.error === "please upload an image") {
						return setError(
							"please upload a valid image. jpg, jpeg, png images can be uploaded"
						);
					}
					if (data.error === "File too large") {
						return setError(
							"you can only upload images upto 4 mb in size"
						);
					}
				} else {
					dispatch(
						showNotification(
							true,
							add
								? "profile picture added"
								: "profile picture changed"
						)
					);
					if (add) {
						history.push("/posts");
					} else {
						history.push("/profile/view/me");
					}
				}
			});
		}
	};

	const handleSkipButtonClick = (event) => {
		event.preventDefault();

		history.push("/posts");
	};

	return (
		<div className="profile-picture-adder">
			<PageTitle
				title={
					add
						? "add a profile picture"
						: "change your profile picture"
				}
			/>

			<p className="existing-image text-medium">
				{add
					? "this is the default picture"
					: "your current profile picture"}
			</p>

			{!add ? (
				<ProfilePicture
					profilePictureURL={currentUser.profilePictureURL}
					profilePicture={currentUser.profilePicture}
					id={currentUser._id}
					size="bigger"
				/>
			) : (
				<ProfilePicture
					profilePictureURL={currentUser.profilePictureURL}
					size="bigger"
				/>
			)}

			<form onSubmit={handleFormSubmit} ref={formRef}>
				<FileSelector
					changeHandler={handleChange}
					filename={file ? file.name : ""}
					align="center"
				/>
				<p className="error text-smaller">{error}</p>
				<div className="buttons">
					{add ? (
						<React.Fragment>
							<Button
								secondary
								clickHandler={handleSkipButtonClick}
							>
								skip for now
							</Button>
							<Button>
								{uploading ? "adding" : "add picture"}
							</Button>
						</React.Fragment>
					) : (
						<Button type="submit">
							{uploading ? "changing" : "change picture"}
						</Button>
					)}
				</div>
			</form>
		</div>
	);
};

export default ProfilePictureAdder;
