const	config					=	require("./config.js"),
		moment					=	require("moment"),
		mkdirp					=	require("mkdirp"),
		fs						=	require("fs"),
		interval				=	"\r\n\r\n";

exports.info = ( str ) => {
	let currentTime		=	moment().format( "HH:mm:ss" );
	if( global.currentInfoLog === undefined ){
		global.currentInfoLog		=	currentTime + ":" + str + interval;
	}else{
		global.currentInfoLog		+=	currentTime + ":" + str + interval;
	}
	if( global.currentLogTimer === undefined ){
		global.currentLogTimer		=	setTimeout( this.logEnd, 15000 );
	}
};

exports.warning = ( str ) => {
	let currentTime		=	moment().format( "HH:mm:ss" );
	if( global.currentWarningLog === undefined ){
		global.currentWarningLog	=	currentTime + ":" + str + interval;
	}else{
		global.currentWarningLog	+=	currentTime + ":" + str + interval;
	}
	if( global.currentLogTimer === undefined ){
		global.currentLogTimer		=	setTimeout( this.logEnd, 15000 );
	}
};

exports.error = ( str ) => {
	let currentTime		=	moment().format( "HH:mm:ss" );
	if( global.currentErrorLog === undefined ){
		global.currentErrorLog		=	currentTime + ":" + str + interval;
	}else{
		global.currentErrorLog		+=	currentTime + ":" + str + interval;
	}
	if( global.currentLogTimer === undefined ){
		global.currentLogTimer		=	setTimeout( this.logEnd, 15000 );
	}
};

exports.logEnd = () => {
	try{
		if( global.currentLogTimer !== undefined ){
			clearTimeout( global.currentLogTimer );
			global.currentLogTimer		=	undefined;
		}
		let dirName, endLogStr;
		dirName			=	config.logDir + "/" + moment().format( "YYYY-MM-DD" );
		endLogStr		=	moment().format( "HH:mm:ss" ) + ":请求结束\r\n\r\n\r\n\r\n";
		if( !fs.existsSync( dirName ) ){
			mkdirp.sync( dirName );
		}
		if( global.currentInfoLog !== undefined && global.currentInfoLog.length > 0 ){
			global.currentInfoLog		+=	endLogStr;
			fs.appendFile( dirName + "/info.log", global.currentInfoLog, ( err ) => {
				if( err ){
					console.log( err );
				}
			});
			global.currentInfoLog		=	undefined;
		}
		if( global.currentWarningLog !== undefined && global.currentWarningLog.length > 0 ){
			global.currentWarningLog	+=	endLogStr;
			fs.appendFile( dirName + "/warning.log", global.currentWarningLog, ( err ) => {
				if( err ){
					console.log( err );
				}
			});
			global.currentWarningLog	=	undefined;
		}
		if( global.currentErrorLog !== undefined && global.currentErrorLog.length > 0 ){
			global.currentErrorLog		+=	endLogStr;
			fs.appendFile( dirName + "/error.log", global.currentErrorLog, ( err ) => {
				if( err ){
					console.log( err );
				}
			});
			global.currentErrorLog		=	undefined;
		}
	}catch( e ){

	}
};
