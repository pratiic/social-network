import React, { useEffect, useContext, useState } from "react";

import "./people.scss";

import { CurrentUserContext } from "../../contexts/current-user.context";

import { getAllUsers, searchUser } from "../../api/api.user";

import { ReactComponent as NoUsersHuman } from "../../assets/humans/no-users.svg";
import { ReactComponent as ReloadIcon } from "../../assets/icons/reload.svg";

import PageTitle from "../page-title/page-title";
import UsersList from "../users-list/users-list";
import UserSearch from "../user-search/user-search";
import Button from "../button/button";

const People = () => {
	const [people, setPeople] = useState([]);
	const [peopleMessage, setPeopleMessage] = useState("");
	const [searching, setSearching] = useState(false);
	const [search, setSearch] = useState(false);

	const [currentUser, setCurrentUser] = useContext(CurrentUserContext);

	useEffect(() => {
		setPeopleMessage("loading people...");

		fetchUsers();
	}, []);

	const handleFormSubmit = (search) => {
		setSearching(true);
		setSearch(true);
		setPeopleMessage("searching...");
		setPeople([]);

		searchUser(search, currentUser.token).then((data) => {
			setPeopleMessage("");
			setSearching(false);

			if (data.error) {
				return setPeople([]);
			}

			setPeople(data);
		});
	};

	const renderUsersList = () => {
		return (
			<UsersList
				users={people.filter((person) => {
					return person._id !== currentUser._id;
				})}
			/>
		);
	};

	const handleResetButtonClick = () => {
		setSearch(false);
		setPeople([]);
		fetchUsers();
	};

	const fetchUsers = () => {
		getAllUsers(currentUser.token).then((data) => {
			setPeopleMessage("");

			if (!data.error) {
				setPeople(data);
			}
		});
	};

	return (
		<div className="people">
			<PageTitle title="find your friends here" />
			{!search ? (
				<React.Fragment>
					<UserSearch submitHandler={handleFormSubmit} />
					{people.length > 0 ? (
						renderUsersList()
					) : peopleMessage === "loading people..." ? (
						<p className="text-small info-message">
							{peopleMessage}
						</p>
					) : (
						<NoUsersHuman className="human" />
					)}
				</React.Fragment>
			) : (
				<React.Fragment>
					<UserSearch submitHandler={handleFormSubmit} />
					<Button
						secondary
						smaller
						align="right"
						clickHandler={handleResetButtonClick}
					>
						<ReloadIcon className="icon" /> reset
					</Button>
					{people.length > 0 && !searching ? (
						renderUsersList()
					) : peopleMessage === "searching..." ? (
						<p className="text-small info-message">
							{peopleMessage}
						</p>
					) : (
						<NoUsersHuman className="human" />
					)}
				</React.Fragment>
			)}
		</div>
	);
};

export default People;
