const	utils			=	require("./utils"),
		config			=	require("./env");

let isProduction	=	process.env.NODE_ENV === "production";

module.exports = {
	loaders		:	utils.cssLoaders({
	sourceMap	:	isProduction ? config.build.productionSourceMap : config.dev.cssSourceMap,
	extract		:	isProduction
	})
};
