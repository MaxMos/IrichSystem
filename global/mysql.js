const	Promise						=	require("bluebird"),
		mysql						=	require("mysql"),
		config						=	require("./config.js"),
		log							=	require("./log.js"),
		poolWrite					=	Promise.promisifyAll( mysql.createPool( config.dbConfig ) ),
		poolRead					=	Promise.promisifyAll( mysql.createPool( config.dbConfigRead ) );

exports.format = ({ sql, obj }) => {
	let str = mysql.format( sql, obj );
	return str;
};

exports.getConnection = () => {
	return poolWrite.getConnectionAsync().then( connection => {
		return Promise.promisifyAll( connection );
	}).catch( err => {
		log.error( "[ MySQLError ] Cannot get write connection : " + err.message );
		throw err;
	});
};

exports.getReadConnection = () => {
	return poolRead.getConnectionAsync().then( connection => {
		return Promise.promisifyAll( connection );
	}).catch( err => {
		log.error( "[ MySQLError ] Cannot get read connection : " + err.message );
		throw err;
	});
};
