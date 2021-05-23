import React, { useState, useRef } from "react";

import "./user-search.scss";

import { ReactComponent as SearchIcon } from "../../assets/icons/search.svg";

const UserSearch = ({ submitHandler }) => {
	const [input, setInput] = useState("");

	const inputRef = useRef();

	const handleInputChange = (event) => {
		setInput(event.target.value);
	};

	const handleSearchIconClick = () => {
		inputRef.current.focus();
	};

	const handleFormSubmit = (event) => {
		event.preventDefault();

		if (input.length > 0) {
			submitHandler(input);
		}
	};

	return (
		<form className="user-search" onSubmit={handleFormSubmit}>
			<div className="input-group">
				<SearchIcon className="icon" onClick={handleSearchIconClick} />
				<input
					type="text"
					placeholder="search by name or email"
					value={input}
					className="text-smaller"
					ref={inputRef}
					onChange={handleInputChange}
				/>
			</div>
		</form>
	);
};

export default UserSearch;
