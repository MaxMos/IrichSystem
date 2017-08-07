
exports.isNull	=	obj => {
	return obj === null || obj === undefined;
};

exports.isEmpty =	obj => {
	return obj === null ||
			obj === undefined ||
			( typeof obj === "string" && obj === "" ) ||
			( typeof obj === "object" && obj.length !== undefined && obj.length === 0 ) ||
			( typeof obj === "object" && this.isObjectEmpty( obj ) );
};

exports.isImg	=	str => {
	return str.split("/")[0] == "image";
};

exports.isObjectEmpty = obj => {
	let key, hasOwnProperty = Object.hasOwnProperty;
	// null and undefined are "empty"
	if( obj === null || obj === undefined ){
		return true;
	}

	// Assume if it has a length property with a non-zero value
	// that that property is correct.
	if( obj.length > 0 ){
		return false;
	}
	if( obj.length === 0 ){
		return true;
	}

	// If it isn't an object at this point
	// it is empty, but it can't be anything *but* empty
	// Is it empty? Depends on your application.
	if( typeof obj !== "object" ){
		return true;
	}

	// Otherwise, does it have any properties of its own?
	// Note that this doesn't handle
	// toString and valueOf enumeration bugs in IE < 9
	for( key in obj ){
		if( hasOwnProperty.call(obj, key) ){
			return false;
		}
	}

	return true;
};

exports.hexToDec = hexStr => {
	hexStr	=	hexStr.toLowerCase();
	return this.convertBase( hexStr, 16, 10 );
};

exports.convertBase = ( str, fromBase, toBase ) => {
	let digits, outArray, power, i, out;
	digits		=	this.parseToDigitsArray( str, fromBase );
	if( digits === null ){
		return null;
	}
	outArray	=	[];
	power		=	[ 1 ];
	for( i = 0; i < digits.length; i++ ){
		// invariant: at this point, fromBase^i = power
		if( digits[ i ] ){
			outArray = this.add( outArray, this.multiplyByNumber( digits[ i ], power, toBase ), toBase );
		}
		power	=	this.multiplyByNumber( fromBase, power, toBase );
	}
	out		=	"";
	for( i = outArray.length - 1; i >= 0; i-- ){
		out	+=	outArray[ i ].toString( toBase );
	}
	return out;
};

exports.parseToDigitsArray = ( str, base ) => {
	let digits, ary, i, n;
	digits	=	str.split( "" );
	ary		=	[];
	for( i = digits.length - 1; i >= 0; i-- ){
		n	=	parseInt( digits[ i ], base );
		if( isNaN( n ) ){
			return null;
		}
		ary.push( n );
	}
	return ary;
};

exports.add = ( x, y, base ) => {
	let z, n, carry, i, xi, yi, zi;
	z		=	[];
	n		=	Math.max(x.length, y.length);
	carry	=	0;
	i		=	0;
	while( i < n || carry ){
		xi	=	i < x.length ? x[ i ] : 0;
		yi	=	i < y.length ? y[ i ] : 0;
		zi	=	carry + xi + yi;
		z.push( zi % base );
		carry	=	Math.floor( zi / base );
		i++;
	}
	return z;
};

exports.multiplyByNumber = ( num, x, base ) => {
	if (num < 0){
		return null;
	}
	if (num == 0){
		return [];
	}
	let result, power;
	result	=	[];
	power	=	x;
	while( true ){
		if( num & 1 ){
			result = this.add( result, power, base );
		}
		num		=	num >> 1;
		if( num === 0 ){
			break;
		}
		power	=	this.add( power, power, base );
	}
	return result;
};
