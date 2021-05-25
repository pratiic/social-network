const express = require("express");
const { validateChat } = require("../validation/chat-validation");
const Chat = require("../models/Chat");
const { auth } = require("../middleware/auth");
const mongoose = require("mongoose");

const router = express.Router();

//create a chat
router.post("/:chatID", auth, async (request, response) => {
	const error = validateChat({ ...request.body, _id: request.params.chatID });

	if (error) {
		return response.status(400).send({ error: error });
	}

	const chat = new Chat({
		_id: request.params.chatID,
		...request.body,
	});

	try {
		const savedChat = await chat.save();
		response.status(201).send(savedChat);
	} catch (error) {
		response.status(500).send(error);
	}
});

//get chats of a user
router.get("/", auth, async (request, response) => {
	const chats = await Chat.find({
		users: request.user,
		"users.1": { $exists: true },
	})
		.sort({ updatedAt: -1 })
		.populate("users");

	if (chats.length === 0) {
		return response.status(400).send({ error: "chats not found" });
	}

	try {
		response.send(chats);
	} catch (error) {
		response.status(500).send(error);
	}
});

//get the number of chats that have not been seen
router.get("/unseen", auth, async (request, response) => {
	const chats = await Chat.find({
		users: request.user,
		notSeenBy: request.user,
	});

	if (chats.length === 0) {
		return response.status(400).send({ error: "chats not found" });
	}

	try {
		response.send(chats);
	} catch (error) {
		response.status(500).send(error);
	}
});

//remove a user from the notSeenBy list
router.put("/unseen/:chatID", auth, async (request, response) => {
	const chat = await Chat.findById(request.params.chatID);

	if (!chat) {
		return response.status(400).send({ error: "chat not found" });
	}

	chat.notSeenBy.pull(request.user);

	try {
		await chat.save();
		response.send({ message: "updated" });
	} catch (error) {
		response.status(500).send(error);
	}
});

//get chat id
router.get("/chatID/:chatUserID", auth, async (request, response) => {
	const chatUserToCurrentUser = await Chat.findById(
		`${request.params.chatUserID}${request.user}`
	);

	try {
		if (!chatUserToCurrentUser) {
			return response.send({
				chatID: `${request.user}${request.params.chatUserID}`,
			});
		}

		response.send({
			chatID: `${request.params.chatUserID}${request.user}`,
		});
	} catch (error) {
		response.status(500).send(error);
	}
});

//remove a user from notSeenByList of all chats whose they are a user
router.put("/unseen", auth, async (request, response) => {
	try {
		const updatedChats = await Chat.updateMany({
			users: request.user,
			notSeenBy: request.user,
		});
		response.send(updatedChats);
	} catch (error) {
		response.status(500).send(error);
	}
});

module.exports = router;
