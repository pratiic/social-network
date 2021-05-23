const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const { checkForErrors } = require("./validation.utils");

const notificationSchema = Joi.object({
	to: Joi.objectId().required(),
	from: Joi.objectId().required(),
	action: Joi.string().required(),
	type: Joi.string().required(),
});

const validateNotification = (notification) => {
	const validationResult = notificationSchema.validate(notification);
	const error = checkForErrors(validationResult);
	return error;
};

module.exports = { validateNotification };
