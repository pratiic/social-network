const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const { checkForErrors } = require("./validation.utils");

const commentSchema = Joi.object({
	description: Joi.string().min(9).required(),
	user: Joi.objectId().required(),
	post: Joi.objectId().required(),
});

const validateComment = (comment) => {
	const validationResult = commentSchema.validate(comment);
	const error = checkForErrors(validationResult);
	return error;
};

module.exports = { validateComment };
