
window.requestAnimFrame = ( function() {
	return window.requestAnimationFrame ||
				window.webkitRequestAnimationFrame ||
				window.mozRequestAnimationFrame ||
				function( callback ) {
					window.setTimeout( callback, 1000 / 60 );
				};
})();


var canvas = document.getElementById( 'canvas' ),
		ctx = canvas.getContext( '2d' ),

		cw = window.innerWidth,
		ch = window.innerHeight,
	
		starbursts = [],

		stars = [],

		hue = 120,

		limiterTotal = 10,
		limiterTick = 0,

		timerTotal = 50,
		timerTick = 0,
		mousedown = false,

		mx,
		my;
		

canvas.width = cw;
canvas.height = ch;

function random( min, max ) {
	return Math.random() * ( max - min ) + min;
}

/*function calculateDistance( p1x, p1y, p2x, p2y ) {
	var xDistance = p1x - p2x,
			yDistance = p1y - p2y;
	return Math.sqrt( Math.pow( xDistance, 2 ) + Math.pow( yDistance, 2 ) );
}*/


function Starburst( sx, sy, tx, ty ) {

	this.x = sx;
	this.y = sy;
	this.sx = sx;
	this.sy = sy;
	this.tx = tx;
	this.ty = ty;


	this.coordinates = [];
	this.coordinateCount = 3;

	while( this.coordinateCount-- ) {
		this.coordinates.push( [ this.x, this.y ] );
	}
	this.angle = Math.atan2( ty - sy, tx - sx );
	this.speed = .5;
	this.acceleration = .5;
	this.brightness = random( 50, 70 );
	this.targetRadius = 1;
}


Starburst.prototype.update = function( index ) {
	this.coordinates.pop();
	this.coordinates.unshift( [ this.x, this.y ] );
		createStars( this.tx, this.ty );
		starbursts.splice( index, 1 );
		this.x += vx;
		this.y += vy;

}


Starburst.prototype.draw = function() {

}


function Star( x, y, starCount, speedN ,hueP ) {
	this.x = x;
	this.y = y;
	this.coordinates = [];
	this.coordinateCount = 5;
	while( this.coordinateCount-- ) {
		this.coordinates.push( [ this.x, this.y ] );
	}
	this.angle = random( 0, Math.PI * 2 );
    this.speed1 = random( 10, 25 );
    this.speed2 = random( 1, 5 );
	this.speed = starCount / speedN
    this.friction = .99;
	this.gravity =1;
	this.hue = hueP	
	this.brightness = random( 5, 50 );
	this.alpha = 1;
	this.decay = random( 0.01, 0.001 );
}


Star.prototype.update = function( index ) {
	this.coordinates.pop();
	this.coordinates.unshift( [ this.x, this.y ] );
	this.speed *= this.friction;
	this.x += Math.cos( this.angle ) * this.speed;
	this.y += Math.sin( this.angle ) * this.speed + this.gravity;
	this.alpha -= this.decay;
	if( this.alpha <= this.decay ) {
		stars.splice( index, 1 );
	}
}


Star.prototype.draw = function() {
	ctx. beginPath();
	ctx.moveTo( this.coordinates[ this.coordinates.length - 5 ][ 0 ], this.coordinates[ this.coordinates.length - 5 ][ 1 ] );
	ctx.lineTo( this.x, this.y );
	ctx.strokeStyle = 'hsla(' + this.hue + ', 100%, ' + this.brightness + '%, ' + this.alpha + ')';
	ctx.stroke();
}


function createStars( x, y ) {
    var starCount = 100;
    this.speedN = random( 3, 25 );
    	this.hue = random( hue - 120, hue + 120 );
	while( starCount-- ) {
		stars.push( new Star( x, y,starCount,speedN,hue  ) );
	}
}


function burstLoop() {

	requestAnimFrame( burstLoop );
    hue= random(0, 50 );
	ctx.globalCompositeOperation = 'destination-out';
	ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
	ctx.fillRect( 0, 0, cw, ch );
	ctx.globalCompositeOperation = 'lighter';
	
	var i = starbursts.length;
	while( i-- ) {
		starbursts[ i ].draw();
		starbursts[ i ].update( i );
	}
	
	var i = stars.length;
	while( i-- ) {
		stars[ i ].draw();
		stars[ i ].update( i );
	}
	

	if( timerTick >= timerTotal ) {
			starbursts.push( new Starburst( cw / 2, ch, random( 0, cw ), random( 0, ch / 2 ) ) );
			timerTick = 0;
	} else {
		timerTick++;
	}
	


}


window.onload = burstLoop;

