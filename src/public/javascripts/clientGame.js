
var canvas;
var socket;
var characters = [];
var terrain; 

function init() {
	ownId = 0;
	
	socket = io.connect("http://localhost", {port:4000});
	
	canvas = document.getElementById("gameArea");
	context = canvas.getContext("2d");
	
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	canvas.addEventListener("click", clickHandler, false);
	canvas.addEventListener("keydown", keyHandler, false);

	terrain = new Image();
	terrain.src = "/graphics/grass.png";
	
	terrains = []
	for (var i = 0; i < 10; i++) {
		for (var j = 0; j < 7; j++) {
			terrains.push({image: terrain, x: i*100, y: j*100})
		};	
	};
	
	baseCharacters = [Blue, Cube, Flying, Goblin, Heavy, Archer, Healer, Mage, Warrior];
	
	menuCharacters = [Blue(1100, 0), Cube(1220, 0), Flying(1100, 120), Goblin(1220, 120), Heavy(1100, 240), Archer(1100, 450), Healer(1220, 450), Mage(1100, 570), Warrior(1220, 570)];

	playCharacters = [];
	
	enemyCharacters = [];

	pastSelection = {x:0, y:0, selected: false, tile: null};
	currentSelection = {x:0, y:0, selected: false, tile: null};
	
	enemySelection = {x:0, y:0, selected: false, tile: null};

	budget = 40;
	startingPhase = true;

	setEventHandlers();	
};

var isClicked = function(tile) {
	// Checks if a particular tile is clicked
	if (currentSelection.x > tile.x && currentSelection.x < tile.x+100 && currentSelection.y > tile.y && currentSelection.y < tile.y+100) {
		currentSelection.x = tile.x+50;
		currentSelection.y = tile.y+50;
		currentSelection.selected = true;
		currentSelection.tile = tile;
		return true;
	};
};

var clickHandler = function(event) {
	var x = event.pageX-canvas.offsetLeft;
	var y = event.pageY-canvas.offsetTop;
	pastSelection = {x: currentSelection.x, y: currentSelection.y, selected: currentSelection.selected, tile: currentSelection.tile};
	
	currentSelection.x = x;
	currentSelection.y = y;
	currentSelection.selected = false;
	currentSelection.tile = null;
	
	tiles = playCharacters.concat(menuCharacters).concat(terrains);
	
	emptyness = true;
	for (var i = 0; i < tiles.length; i++) {
		if(isClicked(tiles[i])) {
			emptyness = false;
			break;
		};
	};
	if (emptyness) {
		currentSelection.tile = null;
		currentSelection.selected = false;
	}
	
	socket.emit("clicked", {x: currentSelection.x, y: currentSelection.y, selected: currentSelection.selected});  
};

var confirmTurn = function() {
	if (startingPhase) {
		socket.emit("new character", {type: pastSelection.tile.type, x: currentSelection.x-50, y: currentSelection.y-50});
	} else {
		pastSelection.tile.x = currentSelection.x-50;
		pastSelection.tile.y = currentSelection.y-50;
		
		alert("Move confirmed, waiting for your opponent");
	};
};

var keyHandler = function(event) {
	var key = event.keyCode;
	if (key === 13) {		
		confirmTurn();
	};
	if (key === 27) {
		// Removes all selection
		pastSelection = {x:0, y:0, selected: false, tile: null};
		currentSelection = {x:0, y:0, selected: false, tile: null};
	};
}

var setEventHandlers = function() {
	socket.on("connect", onConnected);
	socket.on("identification", setIdentification);
	socket.on("disconnect", onDisconnected);
	socket.on("clicked", onClick);
	socket.on("new character", onNewCharacter);
};

function setIdentification(data) {
	// The server communicates to the client its ID
	ownId = data.id;
}

function onNewCharacter(data) {
	// Creates a new character
	playCharacters.push(baseCharacters[data.type](data.x, data.y, data.id));
	playCharacters[playCharacters.length-1].owner = data.owner;
	if (data.owner === ownId) {
		budget += -playCharacters[playCharacters.length-1].cost;
	}
};

function onClick(data) {
	// Updates the opponent's cursor
	enemySelection = data;
};

function onConnected() {
	console.log("Connected to server");
};

function onDisconnected() {
	console.log("Disconnected from server");
};

function drawGrass() {
	for (var i = 0; i < terrains.length; i++) {
		context.drawImage(terrains[i].image, terrains[i].x, terrains[i].y);
	};
};


function drawCharacters(characters) {
	for (var i = 0; i < characters.length; i++) {
		context.drawImage(characters[i].image, characters[i].x, characters[i].y);
	};
};

function drawPastSelection() {
	if (pastSelection.selected) {
		context.lineWidth = 5;
		context.strokeStyle = "#2E9AFE";
		context.strokeRect(pastSelection.x-50, pastSelection.y-50, 100, 100);
	};
};

function drawSelection() {
	if (currentSelection.selected) {
		context.lineWidth = 5;
		context.strokeStyle = "#03C817";
		context.strokeRect(currentSelection.x-50, currentSelection.y-50, 100, 100);
	};
};

function drawEnemySelection() {
	if (enemySelection.selected) {
		context.lineWidth = 5;
		context.strokeStyle = "#A31B00";
		context.strokeRect(enemySelection.x-50, enemySelection.y-50, 100, 100);
	};
}

function draw() {
	context.clearRect(0, 0, canvas.width, canvas.height);
	
	drawGrass();
	drawCharacters(menuCharacters);
	drawCharacters(playCharacters);
	
	drawEnemySelection();
	drawPastSelection();
	drawSelection();
	
};

function gameloop() {
	
	if (budget < 1 && startingPhase) {
			startingPhase = false;
			alert("Character choice completed.")
	};	
		
	draw();
};


