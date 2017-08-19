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
ctrl.setStatus = function(req) {
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

module.exports = new BaseController(ctrl);
