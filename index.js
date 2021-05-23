const express = require("express");
const { connect } = require("mongodb");
require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors");
const socketIO = require("socket.io");
const http = require("http");
const path = require("path");

const port = process.env.PORT || 5000;

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = socketIO(server, {
	cors: {
		origin: "*",
		methods: ["GET", "POST"],
	},
});

io.on("connect_error", (error) => {
	console.log(error);
});

io.on("connection", (socket) => {
	let userID;

	socket.on("typing", (data) => {
		userID = data.userID;

		socket.broadcast.emit("typing", data);
	});

	socket.on("not-typing", (data) => {
		socket.broadcast.emit("not-typing", data);
	});

	socket.on("disconnect", () => {
		console.log(userID);
		console.log("user disconnected");
	});
});

io.of("/api/socket").emit("event", { name: "pratiic" });

mongoose.connect(
	process.env.MONGO_URL,
	{ useNewUrlParser: true, useUnifiedTopology: true },
	() => {
		console.log("connected to the database successfully");
	}
);

const connection = mongoose.connection;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/user", require("./routes/auth"));
app.use("/api/profile", require("./routes/profile"));
app.use("/api/posts", require("./routes/posts"));
app.use("/api/comments", require("./routes/comments"));
app.use("/api/friends", require("./routes/friends"));
app.use("/api/notifications", require("./routes/notifications"));
app.use("/api/chats", require("./routes/chats"));
app.use("/api/messages", require("./routes/messages"));
app.use("/api/images", require("./routes/images"));

connection.once("open", () => {
	const postsChangeStream = connection
		.collection("posts")
		.watch({ fullDocument: "updateLookup" });

	postsChangeStream.on("change", (change) => {
		switch (change.operationType) {
			case "update":
				io.emit("postLikedOrDisliked", {
					...change.fullDocument,
				});
				break;
			case "insert":
				console.log(change);
				io.emit("postAdded", {
					...change.fullDocument,
				});
				break;
			case "delete":
				io.emit("postDeleted", {
					_id: change.documentKey._id,
				});
				break;
		}
	});

	const commentsChangeStream = connection
		.collection("comments")
		.watch({ fullDocument: "updateLookup" });

	commentsChangeStream.on("change", (change) => {
		switch (change.operationType) {
			case "insert":
				io.emit("commentAdded", {
					...change.fullDocument,
				});
				break;
			case "update":
				console.log(change);
				io.emit("commentLikedOrDisliked", {
					...change.fullDocument,
				});
				break;
			case "delete":
				console.log(change);
				io.emit("commentDeleted", {
					_id: change.documentKey._id,
				});
				break;
		}
	});

	const profilesChangeStream = connection.collection("profiles").watch({
		fullDocument: "updateLookup",
	});

	profilesChangeStream.on("change", (change) => {
		switch (change.operationType) {
			case "update":
				io.emit("profileUpdated", {
					...change.fullDocument,
				});
				break;
		}
	});

	const notificationsChangeStream = connection
		.collection("notifications")
		.watch({ fullDocument: "updateLookup" });

	notificationsChangeStream.on("change", (change) => {
		switch (change.operationType) {
			case "insert":
				io.emit("notificationAdded", {
					...change.fullDocument,
				});
				break;
		}
	});

	const messagesChangeStream = connection.collection("messages").watch({
		fullDocument: "updateLookup",
	});

	messagesChangeStream.on("change", (change) => {
		switch (change.operationType) {
			case "insert":
				io.emit("messageAdded", {
					...change.fullDocument,
				});
				break;
			case "update":
				io.emit("messageUpdated", {
					...change.fullDocument,
				});
				break;
		}
	});

	const chatsChangeStream = connection.collection("chats").watch();

	chatsChangeStream.on("change", (change) => {
		switch (change.operationType) {
			case "insert":
				console.log(change);
				io.emit("chatAdded", {
					...change.fullDocument,
				});
				break;
		}
	});
});

if (process.env.NODE_ENV === "production") {
	app.use(express.static("client/build"));

	app.get("*", (request, response) => {
		response.sendFile(
			path.resolve(__dirname, "client", "build", "index.html")
		);
	});
}

server.listen(port, () => {
	console.log(`the server is listening at the port ${port}`);
});
