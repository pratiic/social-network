import React from "react";
import { useHistory } from "react-router-dom";

import User from "../user/user";

const UsersList = ({ users }) => {
	const history = useHistory();

	return (
		<div className="users-list">
			{users.map((user) => {
				return (
					<User user={user} key={user.username ? user._id : user} />
				);
			})}
		</div>
	);
};

export default UsersList;
