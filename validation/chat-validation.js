const Joi = require("joi");
const { checkForErrors } = require("./validation.utils");
Joi.objectId = require("joi-objectid")(Joi);

const chatSchema = new Joi.object({
	_id: Joi.string().required(),
	users: Joi.array().required(),
	notSeenBy: Joi.array().required(),
});

const validateChat = (chat) => {
	const validationResult = chatSchema.validate(chat);
	const error = checkForErrors(validationResult);
	return error;
};

module.exports = { validateChat };
