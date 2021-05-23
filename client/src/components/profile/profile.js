import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import io from "socket.io-client";

import "./profile.scss";

import { CurrentUserContext } from "../../contexts/current-user.context";

import { getDate } from "../utils/utils.date-and-time";
import { getProfile } from "../../api/api.profile";

import { ReactComponent as NoProfileHuman } from "../../assets/humans/no-profile.svg";

import ProfileInfo from "../profile-info/profile-info";
import ProfileHeader from "../profile-header/profile-header";
import { setCurrentlyViewedProfile } from "../../redux/profile/profile.actions";

const Profile = () => {
	const [profile, setProfile] = useState(null);
	const [profileMessage, setProfileMessage] = useState("");

	const [
		currentUser,
		setCurrentUser,
		currentUserProfile,
		setCurrentUserProfile,
	] = useContext(CurrentUserContext);

	const params = useParams();

	const dispatch = useDispatch();

	useEffect(() => {
		setProfileMessage("loading profile...");

		getProfile(
			params.id === "me" ? currentUser._id : params.id,
			currentUser.token
		).then((data) => {
			if (!data.error) {
				setProfile(data);
				setProfileMessage("");

				if (params.id === "me") {
					setCurrentUserProfile(data);
				}

				dispatch(setCurrentlyViewedProfile(data));
			} else {
				setProfileMessage("profile not found");
			}
		});
	}, [params.id]);

	useEffect(() => {
		if (params.id === "me") {
			setProfile(currentUserProfile);
		}
	}, [currentUserProfile]);

	const getArrayFromString = (string) => {
		let arr;

		arr = string.split(",");

		return arr;
	};

	return (
		<div className="profile">
			{!profile ? (
				profileMessage === "loading profile..." ? (
					<p className="info-message text-small">{profileMessage}</p>
				) : (
					<NoProfileHuman className="human" />
				)
			) : (
				<React.Fragment>
					<ProfileHeader profile={profile} />
					<ProfileInfo
						title="about"
						description={profile.description}
					/>
					<ProfileInfo
						title="i live in"
						description={profile.address}
					/>
					{[
						{ title: "some of my hobbies", data: profile.hobbies },
						{ title: "what I like", data: profile.likes },
						{ title: "what I dislike", data: profile.dislikes },
					].map((dataItem) => {
						return dataItem.data.length > 0 ? (
							<ProfileInfo
								title={dataItem.title}
								items={getArrayFromString(dataItem.data)}
							/>
						) : null;
					})}
					<ProfileInfo
						title="i was born in"
						description={getDate(profile.dateOfBirth)}
					/>
					<ProfileInfo
						title="what I do for a living"
						description={profile.job}
					/>
					{profile.relationshipStatus ? (
						<ProfileInfo
							title="relationship status"
							description={profile.relationshipStatus}
						/>
					) : null}
					{profile.education ? (
						<ProfileInfo
							title="education"
							description={profile.education}
						/>
					) : null}
				</React.Fragment>
			)}
		</div>
	);
};

export default Profile;
