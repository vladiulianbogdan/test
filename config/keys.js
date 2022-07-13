/*!
=========================================================
* Copyright Codetruck Software (https://codetruck.io)
* Coded by Codetruck Software
=========================================================
* The above copyright informs you that all code is under
  copyright and all the intelectual property rights are owned by Codetruck Software.
*/

require('dotenv').config();

function mongoURL(options) {
	options = options || {};
	var URL = "mongodb://";
	if (options.password != "undefined" && options.username != "undefined") {
		URL += options.username + ":" + options.password + "@";
	}
	URL += (options.host || "localhost") + ":";
	URL += (options.port || "27017") + "/";
	URL += options.database || "admin";
	return URL;
}

const MONGO_USERNAME = process.env.DB_USERNAME;
const MONGO_PASSWORD = process.env.DB_PASS;
const MONGO_HOST = process.env.DB_HOST;
const MONGO_PORT = process.env.DB_PORT;
const MONGO_DB = process.env.DB_NAME;

const mongoURI = mongoURL({
	username: MONGO_USERNAME,
	password: MONGO_PASSWORD,
	host: MONGO_HOST,
	port: MONGO_PORT,
	database: MONGO_DB
});

module.exports = {
	mongoURI: mongoURI,
	secret: process.env.SECRET,
};
