var mysql = require('mysql');
var fs = require('fs');
var now = require('../utils/localtime');
var prettyjson = require('prettyjson');
var options = {
	keysColor: 'yellow',
	dashColor: 'magenta',
	stringColor: 'white'
};
//1.connect to database
var connectionPool = mysql.createPool({
	host: 'localhost',
	user: 'root',
	password: '12345',
	database: 'Bernie',
	multipleStatements: true
});
//2.get data from database
var sql = "select MUid, customer, courseID, time, updated_at from tutors";
connectionPool.query(sql, function(err, result) {
	//3.create a report
	console.log(prettyjson.render(result, options));
	//4.close connection
	connectionPool.end();
});

