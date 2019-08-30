class Vector {
	constructor(x = 0, y = 0, z = 0) {
		this.X = x;
		this.Y = y;
		this.Z = z;
	}

	add(p) {
		return new Vector(this.X + p.X, this.Y + p.Y, this.Z + p.Z);
	}
	sub(p) {
		return new Vector(this.X - p.X, this.Y - p.Y, this.Z - p.Z);
	}
	mult(p) {
		return new Vector(this.X * p.X, this.Y * p.Y, this.Z * p.Z);
	}
	div(p) {
		return new Vector(this.X / p.X, this.Y / p.Y, this.Z / p.Z);
	}
	abs() {
		return new Vector(Math.abs(this.X), Math.abs(this.Y), Math.abs(this.Z));
	}
	clone() {
		return new Vector(this.X, this.Y, this.Z);
	}
	length() {
		return Math.sqrt(this.X * this.X + this.Y * this.Y + this.Z * this.Z);
	}
	toString(decimalPoint = 2) {
		return '{' + this.X.toFixed(decimalPoint) + ' ' + this.Y.toFixed(decimalPoint) + ' ' + this.Z.toFixed(decimalPoint) + '}';
	}
}

function map(x, in_min, in_max, out_min, out_max) {
	return ((x - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
}
function constrain(x, low, high) {
	if (x < low) return low;
	if (x > high) return high;
	return x;
}

let vStartPos = new Vector(0, 60, 1000);
let vEndPos = new Vector(1, -50, 205);
let vCurrentPos = vStartPos.clone();
let vLastPos = vCurrentPos.clone();

const accel = 0.15;
const maxVel = 10;
const interval = 10;

let initialDistance = vEndPos.sub(vStartPos).length();
let currentVel = 0;
let distanceMoved = 0;

let stage = 'ACC';
console.clear();
console.log('Init distance: ', initialDistance.toFixed(4));

let timer = setInterval(function() {
	let distanceToStop = (currentVel * currentVel) / (2 * accel);
	let distanceToMove = initialDistance - distanceMoved;

	if (distanceToStop >= distanceToMove) {
		// decel
		stage = 'DEC';
		currentVel -= accel;
	} else if (currentVel < maxVel) {
		// accel
		if (stage != 'DEC') {
			stage = 'ACC';
			currentVel += accel;
		}
	} else {
		// move at maxspeed
		stage = 'MAX';
		currentVel = maxVel;
	}
	currentVel = constrain(currentVel, 0, maxVel);

	if (distanceMoved + currentVel <= initialDistance) distanceMoved += currentVel;
	else distanceMoved = initialDistance;

	let percentMoved = distanceMoved / initialDistance;
	percentMoved = constrain(percentMoved, 0, 100);
	vCurrentPos = vStartPos.add(vEndPos.sub(vStartPos).mult(new Vector(percentMoved, percentMoved, percentMoved)));

	if (0)
		console.log(
			'stage:',
			stage,
			'toMove:',
			distanceToMove.toFixed(3),
			'moved:',
			distanceMoved.toFixed(3),
			'toStop:',
			distanceToStop.toFixed(4),
			'vel:',
			currentVel.toFixed(4)
		);
	if (0) console.log(distanceMoved.toFixed(4));
	if (1)
		console.log(
			'stage:',
			stage,
			'toMove:',
			vEndPos.sub(vCurrentPos).toString(3),
			'moved:',
			vCurrentPos.sub(vStartPos).toString(3),
			'vel:',
			vCurrentPos.sub(vLastPos).toString(3),
			vCurrentPos
				.sub(vLastPos)
				.length()
				.toFixed(4)
		);

	vLastPos = vCurrentPos.clone();

	if (vEndPos.sub(vCurrentPos).length() <= 0.01 || distanceToMove <= 0.01)
		clearInterval(timer);
}, interval);