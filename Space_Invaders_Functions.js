function random(min, max) {
	return Math.floor(Math.random() * (max-min+1)) + min;
}

function Player(x, y, w, h, src) {
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.src = src;

	this.img = new Image();
	this.img.src = src;
}

Player.prototype.draw = function() {
	graphics.drawImage(this.img, this.x, this.y, this.w, this.h);
}

function Alien(x, y, type) {
	this.x = x;
	this.y = y;
	this.w = 30;
	this.h = 25;
	this.type = type;
	this.number = 0;
	this.alive = true;
	this.img = new Image();

	if (type == "crab") {
		this.img.src = "crab1.png";
	} else if (type == "octopus") {
		this.img.src = "octopus1.png"
	} else if (type == "squid") {
		this.img.src = "squid1.png"
	} else if (type == "ufo") {
		this.w = 80;
		this.h = 40;
		this.img.src = "ufo.png";
	}
}

Alien.prototype.draw = function() {
	graphics.drawImage(this.img, this.x, this.y, this.w, this.h);
}

Alien.prototype.update = function() {
	let x = this.img.src;

	if (x != "file:///C:/Users/Mwayi/Desktop/HTML,%20CSS,%20and%20JS%20Programs/Space%20Invaders/ufo.png") {
		this.number++;

		this.img.src = x.substring(0, x.length-5) + (this.number%2+1) + ".png";
	
		this.x += 10*direction;
	} else {
		this.x += 3;

		if (this.x > width) {
			ufo = null;
		}
	}
}

Alien.prototype.constrain = function() {
	return this.x < 0 || this.x+this.w > width;
}

Alien.prototype.moveDown = function() {
	this.y += 25;
}

Alien.prototype.throwBullet = function() {
	alienBullets.push(new Bullet(this.x+this.w/2-2.5, this.y, "alien"));
}

Alien.prototype.hits = function(object) {
	return object != null && this.x+this.w > object.x && this.x < object.x+object.w && this.y+this.h > object.y && this.y < object.y+object.h;
}

function Bullet(x, y, type) {
	this.x = x;
	this.y = y;
	this.w = 5;
	this.h = 15;
	this.type = type;
	this.color = "";

	if (this.type == "player") {
		this.color = "green";
	} else if (this.type == "alien") {
		this.color = "red";
	}
}

Bullet.prototype.draw = function() {
	graphics.fillStyle = this.color;
	graphics.fillRect(this.x, this.y, this.w, this.h);
}

Bullet.prototype.update = function() {
	if (this.type == "player") {
		this.y -= 10;

		if (this.y < -this.h) {
			playerBullet = null;
		}
	} else {
		this.y += 10;

		if (this.y > height) {
			alienBullets.splice(this, 1);
		}
	}
}

Bullet.prototype.hits = function(object) {
	return object != null && this.x+this.w > object.x && this.x < object.x+object.w && this.y+this.h > object.y && this.y < object.y+object.h;
}