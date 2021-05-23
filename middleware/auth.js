const jwt = require("jsonwebtoken");

const auth = (request, response, next) => {
	const token = request.header("auth-token");

	if (!token) {
		return response.status(401).send({
			message: "you have not provided token",
		});
	}

	const tokenVerified = jwt.verify(token, process.env.SECRET);

	if (!tokenVerified) {
		return response
			.status(401)
			.send({ message: "the provided token is invalid" });
	}

	request.user = tokenVerified.id;

	next();
};

module.exports = { auth };
