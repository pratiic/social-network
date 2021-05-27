const express = require("express");
const Notification = require("../models/Notification");
const {
	validateNotification,
} = require("../validation/notification-validation");
const { auth } = require("../middleware/auth");

const router = express.Router();

//post a notification
router.post("/", auth, async (request, response) => {
	const error = validateNotification(request.body);

	if (error) {
		return response.status(400).send({ error: error });
	}

	try {
		const notification = new Notification({
			...request.body,
		});
		const savedNotification = await notification.save();
		response.send(savedNotification);
	} catch (error) {
		response.status(500).send({ error });
	}
});

//get notifications of a user
router.get("/", auth, async (request, response) => {
	const notifications = await Notification.find({
		to: request.user,
	})
		.populate("from")
		.sort({ createdAt: -1 });

	if (notifications.length === 0) {
		return response.status(400).send({ error: "notifications not found" });
	}

	try {
		response.send(notifications);
	} catch (error) {
		response.status(500).send(error);
	}
});

//get the number of notifications
router.get("/number", auth, async (request, response) => {
	const notifications = await Notification.find({
		to: request.user,
		seen: false,
	});

	try {
		response.send({ length: notifications.length });
	} catch (error) {
		response.status(500).send(error);
	}
});

//update the notifications
router.put("/", auth, async (request, response) => {
	try {
		await Notification.updateMany({ to: request.user }, { seen: true });
		response.send({ message: "updated" });
	} catch (error) {
		response.status(500).send(error);
	}
});

//delete a notification
router.delete("/:notificationID", async (request, response) => {
	try {
		await Notification.findByIdAndDelete(request.params.notificationID);
		response.send({ message: "deleted" });
	} catch (error) {
		response.status(500).send(error);
	}
});

//delete all notifications of a user
router.delete("/", auth, async (request, response) => {
	try {
		await Notification.deleteMany({ to: request.user });
		response.send({ message: "deleted" });
	} catch (error) {
		response.status(500).send(error);
	}
});

module.exports = router;
