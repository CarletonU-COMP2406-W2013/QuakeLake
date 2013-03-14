// Character classes

var Character = function(startingX, startingY) {
	var x = startingX;
	var y = startingY;
	var health = 40;
	var image = new Image();
	
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
		cost: 10,
		image: image,
		attack: attack,
		setHealth: setHealth,
		isSelected: isSelected
	};
}; 
var Archer = function(startingX, startingY) {
	var self = Character(startingX, startingY);
	self.image.src = "/graphics/archer.png";
	self.name = Archer;
	return self;	
};

var Blue = function(startingX, startingY) {
	var self = Character(startingX, startingY);
	self.image.src = "/graphics/blue.png";
	self.name = Blue;
	return self;	
};
var Cube = function(startingX, startingY) {
	var self = Character(startingX, startingY);
	self.image.src = "/graphics/cube.png";
	self.name = Cube;
	return self;	
};
var Flying = function(startingX, startingY) {
	var self = Character(startingX, startingY);
	self.image.src = "/graphics/flying.png";
	self.name = Flying;
	return self;	
};
var Goblin = function(startingX, startingY) {
	var self = Character(startingX, startingY);
	self.image.src = "/graphics/goblin.png";
	self.name = Goblin;
	return self;	
};
var Healer = function(startingX, startingY) {
	var self = Character(startingX, startingY);
	self.image.src = "/graphics/healer.png";
	self.name = Healer;
	return self;	
};
var Heavy = function(startingX, startingY) {
	var self = Character(startingX, startingY);
	self.image.src = "/graphics/heavy.png";
	self.name = Heavy;
	return self;	
};
var Mage = function(startingX, startingY) {
	var self = Character(startingX, startingY);
	self.image.src = "/graphics/mage.png";
	self.name = Mage;
	return self;	
};
var Warrior = function(startingX, startingY) {
	var self = Character(startingX, startingY);
	self.image.src = "/graphics/warrior.png";
	self.name = Warrior;
	return self;	
};