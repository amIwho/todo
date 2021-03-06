
/**
 * Module dependencies.
 */

var express = require('express')
  , mongoose = require('mongoose')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 4000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect("mongodb://localhost/todo");

var TodoSchema = new mongoose.Schema({
	username: String,
	ready: [],
	notReady: []
}),
	Todo = mongoose.model('Todo', TodoSchema);


// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', function(req, res) {
	Todo.find({"username": "noname"}, "notReady ready", function(err, docs) {
		res.render('index', {list:docs});
	});
});

app.get('/init', function(req, res) {
	Todo.find({"username": "noname"}, "notReady ready", function(err, docs) {
		res.send(docs[0]);
	});
});

app.post('/', function(req, res) {
	Todo.update({ "username": "noname"}, req.body, {upsert: true}, function(err, numberAffected, raw) {
		if (err) console.log('got an error ' + err);
		console.log('The number of updated documents was %d', numberAffected);
		console.log(raw);
	});
	res.send(req.body);
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
