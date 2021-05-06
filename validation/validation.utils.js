const checkForErrors = (validationResult) => {
	if (validationResult.error) {
		return validationResult.error.details[0].message;
	}

	return null;
};

module.exports = { checkForErrors };
