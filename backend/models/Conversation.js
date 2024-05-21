const pool = require("../config/databaseConfig");
const { v4: uuidv4 } = require("uuid");

module.exports.test = function test() {
	return uuidv4();
};
