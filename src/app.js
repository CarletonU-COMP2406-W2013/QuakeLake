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
, MemoryStore = express.session.MemoryStore
  , path = require('path');
  

var sessionStore = new MemoryStore();
  


var baseCharacters = require("./serverCharacter").baseCharacters;

var ServerGame = require("./serverGame").Game;


var MongoClient = require('mongodb').MongoClient;

var app = express();

var connect = require('connect');

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({store: sessionStore
        , secret: 'secret'
        , key: 'express.sid'}));
  
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
	};
      		
      		 
             		
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


app.get('/gamemanual', function(req, res) { 
	res.sendfile('public/gameinformation/gamemanual.pdf');
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

//Game server and chatting part

/* The game objects are stored in an object acting as a hastable. The game to which the players belong are 
also stored in a hastable, where the socketID is used as the key
*/
var games = {};
var gameNumber = 0;
var gameFull = true;
var gameByPlayers = {};

function startGame(player) {
	gameNumber += 1;
	games[gameNumber.toString()] = ServerGame(gameNumber);
	games[gameNumber.toString()].players.push(player);
	games[gameNumber.toString()].setMenuCharacters([baseCharacters[0](1100, 0), baseCharacters[1](1220, 0), baseCharacters[2](1100, 120), baseCharacters[3](1220, 120), baseCharacters[4](1100, 240), baseCharacters[5](1100, 450), baseCharacters[6](1220, 450), baseCharacters[7](1100, 570), baseCharacters[8](1220, 570)]);	
};



var Session = require('connect').middleware.session.Session;



var setEventHandlers = function() {
	socket.sockets.on("connection", onConnection);
};

function onMessage(data) {
	socket.sockets.emit("newMessage", data);
};

function onConnection(client) {	
	var hs = client.handshake;
	console.log(hs.sessionID + " -> " + hs.session.username + "\n");

	if (gameFull) {
		startGame(client);
		gameFull = false;
	} else {
		games[gameNumber.toString()].players.push(client);
		gameFull = true;	
	};
	
	gameByPlayers[client.id] = gameNumber;
	console.log(client.id+" connected");
	client.on("disconnect", onDisconnection);
	client.on("clicked", onClick);
	client.on("new character", onNewCharacter);
	client.on("giveCharacters", charactersForClient);
	client.on("identifyMe", sendIdentification);
	client.on("play turn", playTurn);
	//chatting
	client.on("message", onMessage);
	
};

function sendIdentification(data) {
	var currentGame = games[gameByPlayers[this.id].toString()];
	var first = false;
	if (currentGame.players[0].id === this.id) {
		first = true;
	}
	this.emit("identification", {id: this.id, gameNumber: gameByPlayers[this.id], first: first});
};

function charactersForClient(data, clientID) {
	if (clientID === undefined) {
		var currentGame = games[gameByPlayers[this.id].toString()];
	} else {
		var currentGame = games[gameByPlayers[clientID].toString()];
	}
	var characters = [];
	for (var i = 0; i < currentGame.playCharacters.length; i++) {
		for (var j = 0; j < currentGame.playCharacters[i].length; j++) {	
			var currentCharacter = currentGame.playCharacters[i][j];
			characters.push({type: currentCharacter.type, x: currentCharacter.x(), y: currentCharacter.y(), id: currentCharacter.id, owner: currentCharacter.owner, alpha: currentCharacter.alpha()});
		};
	};
	
	for(var i = 0; i < currentGame.players.length; i++) {
		currentGame.players[i].emit("updateCharacters", characters);
	};
};

function onNewCharacter(currentGame, currentPlayer, data, clientID, selection) {
	
	if (currentGame.checkBudget(baseCharacters[selection.pastTile.type]().cost())) {
		// Character too expensive
		return;
	};
	
	currentGame.playCharacters[currentPlayer].push(baseCharacters[selection.pastTile.type](data.x, data.y, currentGame.characterId));
	currentGame.playCharacters[currentPlayer][currentGame.playCharacters[currentPlayer].length-1].owner = clientID;
	
	currentGame.updateBudget();
	
	currentGame.characterId += 1;
};

function playTurn(data) {
	var currentGame = games[gameByPlayers[this.id].toString()];
	var currentPlayer = 0;
	
	if (this.id !== currentGame.players[0].id) {
		// Finds that the move comes from the second player
		currentPlayer = 1;
	}
	
	if (currentGame.checkTurn(currentPlayer)) {
		// Is not the player's turn, the move is ignored
		return;
	};
	
	//Finds selected tiles
	var selection = currentGame.mouseSelection(currentPlayer, data);
	if (selection.pastTile === null || selection.nextTile === null) {
		// No source and target selected
		this.emit("alert", {fromServer: "You need to select a source tile and a target tile. \nMake sure to select your own units."});
		return;
	}
	
	//Finds neighboring tiles
	var possiblyHurt = [];
	if (!currentGame.isStartingPhase()) {
		var allCharacters = currentGame.playCharacters[0].concat(currentGame.playCharacters[1]);
		for(var c = 0; c < allCharacters.length; c++) {
			var character = allCharacters[c];
			if (Math.sqrt(Math.pow(character.x()-selection.nextTile.x(),2)+Math.pow(character.y()-selection.nextTile.y(),2)) <= 150) {
				possiblyHurt.push(character);	
			};
		};
	};
	
	//Manages actions
	if (currentGame.isStartingPhase()) {
		onNewCharacter(currentGame, currentPlayer, data, this.id, selection);
	} else {
		//this.emit("alert", {fromServer: "wait, still not done yet"});
		//this.emit("alert", {fromServer: "You're attacking a guy of type "+selection.nextTile.type+" at "+selection.nextTile.x()+" "+selection.nextTile.y()});
		if (!selection.pastTile.action(selection.nextTile,possiblyHurt)) {
			this.emit("alert", {fromServer: "Invalid move! Sorry about that. Just do something else."});
			return;
		}
	};
	var won = currentGame.advanceGame();

	// Update the clients with character data
	charactersForClient(data, this.id); 
	
	if (won !== -1) {
		if (won === 0) {
			for(var i = 0; i < currentGame.players.length; i++) {
				currentGame.players[i].emit("alert", {fromServer: "The " + currentGame.players[0].handshake.session.username + " has won the game! Huzzah!"});
				
			}
			updateVictory(currentGame.players[0].handshake.session.username);
		} else if (won === 1) {
			for(var i = 0; i < currentGame.players.length; i++) {
				currentGame.players[i].emit("alert", {fromServer: "The " + currentGame.players[1].handshake.session.username + " has won the game! Yay!"});
			}
			updateVictory(currentGame.players[1].handshake.session.username);
		};
		var winner = currentGame.players[won]
		
		delete games[gameByPlayers[this.id].toString()];
		delete gameByPlayers[currentGame.players[0].id];
		delete gameByPlayers[currentGame.players[1].id];
		currentGame.players[0].disconnect();
		currentGame.players[1].disconnect();
	};
};

// If the winner is an anonymous player, no changes are made and an ERROR is shown in the server console 
function updateVictory(player){
 MongoClient.connect("mongodb://localhost:27017/mydb", function(err, db) {
		if(!err) {
   console.log("We are connected ");
   var collection = db.collection('users');
   collection.findOne({username:player}, function(err, item){
    if(item != undefined){
    	 var victories = item.numVictories;
    	 victories = victories + 1;
    	 collection.update({ username: player}, { $set: { numVictories: victories}}, function(err, result) {
        if(err){
           console.log("ERRRROOORRR!!!");      	
        	}    	 	
    	 	});
				}else{
				 console.log("ERRRRROORRR!!!");	
			 }
		 });
  }else{
   console.log("Error");
   response.redirect("/?error=Connection Error");      		
  }    	
 });
	}

function onClick(data) {
	this.broadcast.emit("clicked", data);
};

function onDisconnection() {
	console.log(this.id+" has left");
};

var httpserver = http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

var socket = require('socket.io').listen(httpserver);

var parseCookie = require('cookie').parse;
socket.configure(function (){
	socket.set('authorization', function (data, accept) {
    if (data.headers.cookie) {
        data.cookie = parseCookie(data.headers.cookie);
        data.sessionID = data.cookie['express.sid'].split('.')[0].split(':')[1];
        //console.log(data.cookie['connect.sid']);
        //console.log(data.cookie['express.sid']);
        //console.log(data.sessionID);
        // save the session store to the data object 
        // (as required by the Session constructor)
        data.sessionStore = sessionStore;
        for(var prop in sessionStore.sessions){
          console.log(prop + "\n");        	
        	}
        sessionStore.get(data.sessionID, function (err, session) {
            if (err || !session) {
            				console.log("OI");
                accept('Error', false);
            } else {
                // create a session object, passing data as request and our
                // just acquired session data
                data.session = new Session(data, session);
                //console.log(data.session.username);
                accept(null, true);
            }
        });
    } else {
       return accept('No cookie transmitted.', false);
    }
});
//socket.handshake.save();
});

setEventHandlers();

