const express = require('express');
const app = express();
const bodyParser = require('body-parser');
// var fileUpload = require('express-fileupload');
//var bcrypt = require('bcrypt'); // It is used for encrypt password
//var multipart  = require('connect-multiparty');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(fileUpload());

// Configuring the database
var passport = require('passport');
var session = require('express-session');
app.all('/*', function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Credentials", "true");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Key, Authorization");
	res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE, PATCH");
	next()
});
app.use(session({
	secret: 'secretOrKey',
	saveUninitialized: true,
	resave: true
  }));
  app.use(passport.initialize());
  app.use(passport.session());
	require('./passport/passport.js')(passport);  
require('./routes/routes.js')(app);

// define a simple route
app.get('/', (req, res) => {
    res.json({"message": "test."});
});

// listen for requests
app.listen(3000, () => {
    console.log("Server is listening on port 3000");
});
