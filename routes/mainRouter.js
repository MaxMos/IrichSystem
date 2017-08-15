const express = require("express"),
	router = express.Router(),
	config = require("../global/config.js"),
	multer = require("multer"),
	upload = multer({
		dest: config.fileDir
	}),
	log = require("../global/log"),
	code = require("../global/code"),
	action = require("../application/controller/actionController.js"),
	info = require("../application/controller/infoController.js"),
	http = require("../global/http");

router.all("/*", [(req, res, next) => {
	if (req.session.token) {
		next();
	} else {
		let url = config.serverUrl + "/v1/token";
		http.get({
			url: url,
			contentType: 'json'
		}).then(result => {
			req.session.token = result.body;
			next();
		});
	}
}], (req, res, next) => {
	log.info("[ RequestURL ]" + req.url);
	log.info("[ RequestMethod ]" + req.method);
	let logObj = {},
		temp;
	for (temp in req.body) {
		if (typeof req.body[temp] !== "string" || req.body[temp].length < 200) {
			logObj[temp] = req.body[temp];
		} else {
			logObj[temp] = "数据过长不展示";
		}
	}
	log.info("[ RequestParams ]" + JSON.stringify(logObj));
	if (req.url === "/login" || (req.session.user !== null && req.session.user !== undefined)) {
		next();
	} else {
		res.json({
			retcode: code.loginError.code,
			retmsg: code.loginError.msg
		});
	}
});

for (let temp in action) {
	switch (temp) {
		case "reUploadAttachment":
		case "uploadAttachment":
		case "changeLogo":
		case "uploadFile":
			router.post("/" + temp, upload.single("file"), action[temp]);
			break;

		default:
			router.post("/" + temp, action[temp]);
	}
}

for (let temp in info) {
	router.post("/" + temp, info[temp]);
}

module.exports = router;
