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
	var isMonster = false;
	
	var setMonster = function() {
		isMonster = true;
	};
	
	var getMonster = function() {
		return isMonster;
	}
	
	var alpha = function() {
		return health/initialhealth;
	}
	
	var isAttacked = function(ouch) {
		health -= ouch;
	};
	
	var attack = function(target, others) {
		if (distance(target) < range) {
			target.isAttacked(damage);
			// Checks for allies around, which strenghten the attack by 20%
			for (var o = 0; o < others.length; o++) {
				if (others[o].isMonster() === isMonster && others[o].id !== id) {
					target.isAttacked(damage/5);
					break;
				};
			};
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
	
	var action = function(tile, tiles) {
		if (tile.type === 9) {
			return move(tile);
		} else {
			return attack(tile, tiles);
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
		setDamage: setDamage,
		setMonster: setMonster,
		isMonster: getMonster
		
	};
}; 
var Archer = function(startingX, startingY, id) {
	var self = Character(startingX, startingY, id);
	self.type = 5;
	self.setRange(350);
	return self;	
};

var Blue = function(startingX, startingY, id) {
	var self = Character(startingX, startingY, id);
	self.type = 0;
	self.setMonster();
	return self;	
};
var Cube = function(startingX, startingY, id) {
	var self = Character(startingX, startingY, id);
	self.type = 1;
	self.setMonster();
	self.vampirism = 5;
	self.setAttack(function(target) {
		if (self.distance(target) < self.range()) {
			target.isAttacked(self.damage());
			self.setHealth(self.health()+self.vampirism);
			return true;	
		} else {
			return false;
		};
	});
	return self;	
};
var Flying = function(startingX, startingY, id) {
	var self = Character(startingX, startingY, id);
	self.type = 2;
	self.setMonster();
	self.setRange(250);
	self.isAttacked = function(ouch) {
		self.setHealth(self.health()-(ouch*2));
	};
	
	self.setCost(5);
	return self;	
};
var Goblin = function(startingX, startingY, id) {
	var self = Character(startingX, startingY, id);
	self.type = 3;
	self.setMonster();
	self.setSpeed(300);
	self.setCost(5);
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
	self.setMonster();
	self.setCost(15);
	self.setDamage(15);
	self.setAttack(function(target, others) {
		if (self.distance(target) < self.range()) {
			for(var o = 0; o < others.length; o++) {
				if (others[o].type === 4) {
					others[o].isAttacked(10);
				} else {
					others[o].isAttacked(self.damage());
				};
			};
			return true;	
		} else {
			return false;
		};
	});
	return self;	
};
var Mage = function(startingX, startingY, id) {
	var self = Character(startingX, startingY, id);
	self.type = 7;
	self.setDamage(5);
	self.setRange(500);
	self.setSpeed(500);
	return self;	
};
var Warrior = function(startingX, startingY, id) {
	var self = Character(startingX, startingY, id);
	self.type = 8;
	self.setDamage(20);
	return self;	
};

exports.baseCharacters = [Blue, Cube, Flying, Goblin, Heavy, Archer, Healer, Mage, Warrior];
