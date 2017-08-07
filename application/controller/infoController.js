const	BaseController				=	require("../baseController.js"),
		api							=	require("../../global/api.js"),
		code						=	require("../../global/code.js"),
		ctrl						=	{};

ctrl.queryLogin = function( req ){
	if( api.isNull( req.session.user ) ){
		throw new Error( code.loginError.code );
	}else{
		return {
			data	:	req.session.user,
			str		:	"登陆信息"
		};
	}
};

ctrl.queryDetail = function( req ){
	this.validEmpty( "id" );
	return this.request( "/info/provider/providerDetail", { providerId : req.session.user.id } ).then( result => {
		return {
			data	:	result,
			str		:	"获取服务商详情"
		};
	});
};

ctrl.queryIndustry = function( req ){
	return this.request( "/info/provider/industryInfo" ).then( result => {
		return {
			data	:	result,
			str		:	"获取行业"
		};
	});
};

ctrl.queryType = function( req ){
	return this.request( "/info/provider/providerType" ).then( result => {
		return {
			data	:	result,
			str		:	"获取服务商类型"
		};
	});
};

ctrl.queryProvince = function( req ){
	return this.request( "/info/getProvince", null, "GET" ).then( result => {
		return {
			data	:	result,
			str		:	"获取省份"
		};
	});
};

ctrl.queryProductInfo = function( req ){
	return this.request( "/info/provider/productInfo", { providerId : req.session.user.id } ).then( result => {
		return {
			data	:	result,
			str		:	"获取服务商品列表"
		};
	});
};

ctrl.queryOrderInfo = function( req ){
	return this.request( "/info/provider/orderInfo", { providerId : req.session.user.id } ).then( result => {
		return {
			data	:	result,
			str		:	"获取服务订单列表"
			};
	});
};

ctrl.queryProductType = function( req ){
	return this.request( "/info/provider/typeData" ).then( result => {
		return {
			data	:	result,
			str		:	"获取服务商品类型"
		};
	});
};

ctrl.queryProductDetail = function( req ){
	return this.request( "/info/provider/productDetail", { productId : req.body.productId } ).then( result => {
		return {
			data	:	result,
			str		:	"获取服务商品详情"
		};
	});
};

ctrl.orderLog = function( req ){
	return this.request( "/info/provider/orderLog", { orderId : req.body.id } ).then( result => {
		return {
			data	:	result,
			str		:	"订单日志"
		};
	});
};

ctrl.queryProductDetail = function( req ){
	return this.request( "/info/provider/productDetail", { productId : req.body.productId } ).then( result => {
		return {
			data	:	result,
			str		:	"获取服务商品详情"
		};
	});
};

ctrl.getUserInfo = function( req ){
	return {
		data	:	req.session.user,
		str		:	"获取用户信息"
	};
};

module.exports = new BaseController( ctrl );
