const	Promise				=	require("bluebird"),
		mysql				=	require("../global/mysql.js"),
		log					=	require("../global/log.js"),
		code				=	require("../global/code.js");

const	Model	=	function({ tableName }){
	this.tableName	=	tableName;
};

Model.prototype.select = function({ where = {}, field = [], order = [], group = [], limit = {} }){
	return mysql.getReadConnection().then( connection => {
		let whereStr = [], orderStr = "", groupStr, fieldStr, limitStr = "", temp, sql;
		fieldStr		=	field.length > 0	? mysql.format({
			sql		:	" ? ",
			obj		:	[ field ]
		}).replace( /'|"/g, "`" ) : " * ";
		groupStr		=	group.length > 0	? mysql.format({
			sql		:	" group by ? ",
			obj		:	[ group ]
		}).replace( /'|"/g, "`" ) : "";
		if( order.length > 0 ){
			orderStr	=	[];
			order.forEach( ( f, i, a ) => {
				if( typeof f != "object" ){
					orderStr.push( connection.escapeId( f ) );
				}else{
					orderStr.push( connection.escapeId( f.value ) + " " + f.type );
				}
			});
			orderStr = " order by " + orderStr.join(", ");
		}
		for( temp in where ){
			if( typeof where[ temp ] != "object" ){
				whereStr.push( connection.escapeId( temp ) + " = " + connection.escape( where[ temp ] ) );
			}else{
				switch( where[ temp ].type ){
					case "in":
						whereStr.push( connection.escapeId( temp ) + " " + where[ temp ].type + " " + where[ temp ].value );
					break;

					default:
						whereStr.push( connection.escapeId( temp ) + " " + where[ temp ].type + " " + connection.escape( where[ temp ].value ) );
					break;
				}
			}
		}
		if( limit.min !== undefined ){
			limitStr	=	" limit " + limit.min + "," + limit.num;
		}
		whereStr	=	whereStr.length > 0 ? "where " + whereStr.join( " and " ) : "";
		sql = "select " + fieldStr + " from " + this.tableName + " " + whereStr + " " + groupStr + " " + orderStr + " " + limitStr;
		return connection.queryAsync( sql ).then( result => {
			try{
				connection.release();
			}catch( e ){
				log.error( "[ SQLError ] connection release : " + e.message );
			}
			log.info( "[ SQL ] select : " + sql );
			return result;
		}).catch( err => {
			log.error( "[ SQLError ] select : " + sql );
			log.error( "[ SQLError ] " + err.message );
			throw err;
		});
	}).catch( e => {
		throw new Error( code.dbSysError.code );
	});
};

Model.prototype.insert = function( object = {} ){
	return mysql.getConnection().then( connection => {
		let sql		=	"insert into " + this.tableName + " set ?";
			sql		=	mysql.format({
			sql		:	sql,
			obj		:	object
		});
		return connection.queryAsync( sql ).then( result => {
			try{
				connection.release();
			}catch( e ){
				log.error( "[ SQLError ] connection release : " + e.message );
			}
			log.info( "[ SQL ] insert : " + sql );
			return result.insertId;
		}).catch( err => {
			log.error( "[ SQLError ] insert : " + sql );
			log.error( "[ SQLError ] " + err.message );
			throw err;
		});
	}).catch( e => {
		throw new Error( code.dbSysError.code );
	});
};

Model.prototype.update = function({ where = {}, obj = {} }){
	return mysql.getConnection().then( connection => {
		let whereStr = [],
			temp, sql;
		for( temp in where ){
			if( typeof where[ temp ] != "object" ){
				whereStr.push( connection.escapeId( temp ) + " = " + connection.escape( where[ temp ] ) );
			}else{
				whereStr.push( connection.escapeId( temp ) + " " + where[ temp ].type + " " + connection.escape( where[ temp ].value ) );
			}
		}
		whereStr	=	whereStr.length > 0 ? "where " + whereStr.join( " and " ) : "";
		sql			=	"update " + this.tableName + " set ? " + whereStr;
		sql			=	mysql.format({
			sql		:	sql,
			obj		:	obj
		});
		return connection.queryAsync( sql ).then( result => {
			try{
				connection.release();
			}catch( e ){
				log.error( "[ SQLError ] connection release : " + e.message );
			}
			log.info( "[ SQL ] update : " + sql );
			return result.affectedRows;
		}).catch( err => {
			log.error( "[ SQLError ] update : " + sql );
			log.error( "[ SQLError ] " + err.message );
			throw err;
		});
	}).catch( e => {
		throw new Error( code.dbSysError.code );
	});
};

Model.prototype.delete = function( where = {} ){
	return mysql.getConnection().then( connection => {
		let whereStr = [],
			temp, sql;
		for( temp in where ){
			if( typeof where[ temp ] != "object" ){
				whereStr.push( connection.escapeId( temp ) + " = " + connection.escape( where[ temp ] ) );
			}else{
				whereStr.push( connection.escapeId( temp ) + " " + where[ temp ].type + " " + connection.escape( where[ temp ].value ) );
			}
		}
		whereStr	=	whereStr.length > 0 ? "where " + whereStr.join( " and " ) : "";
		sql = "delete from " + this.tableName + " " + whereStr;
		return connection.queryAsync( sql ).then( result => {
			try{
				connection.release();
			}catch( e ){
				log.error( "[ SQLError ] connection release : " + e.message );
			}
			log.info( "[ SQL ] delete : " + sql );
			return result.affectedRows;
		}).catch( err => {
			log.error( "[ SQLError ] delete : " + sql );
			log.error( "[ SQLError ] " + err.message );
			throw err;
		});
	}).catch( e => {
		throw new Error( code.dbSysError.code );
	});
};

Model.prototype.query = function( sql = "", array = [] ){
	return mysql.getConnection().then( connection => {
		sql		=	mysql.format({
			sql		:	sql,
			obj		:	array
		});
		return connection.queryAsync( sql ).then( result => {
			try{
				connection.release();
			}catch( e ){
				log.error( "[ SQLError ] connection release : " + e.message );
			}
			log.info( "[ SQL ] query : " + sql );
			return result;
		}).catch( err => {
			log.error( "[ SQLError ] query : " + sql );
			log.error( "[ SQLError ] " + err.message );
			throw err;
		});
	}).catch( e => {
		throw new Error( code.dbSysError.code );
	});
};

Model.prototype.transaction = function( sqlArray = [] ){
	return mysql.getConnection().then( connection => {
		return connection.beginTransactionAsync().then( () => {
			sqlArray.forEach( ( o, i ) => {
				sqlArray[ i ].sql	=	mysql.format({
					sql		:	o.sql,
					obj		:	o.obj
				});
			});
			let resultArr = [];
			return Promise.mapSeries( sqlArray, obj => {
				return connection.queryAsync( obj.sql ).then( result => {
					resultArr.push( result );
					log.info( "[ SQL ] transaction query : " + obj.sql );
					return true;
				}).catch( err => {
					log.error( "[ SQLError ] transaction query error : " + err.message );
					log.error( "[ SQLError ] transaction query error : " + obj.sql );
					return connection.rollbackAsync().then( () => {
						log.error( "[ SQLError ] transaction rollback done!" );
						throw err;
					});
				});
			}).then( result => {
				return connection.commitAsync().then( () => {
					try{
						connection.release();
						log.info( "[ SQL ] transaction commit done!" );
					}catch( e ){
						log.error( "[ SQLError ] connection release : " + e.message );
					}
					return resultArr;
				}).catch( err => {
					log.error( "[ SQLError ] transaction commit : " + err.message );
					connection.rollbackAsync().then( () => {
						log.error( "[ SQLError ] transaction rollback done!" );
						throw err;
					});
				});
			}).catch( e => {
				throw e;
			});
		}).catch( err => {
			throw err;
		});
	}).catch( e => {
		throw new Error( code.dbSysError.code );
	});
};

Model.prototype.format = function({ sql, obj }){
	return mysql.format({
		sql		:	sql,
		obj		:	obj
	});
};

module.exports = Model;
