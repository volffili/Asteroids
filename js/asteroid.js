var Asteroid = Polygon.extend({

	maxX:null,
	maxY:null,

	init:function(p,s,x,y){
		this._super(p);

		this.expl = [];
		this.expl.push(new Audio('expl1.wav'));
		this.expl.push(new Audio('expl2.wav'));
		this.expl.push(new Audio('expl3.wav'));

		this.wasHit = false;
		this.wasHitTimer = 0;
		this.size = s;
		this.x = x;
		this.y = y;
		this.loopFrame = 32;
		
		this.scale(s);

		this.rotAngle = 0.01*(1-Math.random()*2)

		var r = 2*Math.PI*Math.random();
		var v = Math.random()+1;

		this.vel={
			x: v*Math.cos(r),
			y: v*Math.sin(r)
		}
	},
	playSound:function(){
		this.expl[Math.round(Math.random(this.expl.length))].play();
	},
	hasPoint:function(x,y){
		return this._super(this.x,this.y,x,y);
	}
	,
	update: function(){

		if(this.wasHit){
			++this.wasHitTimer;
			if(this.wasHitTimer > 3){
				this.wasHitTimer = 0;
				this.wasHit = false;
			}
		}

		this.x += this.vel.x;
		this.y += this.vel.y;

		if(this.x > this.maxX+this.loopFrame){
			this.x -= this.maxX+this.loopFrame*2;
		}else if( this.x < -this.loopFrame){
			this.x += this.maxX+this.loopFrame*2;
		}

		if(this.y > this.maxY+this.loopFrame){
			this.y -= this.maxY+this.loopFrame*2;
		}else if( this.y < -this.loopFrame){
			this.y += this.maxY+this.loopFrame*2;
		}

		this.rotate(this.rotAngle);
	},

	draw:function(ctx){
		/*ctx.beginPath();
		ctx.arc(this.x,this.y,2.5*this.size,0,2*Math.PI);
		ctx.stroke();*/

		ctx.fillStyle = "#663300";
		ctx.drawPolygon(this,this.x,this.y);
	}

});