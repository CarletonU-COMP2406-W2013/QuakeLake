/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , chat = require('./routes/chat')
  , leaderboard = require('./routes/leaderboard')
  , profile = require('./routes/profile')
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
  
  app.use(function(req, res, next){
    res.locals.session = req.session;
    next();
  });
  
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

app.get('/leaderboard', function(request, response){
  MongoClient.connect("mongodb://localhost:27017/mydb", function(err, db) {
  if(!err) {
  	  console.log("We are connected ");
    var collection = db.collection('users');
    collection.find().sort([['numVitories', -1]]).toArray(function(err, items){
      console.log(items[0].username);
      leaderboard.leaderboard(request, response, items);    	
    	});	
	}
})});

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
      		var pw2 = request.body.password2;
      		if(pw != pw2){
      			response.redirect("/signup?error=Passwords does not match");	
      		}
      		bcrypt.genSalt(10, function(err, salt) {
			//hash the given password using the salt we generated
             		bcrypt.hash(pw, salt, function(err, hash) {
      	     			collection.insert({username:request.body.user, password: hash, numVictories: 0}, function(err, item){
         	 			if(err){
             					console.log("signup error");         	 	
         	 			}
         			});
          			response.redirect("/?error=User Created!");  
      	        
          		});
	        });
	});
      		
      		 
             		
    });
  }
});
});

app.post('/newPassword', function(request, response){
  MongoClient.connect("mongodb://localhost:27017/mydb", function(err, db) {
  if(!err) {
  	  console.log("We are connected ");
    var collection = db.collection('users');
    if(request.session.username){
    collection.findOne({username:request.session.username}, function(err, item){
      if(item == undefined){
        //console.log("User exists!");
        response.redirect("/?error=Something Terrible happened");
              	
      	}else{
      		 bcrypt.compare(request.body.oldPassword, item.password, function(err, authenticated){
			      if(authenticated){
				        var pw = request.body.newPassword;
      		     var pw2 = request.body.newPassword2;
      		     if(pw != pw2){
      		       response.redirect("/editProfile?error=Passwords does not match");	
      		 	    }
      		 	    bcrypt.genSalt(10, function(err, salt) {
		            //hash the given password using the salt we generated
              bcrypt.hash(pw, salt, function(err, hash) {
      	        collection.update({username:request.session.username}, {$set : {password: hash}}, function(err, item){
         	      if(err){
                 response.redirect("/editProfile?error=Something Terrible happened");         	 	
         	 	     }
         	     });
               response.redirect("/editProfile?error=Password Update");  
      	       });
	           });
      	  }else{
		          response.redirect("/editProfile?error=Invalid Old Password");      	  	
      	  	}    	
    	   });
      }
     });
    }else{
      response.redirect("/?error=Please Log in");    	
    	}
    }
  });
}	);

app.get('/user', function(req, res){
	MongoClient.connect("mongodb://localhost:27017/mydb", function(err, db) {
		if(!err) {
   console.log("We are connected ");
   var collection = db.collection('users');
   collection.findOne({username:req.query.username}, function(err, item){
    if(item != undefined){
    	 profile.showProfile(req, res, item);
				}else{
				 response.redirect("/404");	
			 }
		 });
  }else{
   console.log("Error");
   response.redirect("/?error=Connection Error");      		
  }    	
 });
});	



app.get('/signup', signup.render);

app.get('/game', game.render);

app.get('/chat', chat.list);

app.get('/editProfile', profile.editProfile);

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
