const	webpack					=	require("webpack"),
		merge					=	require("webpack-merge"),
		HtmlWebpackPlugin		=	require("html-webpack-plugin"),
		FriendlyErrorsPlugin	=	require("friendly-errors-webpack-plugin"),
		env						=	require("./env"),
		utils					=	require("./utils"),
		baseConfig				=	require("./base");

Object.keys( baseConfig.entry ).forEach( name => {
	baseConfig.entry[ name ]	=	[ "./global/webpack/client" ].concat( baseConfig.entry[ name ] );
});

module.exports = merge( baseConfig, {
	module		:	{
		rules	:	utils.styleLoaders({
			sourceMap	:	env.dev.cssSourceMap
		})
	},
	devtool		:	"#cheap-module-eval-source-map",
	plugins		:	[
		// 打印webpack错误
		// function(){
		//	this.plugin( "done", stats => {
		//		if( stats.compilation.errors && stats.compilation.errors.length ){
		//			console.log( stats.compilation.errors );
		//			process.exit( 1 );
		//		}
		//	});
		// },
		new webpack.DefinePlugin({
			"process.env"	:	env.dev.env
		}),
		new webpack.HotModuleReplacementPlugin(),
		new webpack.NoEmitOnErrorsPlugin(),
		new HtmlWebpackPlugin({
			filename		:	"index.html",
			template		:	"index.html",
			inject			:	true
		}),
		new FriendlyErrorsPlugin()
	]
});
