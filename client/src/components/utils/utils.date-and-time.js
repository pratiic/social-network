const dayToWeekMap = {
	0: "sunday",
	1: "monday",
	2: "tuesday",
	3: "wednesday",
	4: "thursday",
	5: "friday",
	6: "saturday",
};

const numberToMonthMap = {
	0: "jan",
	1: "feb",
	2: "mar",
	3: "apr",
	4: "may",
	5: "jun",
	6: "jul",
	7: "aug",
	8: "sep",
	9: "oct",
	10: "nov",
	11: "dec",
};

export const getDate = (fullDate) => {
	const date = new Date(fullDate);
	const dateString = `${dayToWeekMap[date.getDay()]}, ${date.getDate()} ${
		numberToMonthMap[date.getMonth()]
	}, ${date.getFullYear()}`;
	return dateString;
};

export const getTime = (fullDate) => {
	const date = new Date(fullDate);
	const hours = date.getHours();
	const minutes = date.getMinutes();
	const amPm = hours > 12 ? "pm" : "am";
	return `${hours > 12 ? hours - 12 : hours}:${
		minutes >= 10 ? minutes : `0${minutes}`
	} ${amPm}`;
};
