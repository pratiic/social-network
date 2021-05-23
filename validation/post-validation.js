const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const { checkForErrors } = require("./validation.utils");

const postSchema = Joi.object({
	description: Joi.string().allow(""),
	user: Joi.objectId().required(),
	for: Joi.array(),
});

const validatePost = (post) => {
	const validationResult = postSchema.validate(post);
	const error = checkForErrors(validationResult);
	return error;
};

module.exports = { validatePost };
