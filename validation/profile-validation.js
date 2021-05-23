const Joi = require("joi");
const { checkForErrors } = require("./validation.utils");
Joi.objectId = require("joi-objectid")(Joi);

const userProfileSchema = Joi.object({
	address: Joi.string().required(),
	description: Joi.string().min(75).required(),
	dateOfBirth: Joi.date().required(),
	job: Joi.string().required(),
	hobbies: Joi.string().allow(""),
	relationshipStatus: Joi.string().allow(""),
	education: Joi.string().allow(""),
	likes: Joi.string().allow(""),
	dislikes: Joi.string().allow(""),
	user: Joi.objectId(),
});

const validateUserProfile = (profile) => {
	const validationResult = userProfileSchema.validate(profile);
	const error = checkForErrors(validationResult);
	return error;
};

module.exports = { validateUserProfile };
