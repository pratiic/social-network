const Joi = require("joi");
const { checkForErrors } = require("./validation.utils");
Joi.objectId = require("joi-objectid")(Joi);

const userProfileSchema = Joi.object({
	address: Joi.string().required(),
	hobbies: Joi.array(),
	description: Joi.string().min(75).required(),
	dateOfBirth: Joi.date().required(),
	job: Joi.string().required(),
	relationshipStatus: Joi.string(),
	likes: Joi.array(),
	dislikes: Joi.array(),
	education: Joi.string(),
	user: Joi.objectId(),
});

const validateUserProfile = (profile) => {
	const validationResult = userProfileSchema.validate(profile);
	const error = checkForErrors(validationResult);
	return error;
};

module.exports = { validateUserProfile };
