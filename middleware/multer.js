const multer = require("multer");

const getUpload = (size) => {
	const upload = multer({
		limits: {
			fileSize: size * 1000000,
		},
		fileFilter: (request, file, callback) => {
			if (
				!(
					file.originalname.endsWith(".jpg") ||
					file.originalname.endsWith(".png") ||
					file.originalname.endsWith(".jpeg")
				)
			) {
				return callback(new Error("please upload a valid image"));
			}

			callback(null, true);
		},
	});

	return upload;
};

module.exports = { getUpload };
