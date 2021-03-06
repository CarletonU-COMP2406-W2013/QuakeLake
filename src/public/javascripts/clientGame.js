
var canvas;
var socket;
var characters = [];
var terrain; 

function init() {
	first = false;

	ownId = 0;
	
	gameNumber = 0;
	
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

	budget = 30;
	
	startingPhase = true;

	pastSelection = {x:0, y:0, selected: false, tile: null};
	currentSelection = {x:0, y:0, selected: false, tile: null};
	
	enemySelection = {x:0, y:0, selected: false, tile: null};

	socket = io.connect("http://localhost", {port:3000});

	setEventHandlers();
	
	socket.emit("identifyMe");	
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
	
	if (startingPhase) {
		tiles = playCharacters.concat(menuCharacters).concat(terrains);
	} else {
		tiles = playCharacters.concat(terrains);
	};
	
	
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
	
	if (pastSelection.selected === true && currentSelection.selected === true) {
		socket.emit("play turn", {pastx: pastSelection.x-50, pasty: pastSelection.y-50, x: currentSelection.x-50, y: currentSelection.y-50});
		
		currentSelection.tile = null;
		currentSelection.tile = null;		
		currentSelection.selected = false;
		pastSelection.selected = false;
		
	};
	//socket.emit("clicked", {x: currentSelection.x, y: currentSelection.y, selected: currentSelection.selected});  
};

var confirmTurn = function() {
	/*if (startingPhase) {
		socket.emit("new character", {type: pastSelection.tile.type, x: currentSelection.x-50, y: currentSelection.y-50, gameNumber: gameNumber});
	} else {
		
		pastSelection.tile.x = currentSelection.x-50;
		pastSelection.tile.y = currentSelection.y-50;
		
		alert("Move confirmed, waiting for your opponent");
		
	};
	*/
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
	socket.on("updateCharacters", updateCharacters);
	socket.on("update budget", updateBudget);
	socket.on("alert", messageFromServer);
};

function messageFromServer(data) {
	alert(data.fromServer);
};

function updateBudget(data) {
	budget = data.budget;
	startingPhase = data.startingPhase;
};

function setIdentification(data) {
	// The server tells the client its ID
	ownId = data.id;
	gameNumber = data.gameNumber;
	first = data.first;
	
	socket.emit("giveCharacters", {});
};

function updateCharacters(data) {
	// Updates the list of characters
	playCharacters = [];
	for (var i = 0; i < data.length; i++) {
		playCharacters.push(baseCharacters[data[i].type](data[i].x, data[i].y, data[i].id));
		playCharacters[playCharacters.length-1].owner = data[i].owner;	
		playCharacters[playCharacters.length-1].alpha = data[i].alpha;
	};
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
		context.globalAlpha = characters[i].alpha;
		context.drawImage(characters[i].image, characters[i].x, characters[i].y);
	};
};
/* Not used anymore
function drawPastSelection() {
	if (pastSelection.selected) {
		context.lineWidth = 5;
		context.strokeStyle = "#03C817";
		context.strokeRect(pastSelection.x-50, pastSelection.y-50, 100, 100);
	};
};
*/
function drawSelection() {
	if (currentSelection.selected) {
		context.strokeStyle = "#2E9AFE";
		if ((currentSelection.tile.type < 5 && first) || (currentSelection.tile.type > 4 && !first)) {
			context.strokeStyle = "#A31B00";	
		};
				
		context.lineWidth = 5;
		
		context.strokeRect(currentSelection.x-50, currentSelection.y-50, 100, 100);
	};
};
/* Not used anymore to avoid confusion
function drawEnemySelection() {
	if (enemySelection.selected) {
		context.lineWidth = 5;
		context.strokeStyle = "#A31B00";
		context.strokeRect(enemySelection.x-50, enemySelection.y-50, 100, 100);
	};
}
*/
function findTerrains(x,y,distance) {
	var terrainsFound = [];
	for(var i = 0; i < terrains.length; i++) {
		var current = terrains[i];
		if (Math.sqrt(Math.pow(current.x-x,2)+Math.pow(current.y-y,2)) <= distance) {
			terrainsFound.push(terrains[i]);
		};
	};
	return terrainsFound;
};

function drawMoves() {
	var currentTile = currentSelection.tile;
	if (currentTile !== null) {
		if ((currentTile.type > 4 && first) || (currentTile.type < 5 && !first)) {
			var terrainsFound = findTerrains(currentTile.x,currentTile.y,currentTile.speed);
			context.strokeStyle = "#04B404";
			context.lineWidth = 5;
			for (var i = 0; i<terrainsFound.length; i++) {
				var currentTerrain = terrainsFound[i];
				context.strokeRect(currentTerrain.x, currentTerrain.y, 100, 100);
			};
		};
	};
};

function drawAttacks() {
	var currentTile = currentSelection.tile;
	if (currentTile !== null) {
		if ((currentTile.type > 4 && first) || (currentTile.type < 5 && !first)) {
			var terrainsFound = findTerrains(currentTile.x,currentTile.y,currentTile.range);
			context.fillStyle = "#088A85";
			context.globalAlpha = 0.2;
			for (var i = 0; i<terrainsFound.length; i++) {
				var currentTerrain = terrainsFound[i];
				context.fillRect(currentTerrain.x, currentTerrain.y, 100, 100);
			};
		};
	};
	context.globalAlpha = 1.0;
};

function draw() {
	context.clearRect(0, 0, canvas.width, canvas.height);
	context.globalAlpha = 1.0;
	drawGrass();
	drawCharacters(menuCharacters);
	drawCharacters(playCharacters);
	context.globalAlpha = 1.0;
	//drawEnemySelection();
	if (!startingPhase) {
		drawAttacks();
		drawMoves();
	};
	//drawPastSelection();
	drawSelection();
	
	
};

function gameloop() {	
	
	draw();
};


