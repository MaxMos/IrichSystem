if( !process.env.NODE_ENV ){
	process.env.NODE_ENV	=	"development";
	process.env.PORT 		=	3010;
}

const	path						=	require( "path" ),
		express						=	require( "express" ),
		compression					=	require( "compression" ),
		webpack						=	require( "webpack" ),
		bodyParser					=	require( "body-parser" ),
		cookieParser				=	require( "cookie-parser" ),
		session						=	require( "express-session" ),
		webpackConfig				=	require( "./global/webpack/dev" ),
		mainRouter					=	require( "./routes/mainRouter" ),
		pageRouter					=	require( "./routes/pageRouter" );

let port, app, _resolve, readyPromise,
	compiler, devMiddleware, hotMiddleware, staticPath, server;

compiler			=	webpack( webpackConfig );
devMiddleware		=	require( "webpack-dev-middleware" )( compiler, {
	publicPath	:	webpackConfig.output.publicPath,
	quiet		:	true
});
hotMiddleware		=	require( "webpack-hot-middleware" )( compiler, {
	log			:	() => {}
});

compiler.plugin( "compilation", compilation => {
	compilation.plugin( "html-webpack-plugin-after-emit", ( data, cb ) => {
		hotMiddleware.publish({ action: "reload" });
		cb();
	});
});

app					=	express();

app.use( bodyParser.json({
	limit       :	"5mb"
}) );

app.use( bodyParser.urlencoded({
	extended	:	false,
	limit		:	"5mb"
}) );

// session use
app.use( cookieParser() );

app.use( session({
	secret				:	"hbLqpY3aDsIAf3OtTiNzs63p5FbCnU4zEFXIhXmSpyNBWxDZpn0Db3cdxNv3M5l3RR1wENAH8AYPQppbDfLqvgPskg2Zy6bbpELsXm5IGQNa4OYA8mces7W02DDqFEaZ", // 建议使用 128 个字符的随机字符串
	resave				:	true,
	saveUninitialized	:	false,
	cookie				:	{
		maxAge		:   60 * 1000 * 120
	}
}));

app.use( compression() );

app.use( express.static( path.join( __dirname, "files" ) ) );

app.use( "/Interface", mainRouter );
app.use( "/dashboard", pageRouter );

app.use( require( "connect-history-api-fallback" )() );

app.use( devMiddleware );

app.use( hotMiddleware );

readyPromise	=	new Promise( resolve => {
	_resolve	=	resolve;
});

console.log( "> Starting dev server..." );
devMiddleware.waitUntilValid( () => {
	console.log( "> Listening at " + process.env.PORT + " \n" );
	_resolve();
});

server			=	app.listen( process.env.PORT );

module.exports = {
	ready: readyPromise,
	close: () => {
		server.close();
	}
};
