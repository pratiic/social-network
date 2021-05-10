export function setFieldError(field, error) {
	this.setState({ [`${field}Error`]: error });
}

export function clearFieldErrors() {
	this.fieldNames.forEach((fieldName) => {
		this.setState({ [`${fieldName}Error`]: "" });
	});
}
