var io = require("socket.io");

var socket;
var players;

function init() {
	players = [];
	setEventHandlers();
};

var setEventHandlers = function() {
	socket.sockets.on("connection", onConnection);
};

function onConnection(client) {
	console.log(client.id+" connected");
	client.on("disconnect", onDisconnection);
	client.on("clicked", onClick);
};

function onClick(data) {
	this.broadcast.emit("clicked", data);
}

function onDisconnection() {
	console.log(this.id+" has left");
};

socket = io.listen(4000);

init();
