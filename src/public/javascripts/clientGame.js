
var canvas;
var socket;
var characters = [];
var terrain; 

function init() {
	socket = io.connect("http://localhost", {port:4000});

	canvas = document.getElementById("gameArea");
	context = canvas.getContext("2d");
	
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	canvas.addEventListener("click", clickHandler, false);

	terrain = new Image();
	terrain.src = "/graphics/grass.png";

	setEventHandlers();
};

var clickHandler = function(event) {
	var x = event.pageX-canvas.offsetLeft;
	var y = event.pageY-canvas.offsetTop;
	socket.emit("clicked", {x: x, y: y});  
};

var setEventHandlers = function() {
	socket.on("connect", onConnected);
	socket.on("disconnect", onDisconnected);
	socket.on("clicked", onClick);
};

function onClick(data) {
	alert("Your opponent clicked at ("+data.x+", "+data.y+")");
};

function onConnected() {
	console.log("Connected to server");
};

function onDisconnected() {
	console.log("Disconnected from server");
};

function drawGrass() {
	for (var i = 0; i < 10; i++) {
		for (var j = 0; j < 7; j++) {
			context.drawImage(terrain, i*100, j*100)
		};	
	};
};

function drawCharacters() {
	for (var i = 0; i < characters.length; i++) {
		context.drawImage(characters[i].image, characters[i].getPosition()[0], characters[i].getPosition()[1]);
	};
};

function draw() {
	context.clearRect(0, 0, canvas.width, canvas.height);
	
	drawGrass();
	drawCharacters();
	
};

function gameloop() {
	draw();
};


