// Characters

var Character = function(startingX, startingY, id) {
	// Base object for all characters
	var x = startingX;
	var y = startingY;
	var id = id;
	var image = new Image();
	var range = 150;
	var speed = 200;
	
	return {
		x: x,
		y: y,
		id: id,
		image: image,
		range: range,
		speed: speed
	};
}; 
var Archer = function(startingX, startingY, id) {
	var self = Character(startingX, startingY, id);
	self.image.src = "/graphics/archer.png";
	self.type = 5;
	self.range = 350;
	return self;	
};

var Blue = function(startingX, startingY, id) {
	var self = Character(startingX, startingY, id);
	self.image.src = "/graphics/blue.png";
	self.type = 0;
	return self;	
};
var Cube = function(startingX, startingY, id) {
	var self = Character(startingX, startingY, id);
	self.image.src = "/graphics/cube.png";
	self.type = 1;
	return self;	
};
var Flying = function(startingX, startingY, id) {
	var self = Character(startingX, startingY, id);
	self.image.src = "/graphics/flying.png";
	self.type = 2;
	self.range = 250;
	return self;	
};
var Goblin = function(startingX, startingY, id) {
	var self = Character(startingX, startingY, id);
	self.image.src = "/graphics/goblin.png";
	self.type = 3;
	self.speed = 300;
	return self;	
};
var Healer = function(startingX, startingY, id) {
	var self = Character(startingX, startingY, id);
	self.image.src = "/graphics/healer.png";
	self.type = 6;
	return self;	
};
var Heavy = function(startingX, startingY, id) {
	var self = Character(startingX, startingY, id);
	self.image.src = "/graphics/heavy.png";
	self.type = 4;
	return self;	
};
var Mage = function(startingX, startingY, id) {
	var self = Character(startingX, startingY, id);
	self.image.src = "/graphics/mage.png";
	self.type = 7;
	self.range = 500;
	self.speed = 500;
	return self;	
};
var Warrior = function(startingX, startingY, id) {
	var self = Character(startingX, startingY, id);
	self.image.src = "/graphics/warrior.png";
	self.type = 8;
	return self;	
};