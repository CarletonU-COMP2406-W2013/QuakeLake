// Character classes

var Archer = function(startingX, startingY) {
	
	var x = startingX;
	var y = startingY;
	var health = 40;
	var image = new Image();
	image.src = "/graphics/archer.png";	

	var getPosition = function() {
		return [x,y];	
	};

	var setPosition = function(move) {
	};

	var attack = function(target) {
	};

	var setHealth = function(damage) {
	};
	
	return {
		getPosition: getPosition,
		setPosition: setPosition,
		attack: attack,
		setHealth: setHealth,
		image: image;
	};
};

var Goblin = function(startingX, startingY) {
	
	var x = startingX;
	var y = startingY;
	var health = 10;
	var image = new Image();
	image.src = "/graphics/goblin.png";	

	var getPosition = function() {
		return [x,y];	
	};

	var setPosition = function(move) {
	};

	var attack = function(target) {
	};

	var setHealth = function(damage) {
	};
	
	return {
		getPosition: getPosition,
		setPosition: setPosition,
		attack: attack,
		setHealth: setHealth,
		image: image
	};
};
