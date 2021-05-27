const Joi = require("joi");

const { checkForErrors } = require("./validation.utils");

const userRegistrationSchema = Joi.object({
	username: Joi.string().min(5).required(),
	email: Joi.string().email().required(),
	password: Joi.string().min(7).required(),
});

const validateUserRegistration = (user) => {
	const validationResult = userRegistrationSchema.validate(user);
	const error = checkForErrors(validationResult);
	return error;
};

const userLoginSchema = Joi.object({
	email: Joi.string().email().required(),
	password: Joi.string().min(7).required(),
});

const validateUserLogin = (user) => {
	const validationResult = userLoginSchema.validate(user);
	const error = checkForErrors(validationResult);
	return error;
};

module.exports = { validateUserRegistration, validateUserLogin };
