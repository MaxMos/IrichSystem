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
		console.log(req.session.user);
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

// 获取所有下游信息
ctrl.listChn = function(req) {
	return this.request(req, "/v1/am/listchn", {
		am_id: req.session.user.am_id
	}).then(result => {
		return {
			data: result,
			str: "获取所有下游信息"
		};
	});
};

// 更改下游账号状态
ctrl.setChnStatus = function(req) {
	this.validEmpty([
		"chn_id", "status"
	]);
	return this.request(req, "/v1/am/setstatus", {
		chn_id: req.body.chn_id,
		status: req.body.status
	}).then(result => {
		return {
			data: result,
			str: "更改下游账号状态"
		};
	});
};

// 更改下游APP状态
ctrl.setAppStatus = function(req) {
	this.validEmpty([
		"chn_id", "app_id", "status"
	]);
	return this.request(req, "/v1/app/active", {
		chn_id: req.body.chn_id,
		app_id: req.body.app_id,
		status: req.body.status
	}).then(result => {
		return {
			data: result,
			str: "更改下游APP状态"
		};
	});
};

// 获取所有APP
ctrl.listApp = function(req) {
	return this.request(req, "/v1/app/listAll", {}).then(result => {
		return {
			data: result,
			str: "获取所有APP"
		};
	});
};

// 创建下游账号
ctrl.createChn = function(req) {
	this.validEmpty([
		"username", "passwd", "email"
	]);
	return this.request(req, "/v1/am/createchn", {
		username: req.body.username,
		passwd: req.body.passwd,
		email: req.body.email,
		am_id: req.session.user.am_id
	}).then(result => {
		return {
			data: result,
			str: "创建下游账号"
		};
	});
};

// 获取所有联盟信息
ctrl.getAder = function(req) {
	return this.request(req, "/v1/ad/getAder", {}).then(result => {
		return {
			data: result,
			str: "获取所有联盟信息"
		};
	});
};

// 创建联盟
ctrl.createAder = function(req) {
	this.validEmpty([
		"api_name", "name", "resp_callback_url", "resp_callback_token"
	]);
	return this.request(req, "/v1/am/createAder", {
		api_name: req.body.api_name,
		name: req.body.name,
		resp_callback_url: req.body.resp_callback_url,
		resp_callback_token: req.body.resp_callback_token,
		is_pulled: req.body.is_pulled
	}).then(result => {
		return {
			data: result,
			str: "创建联盟"
		};
	});
};

// 根据联盟ID创建OFFER
ctrl.createOfferByUnion = function(req) {
	this.validEmpty([
		"ader_id", "app_id"
	]);
	return this.request(req, "/v1/am/createOfferByUnion", {
		ader_id: req.body.ader_id,
		app_id: req.body.app_id
	}).then(result => {
		return {
			data: result,
			str: "根据联盟ID创建OFFER"
		};
	});
};

// 给该APP设置分成和扣量
ctrl.SetDP = function(req) {
	this.validEmpty([
		"divide", "app_id", "deduction"
	]);
	return this.request(req, "/v1/app/SetDP", {
		app_id: req.body.app_id,
		deduction: req.body.deduction,
		divide: req.body.divide
	}).then(result => {
		return {
			data: result,
			str: "给该APP设置分成和扣量"
		};
	});
};

// 统计从该联盟获取的收入
ctrl.getAderIncome = function(req) {
	return this.request(req, "/v1/count/getAderIncome", {}).then(result => {
		return {
			data: result,
			str: "统计从该联盟获取的收入"
		};
	});
};

// 统计该AM的收入
ctrl.getAMIncome = function(req) {
	return this.request(req, "/v1/count/getAMIncome", {
		am_id: req.session.user.am_id
	}).then(result => {
		return {
			data: result,
			str: "统计该AM的收入"
		};
	});
};

// 统计下游的收入
ctrl.getChnAppIncome = function(req) {
	let param = {};
	if (req.body.chn_id) {
		param.chn_id = req.body.chn_id;
	}
	return this.request(req, "/v1/count/getChnAppIncome", param).then(result => {
		return {
			data: result,
			str: "统计下游的收入"
		};
	});
};



module.exports = new BaseController(ctrl);
