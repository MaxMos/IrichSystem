const Promise = require("bluebird"),
	crypto = require("crypto"),
	config = require("../global/config.js"),
	http = require("../global/http.js"),
	code = require("../global/code.js"),
	api = require("../global/api.js"),
	log = require("../global/log.js");

const Controller = function(controller) {
	for (let key in controller) {
		this[key] = ((fun) => {
			return (req, res) => {
				this.safeMode(req, res, fun);
			};
		})(controller[key]);
	}
	return this;
};

Controller.prototype.request = function(req, url, data = null, type = "POST") {
	let signObj = {};
	if (data !== null) {
		for (let temp in data) {
			if (typeof data[temp] !== "string" || data[temp].length < 200) {
				signObj[temp] = data[temp];
			}
		}
	}
	console.log('请求' + url);
	return http.request({
		type: type,
		url: config.serverUrl + url,
		data: data === null ? {} : data,
		// header: {
		// 	"X-XSRFToken": req.session.token
		// }
	}).then(result => {
		result = JSON.parse(result.body);
		if (result.retcode === 0) {
			return result.retdata;
		} else {
			throw new Error(result.retcode);
		}
	});
};

Controller.prototype.safeMode = function(req, res, fun) {
	this.req = req;
	this.res = res;
	Promise.try(() => {
		return fun.call(this, req);
	}).then(result => {
		log.info("[ Response ]" + result.str + code.success.msg);
		// log.info( "[ Response Data ] " + JSON.stringify( result.data ) );
		log.logEnd();
		res.json({
			retcode: code.success.code,
			retdata: result.data,
			retmsg: result.str + code.success.msg
		});
		res.end();
	}).catch(e => {
		let str = "",
			sendData, error;
		if (e.message.indexOf("|") !== -1) {
			str = e.message.split("|")[0];
			e.message = Number.parseInt(e.message.split("|")[1]);
		} else {
			e.message = Number.parseInt(e.message);
		}
		log.error("[ Response ] " + e.stack.split("at ")[1]);
		for (let temp in code) {
			if (code[temp].code === e.message) {
				error = code[temp];
				break;
			}
		}
		if (error === undefined) {
			log.error("[ Response ] unKnownError : " + e.stack);
			sendData = {
				retcode: code.unKnownError.code,
				retmsg: code.unKnownError.msg
			};
		} else {
			log.error("[ Response ] " + str + error.msg);
			sendData = {
				retcode: error.code,
				retmsg: str + error.msg
			};
		}
		log.logEnd();
		res.json(sendData);
		res.end();
	});
};

Controller.prototype.validEmpty = function(validArr) {
	if (validArr.length < 1 || validArr === undefined) {
		return true;
	}
	let i, temp, temp2;
	temp = this.req.method === "GET" ? this.req.query : this.req.body;
	if (typeof validArr === "object" && validArr.length > 0) {
		for (i = 0; i < validArr.length; i++) {
			temp2 = validArr[i];
			if (typeof temp2 === "string") {
				if (api.isNull(temp[temp2])) {
					throw new Error(temp2 + "|" + code.paramsError.code);
				}
			} else {
				if (temp2.premise !== undefined && temp[temp2.premise.name] == temp2.premise.value && api.isNull(temp[temp2.name])) {
					throw new Error(temp2.name + "|" + code.paramsError.code);
				}
			}
		}
	} else if (typeof validArr === "string") {
		if (api.isNull(temp[validArr])) {
			throw new Error(validArr + "|" + code.paramsError.code);
		}
	}
	return true;
};

Controller.prototype.paramsError = function(name) {
	if (name !== null && name !== undefined) {
		throw new Error(name + "|" + code.paramsError.code);
	}
};

module.exports = Controller;
