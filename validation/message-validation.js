const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const { checkForErrors } = require("./validation.utils");

const messageSchema = Joi.object({
	text: Joi.string().required(),
	user: Joi.objectId().required(),
	chat: Joi.string().required(),
	to: Joi.objectId().required(),
});

const validateMessage = (message) => {
	const validationResult = messageSchema.validate(message);
	const error = checkForErrors(validationResult);
	return error;
};

module.exports = { validateMessage };
