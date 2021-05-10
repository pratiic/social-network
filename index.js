const express = require("express");
const { connect } = require("mongodb");
require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

mongoose.connect(
	process.env.MONGO_URL,
	{ useNewUrlParser: true, useUnifiedTopology: true },
	() => {
		console.log("connected to the database successfully");
	}
);

const connection = mongoose.connection;

connection.once("open", () => {
	const myChangeStream = connection.collection("users").watch();

	myChangeStream.on("change", (change) => {
		console.log(change.operationType);
	});
});

app.use(express.json());
app.use(cors());

app.use("/api/user", require("./routes/auth"));
app.use("/api/profile", require("./routes/profile"));
app.use("/api/posts", require("./routes/posts"));
app.use("/api/comments", require("./routes/comments"));
app.use("/api/friends", require("./routes/friends"));

const port = process.env.PORT || 5000;

app.listen(port, () => {
	console.log(`the server is listening at the port ${port}`);
});
