const	Promise						=	require("bluebird"),
		redis						=	Promise.promisifyAll( require("redis") ),
		config						=	require("./config.js"),
		log							=	require("./log.js"),
		client						=	redis.createClient( config.redisConfig );

client.on( "error", err => {
	log.error( "[ RedisError ]" + err );
});

exports.get = name => {
	if( config.redisConfig.use ){
		return client.getAsync( name ).then( value => {
			if( value === null || value === "" ){
				return null;
			}
			let time	=	new Date().getTime();
			value		=	JSON.parse( value );
			if( time < value.time ){
				log.info( "[ Redis ] get redis data " + name );
				return value.data;
			}else{
				log.info( "[ Redis ] get redis data time expire " + name );
				return null;
			}
		}).catch( err => {
			log.error( "[ RedisError ] Cannot get redis data " + name + " : " + err.message );
			return null;
		});
	}else{
		return Promise.try( () => {
			return null;
		});
	}
};

exports.set = ( name, promise, expireName ) => {
	return promise.then( value => {
		let expire, time;
		if( config.redisConfig.use ){
			expire		=	config.redisTime[ expireName ];
			expire		=	expire === null || expire === undefined ? 0 : expire;
			time		=	new Date().getTime();
			if( expire > 0 ){
				client.setAsync( name, JSON.stringify({
					data	:	value,
					time	:	time + ( expire * 3600 * 1000 )
				})).then( result => {
					log.info( "[ Redis ] set redis data " + name );
				}).catch( err => {
					log.error( "[ RedisError ] Cannot set redis data " + name + " : " + err.message );
				});
			}
		}
		return value;
	});
};

exports.del = name => {
	return client.delAsync( name ).then( () => {
		log.info( "[ Redis ] del redis data " + name );
		return true;
	}).catch( err => {
		log.error( "[ RedisError ] Cannot del redis data " + name + " : " + err.message );
		return false;
	});
};
