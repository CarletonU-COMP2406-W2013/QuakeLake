// Character classes

var Character = function(startingX, startingY, id) {
	var x = startingX;
	var y = startingY;
	var id = id;
	var initialhealth = 40;
	var health = 40;
	var damage = 10;
	var cost = 10;
	var speed = 200;
	var range = 150;
	
	var alpha = function() {
		return health/initialhealth;
	}
	
	var isAttacked = function(ouch) {
		health -= ouch;
	};
	
	var attack = function(target) {
		if (distance(target) < range) {
			target.isAttacked(damage);
			return true;	
		} else {
			return false;
		};
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
	
	var setHealth = function(newHealth) {
		health = newHealth;
	};
	
	var getHealth = function() {
		return health;
	};
	
	var distance = function(tile) {
		return Math.sqrt(Math.pow(tile.x()-x,2)+Math.pow(tile.y()-y,2));
	};
	
	var move = function(tile) {
		if (distance(tile) <= speed) {
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
			return attack(tile);
		}
	};
	
	var setSpeed = function(newSpeed) {
		speed = newSpeed;
	};
	
	var getSpeed = function() {
		return speed;
	};
	
	var setCost = function(newCost) {
		cost = newCost;
	};
	
	var getCost = function() {
		return cost;
	};
	
	var setAttack = function(newAttack) {
		attack = newAttack;
	};
	
	var getAttack = function() {
		return attack;
	};
	
	var setRange = function(newRange) {
		range = newRange;
	};
	
	var getRange = function() {
		return range;
	};
	
	var setDamage = function(newDamage) {
		damage = newDamage;
	};
	
	var getDamage = function() {
		return damage;
	};	
	
	return {
		x: getX,
		y: getY,
		setX: setX,
		setY: setY,
		health: getHealth,
		id: id,
		cost: getCost,
		setCost: setCost,
		attack: getAttack,
		setAttack: setAttack,
		isAttacked: isAttacked,
		setHealth: setHealth,
		action: action,
		getSpeed: getSpeed,
		setSpeed: setSpeed,
		alpha: alpha,
		range: getRange,
		setRange: setRange,
		distance: distance,
		damage: getDamage,
		setDamage: setDamage
		
	};
}; 
var Archer = function(startingX, startingY, id) {
	var self = Character(startingX, startingY, id);
	self.type = 5;
	self.setRange(450);
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
	self.heal = 5;
	
	self.setAttack(function(target) {
		if (target.type > 4) {
			target.setHealth(target.health()+self.heal);
			return true;
		} else {
			if (self.distance(target) < self.range()) {
				target.isAttacked(self.damage());
				return true;	
			} else {
				return false;
			};
		};
	});
	
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
