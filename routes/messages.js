const express = require("express");
const { validateMessage } = require("../validation/message-validation");
const Message = require("../models/Message");
const { auth } = require("../middleware/auth");
const Chat = require("../models/Chat");

const router = express.Router();

//post a message
router.post("/:chatID", auth, async (request, response) => {
	const error = validateMessage({
		...request.body,
		user: request.user,
		chat: request.params.chatID,
	});

	if (error) {
		return response.status(400).send({ error: error });
	}

	const message = new Message({
		...request.body,
		user: request.user,
		chat: request.params.chatID,
	});

	try {
		const [savedMessage, updatedChat] = await Promise.all([
			message.save(),
			Chat.findByIdAndUpdate(request.params.chatID, {
				lastMessage: request.body.text,
			}),
		]);

		response.status(201).send(savedMessage);
	} catch (error) {
		response.status(500).send(error);
	}
});

//get all messages
router.get("/:chatID", auth, async (request, response) => {
	const messages = await Message.find({
		chat: request.params.chatID,
	});

	if (messages.length === 0) {
		return response.status(400).send({ error: "messages not found" });
	}

	try {
		response.send(messages);
	} catch (error) {
		response.status(500).send(error);
	}
});

//updates messages as seen
router.put("/seen/:chatID", auth, async (request, response) => {
	try {
		await Message.updateMany(
			{
				chat: request.params.chatID,
				user: request.body.user,
				seen: false,
			},
			{ seen: true }
		);
		response.send({ message: "updated" });
	} catch (error) {
		response.status(500).send(error);
	}
});

//get unseen messages
router.get("/unseen/all", auth, async (request, response) => {
	const messages = await Message.find({ to: request.user, seen: false });
	console.log(messages);

	if (messages.length === 0) {
		return response.status(400).send({ error: "messages not found" });
	}

	try {
		response.send(messages);
	} catch (error) {
		response.status(500).send(error);
	}
});

module.exports = router;
