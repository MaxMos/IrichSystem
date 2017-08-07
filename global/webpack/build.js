const	path				=	require("path"),
		webpack				=	require("webpack"),
		merge				=	require("webpack-merge"),
		CopyWebpackPlugin	=	require("copy-webpack-plugin"),
		HtmlWebpackPlugin	=	require("html-webpack-plugin"),
		ExtractTextPlugin	=	require("extract-text-webpack-plugin"),
		OptimizeCSSPlugin	=	require("optimize-css-assets-webpack-plugin"),
		config				=	require("./env"),
		utils				=	require("./utils"),
		baseWebpackConfig	=	require("./base");

let env, webpackConfig;

env				=	config.build.env;

webpackConfig	=	merge( baseWebpackConfig, {
	module		:	{
		rules	:	utils.styleLoaders({
			sourceMap	:	config.build.productionSourceMap,
			extract		:	true
		})
	},
	devtool		:	config.build.productionSourceMap ? "#source-map" : false,
	output		:	{
		path			:	config.build.assetsRoot,
		filename		:	utils.assetsPath("js/[name].[chunkhash].js"),
		chunkFilename	:	utils.assetsPath("js/[id].[chunkhash].js")
	},
	plugins		:	[
		new webpack.DefinePlugin({
			"process.env"	:	env
		}),
		new webpack.optimize.UglifyJsPlugin({
			compress		:	{
				warnings	:	false
			},
			sourceMap		:	true
		}),
		new ExtractTextPlugin({
			filename		:	utils.assetsPath("css/[name].[contenthash].css")
		}),
		new OptimizeCSSPlugin({
			cssProcessorOptions	:	{
				safe	:	true
			}
		}),
		new HtmlWebpackPlugin({
			filename		:	config.build.index,
			template		:	"index.html",
			inject			:	true,
			minify			:	{
				removeComments			:	true,
				collapseWhitespace		:	true,
				removeAttributeQuotes	:	true
			},
			chunksSortMode	:	"dependency"
		}),
		new webpack.optimize.CommonsChunkPlugin({
			name			:	"vendor",
			minChunks		:	( module, count ) => {
				return (
					module.resource &&
					/\.js$/.test( module.resource ) &&
					module.resource.indexOf(
						path.join( __dirname, "../node_modules" )
					) === 0
				);
			}
		}),
		new webpack.optimize.CommonsChunkPlugin({
			name		:	"manifest",
			chunks		:	[ "vendor" ]
		})
	]
});

if( config.build.bundleAnalyzerReport ){
	let BundleAnalyzerPlugin	=	require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
	webpackConfig.plugins.push( new BundleAnalyzerPlugin() );
}

module.exports = webpackConfig;
