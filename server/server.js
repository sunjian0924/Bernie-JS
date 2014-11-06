'use strict';

// Module dependencies.
var application_root = __dirname,
	express = require( 'express' ), //Web framework
	path = require( 'path' ), //Utilities for dealing with file paths
	bodyParser = require('body-parser'),
	methodOverride = require('method-override'),
	morgan = require('morgan'),
	mysql = require('mysql'),
	CAS = require('cas'),
	cookieParser = require('cookie-parser'),
	session = require('express-session'),
	now = require('../utils/localtime');

//configure cas
var cas = new CAS({
	base_url: "https://muidp.miamioh.edu/cas",
	service: 'http://rlcltmsd01.mcs.miamioh.edu:3000/',
});

//Create server
var app = express();

//session management middleware
app.use(cookieParser());
app.use(session({
	secret: 'dfasdfa'
}));

//Connect to database
var connectionPool = mysql.createPool({
	host: '172.17.0.210',
	user: 'root',
	password: '12345',
	database: 'Bernie',
	multipleStatements: true
});


// Configure server
//parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));

//parse application/json
app.use(bodyParser.json());

// parse application/vnd.api+json as json
app.use(bodyParser.json({type: 'application/vnd.api+json'}));

app.use(methodOverride());
app.use(morgan(':remote-addr :method :url :status'));
//Where to serve static content
//app.use(express.static(path.join(application_root, '../client/auth')));

//cas happends here
app.use('/', function(req, res) {
	cas.authenticate(req, res, function(err, status, username, extended) {
		console.log('haha');
	});
	res.send('ok');
	
});

//app.use(express.static(path.join(application_root, '../client/main')));





/*
	REST APIs
*/
//appointment
app.get('/appointments', function(req, res) {
	var sql = "select * from appointments";
	connectionPool.query(sql, function(err, result) {
		res.send(result);
	});
});
//match
app.get('/matchings/:id/:courseID', function(req, res) {
	var sql = "select hiredtutors.MUid, tutortimes.time from hiredtutors inner join tutortimes on hiredtutors.MUid=tutortimes.MUid where hiredtutors.expertise =" + mysql.escape(req.params.courseID) + "and tutortimes.time IN (select time from clienttimes where MUid=" + mysql.escape(req.params.id) + ")";
	connectionPool.query(sql, function(err, result) {
		if (result.length !== 0) {
			var sql1 = "insert into appointments (MUid, courseID, time, customer, updated_at) values (" + mysql.escape(result[0].MUid) + ", " + mysql.escape(req.params.courseID) + ", " + mysql.escape(result[0].time) + ", " + mysql.escape(req.params.id) + ", " + mysql.escape(now()) + ")"; 
			var sql2 = "delete from clientcourses where MUid='" + req.params.id + "' and courseID='" + req.params.courseID + "'";
			var sql3 = "delete from clienttimes where MUid='" + req.params.id + "' and time='" + result[0].time + "'";
			var sql4 = "delete from tutortimes where MUid='" + result[0].MUid + "' and time='" + result[0].time + "'";
			var sql = sql1 + "; " + sql2 + "; " + sql3 + "; " + sql4;
			connectionPool.query(sql, function(err) {
				res.send(result[0]);
			});		
		} else {
			res.send({fail: 'none'});
		}
	});

});
//get all the times clients have chosen
app.get('/clienttimes/:id/notAvailable', function(req, res) {
	var sql = "select time from appointments where customer=" + mysql.escape(req.params.id);
	connectionPool.query(sql, function(err, times) {
		res.send(times);
	});
});
app.get('/clienttimes/:id/available', function(req, res) {
	var sql = "select time from clienttimes where MUid=" + mysql.escape(req.params.id);
	connectionPool.query(sql, function(err, times) {
		res.send(times);
	});
});

app.get('/tutortimes/:id/available', function(req, res) {
	var sql = "select time from tutortimes where MUid=" + mysql.escape(req.params.id);
	connectionPool.query(sql, function(err, times) {
		res.send(times);
	});
});
//get all the expertises for a tutor
app.get('/expertises/:id', function(req, res) {
	var sql = "select expertise from hiredtutors where MUid=" + mysql.escape(req.params.id);
	connectionPool.query(sql, function(err, expertises) {
		res.send(expertises);
	});
});
//get all the hired tutors
app.get('/admin', function(req, res) {
	var sql = "select * from hiredtutors";
	connectionPool.query(sql, function(err, rows) {
		res.send(rows);
	});
});
//add a new tutor
app.post('/admin', function(req, res) {
	var sql = "insert into hiredtutors (MUid, updated_at, expertise) values ('" + req.body.MUid + "', '" + now() + "', '" + req.body.expertise + "')";
	connectionPool.query(sql, function(err, result) {
		res.send(result);
	});
});

//delete a new tutor
app.delete('/admin', function(req, res) {
	var sql = "delete from hiredtutors where MUid='" + req.body.MUid + "' and expertise='" + req.body.expertise + "'";
	connectionPool.query(sql, function(err, result) {
		res.send(result);
	});
});

//get cart info with MUid of :id
app.get('/cart/:id', function(req, res) {
	var sql = "select * from appointments where MUid=" + mysql.escape(req.params.id);
	connectionPool.query(sql, function(err, rows) {
		res.send(rows);
	});
});
//add a new item into the cart with MUid of :id
app.post('/cart', function(req, res) {
	var sql = "insert into appointments (MUid, customer, time, courseID, updated_at) values ('" + req.body.MUid + "', '" + req.body.owner + "', '" + req.body.time + "', '" + req.body.course + "', '" + now() + "')";
	connectionPool.query(sql, function(err, result) {
		res.send(result);
	}); 
});
//delete a new item from cart
app.delete('/cart', function(req, res) {
	var sql = "delete from appointments where MUid='" + req.body.tutor + "' and customer='" + req.body.customer + "' and time='" + req.body.time + "' and courseID='" + req.body.course + "'";
	connectionPool.query(sql, function(err, result) {
		res.send(result);
	});
});

app.get('/register/:id', function(req, res) {
	var sql1 = "select courseID from academics where MUid=" + mysql.escape(req.params.id);
	var sql2 = "select time from clienttimes where MUid=" + mysql.escape(req.params.id);
	var sql3 = "select courseID from clientcourses where MUid=" + mysql.escape(req.params.id);
	var sql4 = "select courseID, time from appointments where customer=" + mysql.escape(req.params.id);
	var sql = sql1 + "; " + sql2 + "; " + sql3 + "; " + sql4;
	connectionPool.query(sql, function(err, results) {	
		var data = {
			courses_taking: results[0],
			times_available: results[1],
			courses_in_waitinglist: results[2],
			courses_times_chosen: results[3]
		};
		res.send(data);
	});
});
//update register for clients
app.put('/register', function(req, res) {
	//delete all 
	//add all
	var sql1 = "delete from clientcourses where MUid='" + req.body.MUid + "'";
	var sql2 = "delete from clienttimes where MUid='" + req.body.MUid + "'";
	var addCourseSqls = [];
	req.body.waitinglist = JSON.parse(req.body.waitinglist);
	req.body.availableTime = JSON.parse(req.body.availableTime);
	for (var i = 0, n = req.body.waitinglist.length; i < n; i++) {
		addCourseSqls.push("insert into clientcourses (MUid, courseID, updated_at) values ('" + req.body.MUid + "', '" + req.body.waitinglist[i] + "', '" + now() + "')");
	}
	var addTimeSqls = [];
	for (var i = 0, n = req.body.availableTime.length; i < n; i++) {
		addTimeSqls.push("insert into clienttimes (MUid, time, updated_at) values ('" + req.body.MUid + "', '" + req.body.availableTime[i] + "', '" + now() + "')");
	}
	var sql = sql1 + "; " + sql2;
	for (var i = 0, n = addCourseSqls.length; i < n; i++) {
		sql += "; " + addCourseSqls[i];
	}
	for (var i = 0, n = addTimeSqls.length; i < n; i++) {
		sql += "; " + addTimeSqls[i];
	}
	connectionPool.query(sql, function(err, result) {
		res.send(result);
	});
});

//update register for tutors
app.put('/tutor_register', function(req, res) {
	//delete all 
	//add all
	var sql = "delete from tutortimes where MUid='" + req.body.MUid + "'";
	req.body.availableTime = JSON.parse(req.body.availableTime);
	var addTimeSqls = [];
	for (var i = 0, n = req.body.availableTime.length; i < n; i++) {
		addTimeSqls.push("insert into tutortimes (MUid, time, updated_at) values ('" + req.body.MUid + "', '" + req.body.availableTime[i] + "', '" + now() + "')");
	}
	for (var i = 0, n = addTimeSqls.length; i < n; i++) {
		sql += "; " + addTimeSqls[i];
	}
	connectionPool.query(sql, function(err, result) {
		res.send(result);
	});
});

//get all the published help requests
app.get('/shopping', function(req, res) {
	var sql1 = "select * from clientcourses";
	var sql2 = "select * from clienttimes";
	var sql = sql1 + "; " + sql2;
	connectionPool.query(sql, function(err, results) {
		var data = {
			clientcourses: results[0],
			clienttimes: results[1]
		};
		res.send(data);
	});
});
//
app.delete('/shopping', function(req, res) {
	var sql1 = "delete from clientcourses where MUid='" + req.body.owner + "' and courseID='" + req.body.course + "'";
	var sql2 = "delete from clienttimes where MUid='" + req.body.owner + "' and time='" + req.body.time + "'";
	var sql = sql1 + "; " + sql2; 
	connectionPool.query(sql, function(err, result) {
		res.send(result);
	});
});



app.get('/profile/:id', function(req, res) {

});



/*
	Start server
*/
var port = 3000;

app.listen(port, function() {
	console.log('server is running on port 3000');
});




