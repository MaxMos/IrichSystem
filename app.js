const	express						=	require("express"),
		path						=	require("path"),
		compression					=	require("compression"),
		logger						=	require("morgan"),
		bodyParser					=	require("body-parser"),
		cookieParser				=	require("cookie-parser"),
		session						=	require("express-session"),
		debug						=	require( "debug" )( "providerSystem:server" ),
		http						=	require( "http" ),
		mainRouter					=	require("./routes/mainRouter"),
		pageRouter					=	require("./routes/pageRouter"),
		app							=	express();

// use dev mode :method :url :status :response-time ms - :res[content-length]
app.use( logger( "dev" ) );

app.use( compression() );

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

app.use( "/Interface", mainRouter );
app.use( "/dashboard", pageRouter );

app.use( express.static( path.join( __dirname, "files" ) ) );

app.use( "/public", express.static( path.join( __dirname, "dist/public" ) ) );

app.use( "/*", ( req, res, next ) => {
	if( req.originalUrl === "/" && req.session.user !== null && req.session.user !== undefined ){
		res.redirect( "/dashboard" );
	}else if( req.originalUrl !== "/" && ( req.session.user === null || req.session.user === undefined ) ){
		res.redirect( "/" );
	}else{
		next();
	}
});

app.use( "/*", express.static( path.join( __dirname, "dist" ) ) );

app.use( ( req, res, next ) => {
	let err		=	new Error( "Not Found" );
	err.status	=	404;
	next( err );
});

app.use( ( err, req, res, next ) => {
	res.status( err.status || 500 );
});

let normalizePort = val => {
	let port	=	Number.parseInt( val, 10 );

	if( Number.isNaN( port ) ){
		return val;
	}
	if(port >= 0){
		return port;
	}
	return false;
};

let server		=	http.createServer( app ),
	port		=	normalizePort(	process.env.PORT || "3010"	);

app.set( "port", port );

server.listen( port );

server.on( "error", error => {
	let bind = typeof port === "string" ? "Pipe " + port : "Port " + port;
	if( error.syscall !== "listen" ){
		throw error;
	}

	switch( error.code ){
		case "EACCES":
			console.error( bind + " requires elevated privileges" );
			process.exit( 1 );
		break;

		case "EADDRINUSE":
			console.error( bind + " is already in use" );
			process.exit( 1 );
		break;

		default:
			throw error;
	}
});
server.on( "listening", ( ) => {
	let addr = server.address(),
		bind = typeof addr === "string" ? "Pipe " + addr : "Port " + addr.port;

	debug( "Listening on " + bind );
});
