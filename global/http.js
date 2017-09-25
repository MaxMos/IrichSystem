const Promise = require("bluebird"),
	urlParser = require("url"),
	path = require("path"),
	fs = Promise.promisifyAll(require("fs")),
	querystring = require("querystring"),
	BufferHelper = require("./bufferHelper.js"),
	mimes = require("./mimes.json"),
	http = require("http"),
	https = require("https"),
	log = require("./log.js");

exports.get = ({
	url,
	data,
	contentType
}) => {
	return this.request({
		url: url,
		data: data,
		contentType: contentType
	});
};

exports.post = ({
	url,
	data,
	contentType
}) => {
	return this.request({
		url: url,
		data: data,
		type: "POST",
		contentType: contentType
	});
};

exports.request = ({
	url,
	type = "GET",
	data = {},
	contentType,
	header = {}
}) => {
	let httpClient, options, headers = header;
	url = urlParser.parse(url);
	switch (url.protocol) {
		case "http:":
			httpClient = http;
			url.port = url.port === null ? 80 : url.port;
			break;

		case "https:":
			httpClient = https;
			url.port = url.port === null ? 443 : url.port;
			break;

		default:
			httpClient = http;
	}
	if (type === "GET") {
		let query = querystring.parse(url.query);
		for (let temp in data) {
			query[temp] = data[temp];
		}
		query = querystring.stringify(query);
		url.pathname += "?" + query;
		data = null;
		headers["Content-Length"] = Buffer.byteLength(query);
	} else if (type === "POST") {
		switch (contentType) {
			case "json":
				headers["Content-Type"] = "application/json";
				data = JSON.stringify(data);
				break;

			case null:
				data = JSON.stringify(data);
				break;

			case "multi":
				let boundary, suffix, str, file, buff;
				boundary = "--KNodeForm" + (Math.random() * 9007199254740992).toString(36);
				buff = new Buffer("");
				if (data.file) {
					for (let temp in data.file) {
						file = data.file[temp];
						suffix = path.extname(file);
						suffix = suffix.substring(1, suffix.length);
						buff = Buffer.concat([
							buff,
							new Buffer("\r\n--" + boundary + "\r\n" +
								'Content-Disposition: form-data; name="' + temp + '"; filename="' + path.basename(file) + '"\r\n' +
								"Content-Type: " + mimes[suffix] + "\r\n\r\n"),
							fs.readFileSync(file)
						]);
					}
				}
				if (data.param) {
					for (let temp in data.param) {
						buff = Buffer.concat([
							buff,
							new Buffer("\r\n--" + boundary + "\r\n" +
								'Content-Disposition: form-data; name="' + temp + '"\r\n\r\n' + data.param[temp])
						]);
					}
				}
				data = Buffer.concat([
					buff,
					new Buffer("\r\n--" + boundary + "--")
				]);
				headers["Content-Type"] = "multipart/form-data; boundary=" + boundary;
				break;

			default:
				headers["Content-Type"] = "application/json";
				data = JSON.stringify(data);
		}
		headers["Content-Length"] = Buffer.byteLength(data);
	}

	headers["User-Agent"] = "javascript";
	headers["X-XSRFToken"] = "2|0949e95b|4d12312c8cfc8fb9351ee716f65940ed|1506075890"
	headers["tag"] = "IrichSystem"	

	options = {
		hostname: url.hostname,
		port: url.port,
		path: url.pathname,
		method: type,
		encoding: "utf-8",
		headers: headers
	};
	if (url.port !== null) {
		options.port = url.port;
	} else {
		options.port = 80;
	}

	return new Promise((resolve, reject) => {
		let request = httpClient.request(options, function(response) {
			let result = {
					httpVersion: response.httpVersion,
					httpStatusCode: response.statusCode,
					headers: response.headers,
					body: "",
					trailers: response.trailers
				},
				bufferHelper = new BufferHelper();
			return response.on("data", function(chunk) {
				bufferHelper.concat(chunk);
			}).on("end", function() {
				result.body = bufferHelper.toBuffer().toString();
				resolve(result);
			});
		});

		request.on("error", error => {
			log.error("Problem with request:", error.message);
			reject(error);
		});

		if (data !== null) {
			request.write(data);
		}

		request.end();
	});
};
