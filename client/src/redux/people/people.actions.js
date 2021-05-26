export const setPeople = (people) => {
	return {
		type: "SET_PEOPLE",
		payload: people,
	};
};

export const setPerson = (person) => {
	return {
		type: "SET_PERSON",
		payload: person,
	};
};
