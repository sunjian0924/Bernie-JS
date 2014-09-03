'use strict';

// Module dependencies.
var application_root = __dirname,
	express = require( 'express' ), //Web framework
	path = require( 'path' ), //Utilities for dealing with file paths
	bodyParser = require('body-parser'),
	methodOverride = require('method-override'),
	morgan = require('morgan'),
	mysql = require('mysql'),
	mongoose = require('mongoose'),
	CAS = require('cas'),
	cookieParser = require('cookie-parser'),
	session = require('express-session'),
	evh = require('express-vhost');

//configure cas
var cas = new CAS({
	base_url: "https://muidp.miamioh.edu/cas",
	service: 'http://127.0.0.1:3000',
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
	host: 'localhost',
	user: 'root',
	password: 'wbzas4225069',
	database: 'Bernie'
});

mongoose.connect('mongodb://127.0.0.1/Bernie');

//Schemas
var Client = new mongoose.Schema({
	MUid: String,
	username: String,
	course_taking: String, //list of courses the student is currently taking
	course_chosen: String, //list of courses the student need help in
	time_available: String //list of times the student is available during a week
});

var Tutor = new mongoose.Schema({
	MUid: String,
	username: String,
	expertises: String, //list of courses this tutor is eligible of tutoring
	wishlist: String,
	cart: String, //list of courses this tutor has registered for tutoring
});

var Admin = new mongoose.Schema({
	MUid: String,
	username: String
});
//Models
var ClientModel = mongoose.model('Client', Client);
var TutorModel = mongoose.model('Tutor', Tutor);
var AdminModel = mongoose.model('Admin', Admin);

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
//app.use('/', express.static(path.join(application_root, 'client/auth')));

//cas happends here
/*app.post('/login', function(req, res) {
	cas.authenticate(req, res, function(err, status, username, extended) {
		console.log('haha');
	});
	
});*/


app.use(express.static(path.join(application_root, '../client/main')));




/*
	REST APIs
*/
//clear, just for testing
app.post('/clear', function(req, res) {
	ClientModel.find(function(err, clients) {
		for (var i = 0, n = clients.length; i < n; i++) {
			(function(j) {
				clients[j].remove(function(err) {
					if (err) throw err;
				});
			})(i);
			
		}
		res.send('success');
	});
});
//get all the clients
app.get('/clients', function(req, res) {
	return ClientModel.find(function(err, clients) {
		return res.send(clients);
	});
});

//add a new client
app.post('/clients', function(req, res) {
	var client = new ClientModel({
		MUid: req.body.MUid,
		username: req.body.username,
		course_taking: req.body.course_taking,
		course_chosen: req.body.course_chosen,
		time_available: req.body.time_available
	});
	client.save(function(err) {
		if (err) console.log(err);
		res.send('success');
	});
});

//get the client with MUid of :id
app.get('/clients/:id', function(req, res) {
	ClientModel.find({ MUid: req.params.id }, function(err, client) {
		res.send(client);
	});
});

//update the client with MUid of :id
app.put('/clients/:id', function(req, res) {
	ClientModel.find({ MUid: req.params.id }, function(err, client) {
		for (var i in req.body) {
			client[i] = req.body[i];
		}
		client.save(function(err) {
			if (err) throw err;
			res.send('success');
		});
	});
});

//get all the tutors
app.get('/tutors', function(req, res) {
	return TutorModel.find(function(err, tutors) {
		return res.send(tutors);
	});
});

//get the tutor with MUid of :id
app.get('/tutors/:id', function(req, res) {
	TutorModel.find({ MUid: req.params.id }, function(err, tutor) {
		res.send(tutor);
	});
});

//add a new tutor
app.post('/tutors', function(req, res) {
	var tutor = new TutorModel({
		MUid: req.body.MUid,
		username: req.body.username,
		expertises: req.body.expertises,
		wishlist: req.body.wishlist,
		cart: req.body.cart,
	});
	tutor.save(function(err) {
		if (err) throw err;
		res.send('success');
	});
});

//update a tutor with MUid of :id
app.put('/tutors/:id', function(req, res) {
	TutorModel.find({ MUid: req.params.id }, function(err, tutor) {
		for (var i in req.body) {
			tutor[i] = req.body[i];
		}
		tutor.save(function(err) {
			if (err) throw err;
			res.send('success');
		});
	});
});

//delete a tutor with MUid of :id
app.delete('/tutors/:id', function(req, res) {
	TutorModel.find({ MUid: req.params.id }, function(err, tutor) {
		tutor.remove(function(err) {
			if (err) throw err;
			res.send('success');
		});
	});
});

//get all the admin members
app.get('/admins', function(req, res) {
	return AdminModel.find(function(err, admins) {
		return res.send(admins);
	});
});

//add a new admin member
app.post('/admins', function(req, res) {
	var admin = new AdminModel({
		MUid: req.body.MUid,
		username: req.body.username
	});
});

//delete an admin member with MUid of :id
app.delete('/admins/:id', function(req, res) {
	AdminModel.find({ MUid: req.params.id }, function(err, admin) {
		admin.remove(function(err) {
			if (err) throw err;
			res.send('success');
		});
	});
});





/*
	Start server
*/
var port = 3000;

app.listen(port, function() {
	console.log('server is running on port 3000');
});




