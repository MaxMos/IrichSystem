const	path				=	require("path"),
		ExtractTextPlugin	=	require("extract-text-webpack-plugin"),
		config				=	require("./env");

exports.assetsPath = _path => {
	let assetsSubDirectory = process.env.NODE_ENV === "production"
		? config.build.assetsSubDirectory
		: config.dev.assetsSubDirectory;
	return path.posix.join( assetsSubDirectory, _path );
};

exports.cssLoaders = ( options = {} ) => {
	let cssLoader = {
		loader		:	"css-loader",
		options		:	{
			minimize	:	process.env.NODE_ENV === "production",
			sourceMap	:	options.sourceMap
		}
	};

	let generateLoaders = ( loader, loaderOptions ) => {
		let loaders = [ cssLoader ];
		if( loader ){
			loaders.push({
				loader		:	loader + "-loader",
				options		:	Object.assign( {}, loaderOptions, {
					sourceMap	:	options.sourceMap
				})
			});
		}

		if( options.extract ){
			return ExtractTextPlugin.extract({
				use 		: 	loaders,
				fallback 	: 	"vue-style-loader"
			});
		}else{
			return ["vue-style-loader"].concat( loaders );
		}
	};

	return {
		css			:	generateLoaders(),
		postcss		:	generateLoaders(),
		less		:	generateLoaders("less"),
		sass		:	generateLoaders("sass", { indentedSyntax: true }),
		scss		:	generateLoaders("sass"),
		stylus		:	generateLoaders("stylus"),
		styl		:	generateLoaders("stylus")
	};
};

exports.styleLoaders = options => {
	let output = [];
	let loaders = exports.cssLoaders(options);
	for( let extension in loaders ){
		let loader = loaders[ extension ];
		output.push({
			test: new RegExp( "\\." + extension + "$" ),
			use: loader
		});
	}
	return output;
};
