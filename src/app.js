
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');
  

var MongoClient = require('mongodb').MongoClient;

var app = express();


app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(require('stylus').middleware(__dirname + '/public'));
  app.use(express.static(path.join(__dirname, 'public')));
});


app.post('/login', function(request, response){
  MongoClient.connect("mongodb://localhost:27017/mydb", function(err, db) {
  if(!err) {
    console.log("We are connected");
    var collection = db.collection('users');
    collection.findOne({username:request.body.user , password: request.body.password}, function(err, item){
      if(item != undefined){
        console.log("MAtch!");
        response.redirect("/game.html");      	
      	}else{
         console.log("Error");
         response.redirect("/index.html");      		
      		}    	
    	});
  }
});
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/users', user.list);

var httpserver = http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});


var io = require('socket.io').listen(httpserver);

io.sockets.on('connection', function (socket) {
	socket.on('msg', function(data) {
		io.sockets.emit('new', data);
	});
});
