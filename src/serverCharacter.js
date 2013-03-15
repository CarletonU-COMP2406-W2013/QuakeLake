// Character classes

var Character = function(startingX, startingY, id) {
	var x = startingX;
	var y = startingY;
	var id = id;
	var health = 40;
	
	var attack = function(target) {
	};
	
	var setHealth = function(newHealth) {
		health = newHealth;
	};
	
	var isSelected = function() {
	};
	
	return {
		x: x,
		y: y,
		health: health,
		id: id,
		cost: 10,
		attack: attack,
		setHealth: setHealth,
		isSelected: isSelected
	};
}; 
var Archer = function(startingX, startingY, id) {
	var self = Character(startingX, startingY, id);
	self.type = 0;
	return self;	
};

var Blue = function(startingX, startingY, id) {
	var self = Character(startingX, startingY, id);
	self.type = 1;
	return self;	
};
var Cube = function(startingX, startingY, id) {
	var self = Character(startingX, startingY, id);
	self.type = 2;
	return self;	
};
var Flying = function(startingX, startingY, id) {
	var self = Character(startingX, startingY, id);
	self.type = 3;
	return self;	
};
var Goblin = function(startingX, startingY, id) {
	var self = Character(startingX, startingY, id);
	self.type = 4;
	return self;	
};
var Healer = function(startingX, startingY, id) {
	var self = Character(startingX, startingY, id);
	self.type = 5;
	return self;	
};
var Heavy = function(startingX, startingY, id) {
	var self = Character(startingX, startingY, id);
	self.type = 6;
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
