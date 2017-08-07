const	path	=	require("path");

module.exports = {
	build	:	{
		env							:	{
			ENV		:	'"production"'
		},
		index						:	path.resolve( __dirname, "..", "..", "dist/index.html" ),
		assetsRoot					:	path.resolve( __dirname, "..", "..", "dist" ),
		assetsSubDirectory			:	"public",
		assetsPublicPath			:	"/",
		productionSourceMap			:	true,
		bundleAnalyzerReport		:	process.env.npm_config_report
	},
	dev		:	{
		env							:	{
			ENV		:	'"development"'
		},
		port						:	3010,
		assetsSubDirectory			:	"public",
		assetsPublicPath			:	"/",
		cssSourceMap				:	false
	}
};
