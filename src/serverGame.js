var io = require("socket.io");
var baseCharacters = require("./serverCharacter").baseCharacters;

var socket;
var players;

function init() {	
	turn = 0;
	
	id = 0;
	
	players = [];
	
	playCharacters = [];
	
	setEventHandlers();
};

var setEventHandlers = function() {
	socket.sockets.on("connection", onConnection);
};

function onConnection(client) {
	players.push(this.id);
	client.emit("identification", {id: client.id});
	console.log(client.id+" connected");
	client.on("disconnect", onDisconnection);
	client.on("clicked", onClick);
	client.on("new character", onNewCharacter);
};

function onNewCharacter(data) {
	playCharacters.push(baseCharacters[data.type](data.x, data.y, id));
	playCharacters[playCharacters.length-1].owner = this.id; 
	//this.broadcast.emit("new character", {type: data.type, x: data.x, y: data.y});
	socket.sockets.emit("new character", {type: data.type, x: data.x, y: data.y, id: id, owner: this.id});
	
	id += 1;
};

function onClick(data) {
	this.broadcast.emit("clicked", data);
};

function onDisconnection() {
	console.log(this.id+" has left");
};

socket = io.listen(4000);

init();
