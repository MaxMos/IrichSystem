const BaseController = require("../baseController.js"),
	config = require("../../global/config"),
	http = require("../../global/http"),
	mkdirp = require("mkdirp"),
	fs = require("fs"),
	path = require("path"),
	moment = require("moment"),
	ctrl = {};

// 登录
ctrl.login = function(req) {
	this.validEmpty([
		"username", "password"
	]);
	return this.request(req, "/v1/am/login", {
		username: req.body.username,
		passwd: req.body.password
	}).then(result => {
		req.session.user = result;
		return {
			data: result,
			str: "登陆"
		};
	});
};

// 登出
ctrl.logout = function(req) {
	req.session.user = null;
	return {
		data: null,
		str: "登出"
	};
};

// 获取所有联盟与广告
ctrl.getAdAll = function(req) {
	this.validEmpty([
		"page", "page_size"
	]);
	return this.request(req, "/v1/ad/getAdAll", {
		page: req.body.page,
		page_size: req.body.page_size
	}).then(result => {
		return {
			data: result,
			str: "获取所有联盟与广告"
		};
	});
};

ctrl.changeLogo = function(req) {
	let filePath = config.fileDir + "/" + req.file.filename,
		logoBase64 = fs.readFileSync(filePath).toString("base64");

	return this.request("/provider/changeLogo", {
		id: req.session.user.id,
		base64: logoBase64
	}).then(result => {
		fs.unlinkSync(filePath);
		return {
			data: result,
			str: "修改成功"
		};
	});
};

ctrl.uploadFile = function(req) {
	let fileName = req.session.user.id + "_" + (req.body.type === undefined ? "file" : req.body.type) + "_" + moment().unix() + "" + Math.floor(Math.random() * 900 + 100) + path.extname(req.file.originalname);
	if (!fs.existsSync(req.file.destination)) {
		mkdirp.sync(req.file.destination);
	}
	fs.renameSync(req.file.path, req.file.destination + fileName);
	return {
		data: fileName,
		str: "上传文件"
	};
};

ctrl.commitProduct = function(req) {
	this.validEmpty([
		"name", "type", "delivery", "brief", "standard", "price", "detail"
	]);

	let sum, temp;
	sum = req.body.standard[0].tags.length;
	temp = req.body.standard[1];
	if (temp && temp.tags) {
		if (temp.tags.length > 0) {
			sum = sum * temp.tags.length;
			temp = req.body.standard[2];
			if (temp && temp.tags) {
				sum = sum * temp.tags.length;
			} else {
				req.body.standard.splice(2, 1);
			}
		} else {
			req.body.standard.splice(1, 1);
		}
	}
	if (req.body.price.length !== sum) {
		this.paramsError("price");
	}

	req.body.providerId = req.session.user.id;

	if (req.body.uploadLogo) {
		req.body.logoFile = new Buffer(fs.readFileSync(config.fileDir + req.body.logo)).toString("base64");
	}

	return this.request("/provider/commitProduct", req.body).then(result => {
		let arr = fs.readdirSync(config.fileDir),
			reg = new RegExp(req.session.user.id + "_" + "logo_\\S+");
		arr.forEach(o => {
			if (fs.existsSync(config.fileDir + o)) {
				if (reg.test(o)) {
					fs.unlinkSync(config.fileDir + o);
				}
			}
		});
		return {
			data: null,
			str: "保存商品"
		};
	});
};

ctrl.onShelvesProduct = function(req) {
	this.validEmpty("productId");
	return this.request("/provider/editProduct", {
		providerId: req.session.user.id,
		status: 1,
		productId: req.body.productId
	}).then(result => {
		return {
			data: null,
			str: "上架商品"
		};
	});
};

ctrl.offShelvesProduct = function(req) {
	this.validEmpty("productId");
	return this.request("/provider/editProduct", {
		providerId: req.session.user.id,
		status: 0,
		productId: req.body.productId
	}).then(result => {
		return {
			data: null,
			str: "下架商品"
		};
	});
};

ctrl.delProduct = function(req) {
	this.validEmpty("productId");
	return this.request("/provider/editProduct", {
		providerId: req.session.user.id,
		status: 2,
		productId: req.body.productId
	}).then(result => {
		return {
			data: null,
			str: "删除商品"
		};
	});
};

ctrl.saveHtml = function(req) {
	this.validEmpty([
		"content", "type"
	]);

	return this.request("/provider/saveContent", {
		id: req.session.user.id,
		content: req.body.content,
		type: req.body.type
	}).then(result => {
		return {
			str: "修改成功"
		};
	});
};

ctrl.changeOrderRefund = function(req) {
	return this.request("/provider/changeOrderRefund", {
		id: req.body.id,
		refund: req.body.refund,
		refund_old: req.body.refund_old,
		description: req.body.description
	}).then(result => {
		return {
			data: result,
			str: "修改退款金额"
		};
	});
};

ctrl.confirmOrderRefund = function(req) {
	return this.request("/provider/confirmOrderRefund", {
		id: req.body.id,
		status: req.body.status,
		status_old: req.body.status_old,
		description: req.body.description
	}).then(result => {
		return {
			data: result,
			str: "确认退款"
		};
	});
};

ctrl.finishService = function(req) {
	return this.request("/provider/finishService", {
		id: req.body.id
	}).then(result => {
		return {
			data: result,
			str: "完成服务"
		};
	});
};

ctrl.changePrice = function(req) {
	return this.request("/provider/changePrice", {
		id: req.body.id,
		price: req.body.price,
		price_old: req.body.price_old,
		description: req.body.description
	}).then(result => {
		return {
			data: result,
			str: "修改价格"
		};
	});
};

ctrl.changePwd = function(req) {
	this.validEmpty([
		"userName", "userPwd"
	]);
	return this.request("/provider/changePwd", {
		id: req.session.user.id,
		userName: req.body.userName,
		userPwd: req.body.userPwd
	}).then(result => {
		return {
			str: "修改密码"
		};
	});
};
module.exports = new BaseController(ctrl);
