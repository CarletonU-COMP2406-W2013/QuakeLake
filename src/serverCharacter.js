// Character classes

var Character = function(startingX, startingY, id) {
	var x = startingX;
	var y = startingY;
	var id = id;
	var health = 40;
	var damage = 10;
	var cost = 10;
	var speed = 200;
	
	var isAttacked = function(ouch) {
		health -= ouch;
	};
	
	var attack = function(target) {
		target.isAttacked(damage);
	};
	
	var setHealth = function(newHealth) {
		health = newHealth;
	};
	
	var isSelected = function() {
	};
	
	var getX = function() {
		return x;
	};
	
	var getY = function() {
		return y;
	};
	
	var setX = function(newX) {
		x = newX;
	};
	
	var setY = function(newY) {
		y = newY;
	};
	
	var getHealth = function() {
		return health;
	};
	
	var move = function(tile) {
		if (Math.sqrt(Math.pow(tile.x()-x,2)+Math.pow(tile.y()-y,2)) <= speed) {
			x = tile.x();
			y = tile.y();
			return true;
		} else {
			return false;
		};
	};
	
	var action = function(tile) {
		if (tile.type === 9) {
			return move(tile);
		} else {
			return false;
		}
	};
	
	var setSpeed = function(newSpeed) {
		speed = newSpeed;
	};
	
	var getSpeed = function() {
		return speed;
	};
	
	return {
		x: getX,
		y: getY,
		setX: setX,
		setY: setY,
		health: getHealth,
		id: id,
		cost: cost,
		attack: attack,
		isAttacked: isAttacked,
		setHealth: setHealth,
		isSelected: isSelected,
		action: action,
		getSpeed: getSpeed,
		setSpeed: setSpeed
	};
}; 
var Archer = function(startingX, startingY, id) {
	var self = Character(startingX, startingY, id);
	self.type = 5;
	return self;	
};

var Blue = function(startingX, startingY, id) {
	var self = Character(startingX, startingY, id);
	self.type = 0;
	return self;	
};
var Cube = function(startingX, startingY, id) {
	var self = Character(startingX, startingY, id);
	self.type = 1;
	return self;	
};
var Flying = function(startingX, startingY, id) {
	var self = Character(startingX, startingY, id);
	self.type = 2;
	return self;	
};
var Goblin = function(startingX, startingY, id) {
	var self = Character(startingX, startingY, id);
	self.type = 3;
	self.setSpeed(300);
	return self;	
};
var Healer = function(startingX, startingY, id) {
	var self = Character(startingX, startingY, id);
	self.type = 6;
	return self;	
};
var Heavy = function(startingX, startingY, id) {
	var self = Character(startingX, startingY, id);
	self.type = 4;
	return self;	
};
var Mage = function(startingX, startingY, id) {
	var self = Character(startingX, startingY, id);
	self.type = 7;
	return self;	
};
var Warrior = function(startingX, startingY, id) {
	var self = Character(startingX, startingY, id);
	self.type = 8;
	return self;	
};

exports.baseCharacters = [Blue, Cube, Flying, Goblin, Heavy, Archer, Healer, Mage, Warrior];
