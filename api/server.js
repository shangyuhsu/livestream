var express = require('express');
var app = express();
var server = require('http').Server(app);
var auth = require('./auth/routes');
var api = require('./api/api')(server);
require('mongoose').connect('mongodb://localhost/test');

var bodyParser = require('body-parser');
var shell = require('shelljs');
var cors = require('cors');

function execIce() {
	var iceCommand = 'icecast -c /usr/local/etc/icecast.xml';
	shell.exec(iceCommand, {async:true});
}

var corsOptions = {
  origin: 'http://localhost:4200',
  optionsSuccessStatus: 200
}

app.use(cors(corsOptions));

//MIDDLEWARE
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use('/api', api);
app.use('/auth', auth);

app.use(function(err, req, res, next) {
  // if error thrown from jwt validation check
  if (err.name === 'Unauthorized') {
    res.status(401).send('Invalid token');
    return;
  }

  else if (err.name.substring(0,6) === 'Error:') {
    res.status(500)
    return;
  }
});

execIce();
// export the app for testing
server.listen(3000);
