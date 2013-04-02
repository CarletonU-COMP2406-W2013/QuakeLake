var Game = function(gameNumber) {
	var gameNumber = gameNumber;
	var players = [];
	var playCharacters = [[],[]];
	var turn = 0;
	var characterId = 0;
	var initialbudget = 30;
	var budgets = [initialbudget,initialbudget];
	var startingPhase = true;
	var terrains = [];
	var menuCharacters = [];
	
	var terrain = function(x,y) {
		var x = x;
		var y = y;
		var getX = function() {
			return x;
		};
		var getY = function() {
			return y;
		};
		return {
			x: getX,
			y: getY,
			type: 9
		};
	};
	
	for (var i = 0; i < 10; i++) {
		for (var j = 0; j < 7; j++) {
			terrains.push(terrain(i*100, j*100));
		};	
	};
	
	var setMenuCharacters = function(characters) {
		menuCharacters = characters;
	};
	
	var isClicked = function(tile, data, currentPlayer) {
		// Checks if a particular tile is clicked
		if (data.x === tile.x() && data.y === tile.y()) {
			if (currentPlayer === 1) {
				if (tile.type < 5) {
					return {found: true, tile: tile};
				};
			} else if (currentPlayer === 0) {
				if (tile.type > 4) {
					return {found: true, tile: tile};
				};
			} else {
				return {found: true, tile: tile};
			};
		};
		return {found: false, tile: null}
	};
	
	var mouseSelection = function(currentPlayer, data) {
		if (startingPhase) {
			tiles = menuCharacters;
		} else {
			tiles = playCharacters[currentPlayer];
		};
		
		pastTile = null;
		for (var i = 0; i < tiles.length; i++) {
			currentTile = isClicked(tiles[i], {x: data.pastx, y: data.pasty}, currentPlayer)
			if(currentTile.found) {
				pastTile = currentTile.tile;
				break;
			};
		};
		
		tiles = playCharacters[0].concat(playCharacters[1]).concat(terrains);
		
		nextTile = null;
		for (var i = 0; i < tiles.length; i++) {
			currentTile = isClicked(tiles[i], {x: data.x, y: data.y})
			if(currentTile.found) {
				nextTile = currentTile.tile;
				break;
			};
		};

		return {pastTile: pastTile, nextTile: nextTile};
	};

	var updateBudget = function() {
		budgets[turn%2] = initialbudget;
		for(var i = 0; i < playCharacters[turn%2].length; i++){
			budgets[turn%2] -= playCharacters[turn%2][i].cost();
		};
		if (budgets[0]+budgets[1] === 0) {
			for (var i = 0; i < players.length; i++) {
				startingPhase = false;
				players[i].emit("alert", {fromServer: "The choice of characters is complete"});
				players[(turn+1)%2].emit("update budget", {budget: 0, startingPhase: false});
			};
		};
		
		players[turn%2].emit("update budget", {budget: budgets[turn%2], startingPhase: startingPhase});
	};
	
	var advanceGame = function() {
		turn += 1;
	};
	
	var checkBudget = function(cost) {
		if (budgets[turn%2]- cost < 0) {	
			players[turn%2].emit("alert", {fromServer: "This character is too expensive given your remaining budget"});
			return true;
		};
		return false;
	};
	
	var checkTurn = function(currentPlayer) {
		
		if (turn%2 !== currentPlayer) {
			players[currentPlayer].emit("alert", {fromServer: "Wait for your turn"});
			return true;
		};
		return false;
	};
	
	var isStartingPhase = function() {
		return startingPhase;
	};
	
	return {
		gameNumber: gameNumber,
		players: players,
		turn: turn,
		budgets: budgets,
		playCharacters: playCharacters,
		characterId: characterId,
		updateBudget: updateBudget,
		advanceGame: advanceGame,
		checkTurn: checkTurn,
		checkBudget: checkBudget,
		isStartingPhase: isStartingPhase,
	 	terrains: terrains,
	 	mouseSelection: mouseSelection,
	 	setMenuCharacters: setMenuCharacters
	};
};

exports.Game = Game
