var Ship = Polygon.extend({

	maxX:null,
	maxY:null,

	init:function(p,pf,s,x,y){
		this._super(p);

		this.flames = new Polygon(pf);
		this.flames.scale(s);

		this.x = x;
		this.y = y;
		this.loopFrame = 32;
		
		this.visible = true;

		this.enlarge = 0;
		this.scale(s);
		this.size = s;
		this.angle = 0;


		this.vel={
			x: 0,
			y: 0
		}
	},
	addVel:function(){
		if(this.vel.x*this.vel.x + this.vel.y*this.vel.y < 20*20){
			this.vel.x += 0.05*Math.cos(this.angle);
			this.vel.y += 0.05*Math.sin(this.angle);
		}
		this.drawFlames = true;
	},

	rotate:function(theta){
		this._super(theta);
		this.flames.rotate(theta);
		this.angle += theta;

	},

	collide:function(astr){
		if(!this.visible){
			return false;
		}
		for(var i=0,len=this.points.length-2; i<len; i+=2){
			var x = this.points[i] + this.x;
			var y = this.points[i+1] + this.y;

			if(astr.hasPoint(x,y)){
				return true;
			}
		}
		return false;
	},

	shoot:function(){
		var b = new Bullet(this.points[0]+this.x,this.points[1]+this.y,this.angle);
		b.maxX = this.maxX;
		b.maxY = this.maxY;
		return b;
	},

	update: function(){
		this.x += this.vel.x;
		this.y += this.vel.y;

		this.vel.x *= 0.99;
		this.vel.y *= 0.99;

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

	},

	draw:function(ctx){
		if(!this.visible){
			this.enlarge += 0.1;
			var mult = 1+(Math.sin(this.enlarge))/100;
			this.size *= mult;
			this.scale(mult);
			ctx.fillStyle="#ffffff";
			ctx.drawPolygon(this,this.x,this.y);
			return;
		}
		if(this.size != 2){
			this.enlarge = 0;
			this.scale(1/(this.size));
			this.size = 2;
			this.scale(2);
		}
		
		ctx.fillStyle="#33ccff";
		ctx.drawPolygon(this,this.x,this.y);
		if(this.drawFlames){
			ctx.fillStyle="#ff9933";
			ctx.drawPolygon(this.flames,this.x,this.y);
			this.drawFlames = false;
		}
	}

});