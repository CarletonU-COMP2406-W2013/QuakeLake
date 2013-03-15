
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , chat = require('./routes/chat')
  , signup = require('./routes/signup')
	, game = require('./routes/game')
  , http = require('http')
, bcrypt = require('bcrypt')
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
  app.use(express.cookieParser());
  app.use(express.session({ secret: 'keyboard cat'}));
  app.use(app.router);
  app.use(require('stylus').middleware(__dirname + '/public'));
  app.use(express.static(path.join(__dirname, 'public')));
});


app.post('/login', function(request, response){
  MongoClient.connect("mongodb://localhost:27017/mydb", function(err, db) {
  if(!err) {
    console.log("We are connected ");
    var collection = db.collection('users');
    collection.findOne({username:request.body.user}, function(err, item){
    	  if(item != undefined){
    	  	 bcrypt.compare(request.body.password, item.password, function(err, authenticated){
			      if(authenticated){
				       request.session.username = item.username;
				       response.redirect("/chat");
			      }else{
				       response.redirect("/?error=invalid username or password");	
			      }
		      });
        console.log("Match!");
      }else{
        console.log("Error");
        response.redirect("/?error=invalid username or password");      		
      }    	
    	});
  }
});
});

app.post('/newUser', function(request, response){
  MongoClient.connect("mongodb://localhost:27017/mydb", function(err, db) {
  if(!err) {
  	  console.log("We are connected ");
    var collection = db.collection('users');
    collection.findOne({username:request.body.user}, function(err, item){
      if(item != undefined){
        console.log("User exists!");
        response.redirect("/signup?error=User already exists!");
              	
      	}else{
      		 var pw = request.body.password;
      		 bcrypt.genSalt(10, function(err, salt) {
		        //hash the given password using the salt we generated
          bcrypt.hash(pw, salt, function(err, hash) {
      	     collection.insert({username:request.body.user, password: hash}, function(err, item){
         	 if(err){
             console.log("signup error");         	 	
         	 	}
         	});
          response.redirect("/?error=User Created!");  
      	        
          });
	        });
             		
      	}    	
    	});
  }
});
});
app.get('/signup', signup.render);

app.get('/game', game.render);

app.get('/chat', chat.list);

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', function(req, res){
    if(req.session.username){
        res.redirect("/chat");
    }else{
        routes.index(req, res);
    }
});

app.post("/logout", function(req, res){
	req.session.destroy(function(err){
      if(err){
          console.log("Error: %s", err);
      }
      res.redirect("/");
  });	
});

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
