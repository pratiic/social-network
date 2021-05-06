const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");

const app = express();

mongoose.connect(
	process.env.MONGO_URL,
	{ useNewUrlParser: true, useUnifiedTopology: true },
	() => {
		console.log("connected to the database successfully");
	}
);

app.use(express.json());

app.use("/api/user", require("./routes/auth"));
app.use("/api/profile", require("./routes/profile"));

const port = process.env.PORT || 5000;

app.listen(port, () => {
	console.log(`the server is listening at the port ${port}`);
});
