var Points = {
	ASTEROIDS:[
		[0,-2,-2,-1,-2,1,-1,2,2,2,3,0,0,-2],
		[0,-2,-2,-1,-2,0,-1,2,1,1,2,1,3,0,2,-2,0,-2],
		[-1,-2,-1,-1,-2,0,-2,1,0,1,0,2,2,3,3,1,2,-1,-1,-2],
		[-1,-3,-2,-1,-1,1,-1,2,0,3,2,2,3,0,1,-2,-1,-3],
		[0,-2,-2,-2,-3,0,-2,1,-2,3,1,2,2,0,1,-2,0,-2]
	],
	SHIP:[6,0,-3,3,-2,0,-3,-3,6,0],
	FLAMES:[-2,0,-3,1,-6,0,-3,-1,-2,0],
	LIFE:[-4,1,-2,4,0,6,2,4,4,1,5,-2,4,-4,2,-5,0,-4,-2,-5,-4,-4,-5,-2,-4,1]
}

var diffCurve = [5,9,14]

var asteroidSize = 8;


var expl = [];
expl.push(new Audio('expl1.wav'));
expl.push(new Audio('expl2.wav'));
expl.push(new Audio('expl3.wav'));

var GameState = State.extend({
	spawnAsteroid(size,m_x,m_y){
			var n = Math.round(Math.random()*(Points.ASTEROIDS.length -1));
			var astr = new Asteroid(Points.ASTEROIDS[n],size,m_x,m_y);
			astr.maxX = this.canvasWidth;
			astr.maxY = this.canvasHeight;			
			this.asteroids.push(astr);
	},
	init: function(game){
		this._super(game);

		this.gameOver = false;
		this.canvasWidth = game.canvas.ctx.width;
		this.canvasHeight = game.canvas.ctx.height;

		this.ship = new Ship(Points.SHIP,Points.FLAMES,2,0,0);
		this.ship.rotate(-Math.PI/2);
		this.ship.maxX = this.canvasWidth;
		this.ship.maxY = this.canvasHeight;

		this.score = 0;
		this.level = 0;
		this.lives = 3;
		this.lifepolygon = new Polygon(Points.SHIP);
		this.lifepolygon.scale(1);
		this.lifepolygon.rotate(-Math.PI/2);

		this.generateLvl();
	},
	generateLvl:function(){
		if(this.level < diffCurve.length){
			var num = diffCurve[this.level];
		}else{
			var num = this.level+9;
		}

		this.ship.x = this.canvasWidth/2;
		this.ship.y = this.canvasHeight/2;

		this.bullets = [];
		this.asteroids = [];
		for(var i=0;i<num;++i){
			var x;
			var y;
			var repeat = true;			

			while(repeat){
				x = 0;
				y = 0;
				if(Math.random() > 0.5){
					x = Math.random()*this.canvasWidth;
					if(Math.random() > 0.5){
						y = Math.random()*100-200;
					}else{
						y = Math.random()*100-200+this.canvasHeight;
					}
				}else{
					y = Math.random()*this.canvasHeight;
					if(Math.random() > 0.5){
						x = Math.random()*100-200;
					}else{
						x = Math.random()*100-200+this.canvasWidth;
					}
				}
				for(var i=0,len = this.asteroids.length;i<len;++i){
					var ast = this.asteroids[i];
					var xxx=x-ast.x;
					var yyy=y-ast.y;
					var ddd=asteroidSize*5;
					var dd2 = ddd*ddd;
					if(  xxx*xxx + yyy*yyy < dd2){
						break;
					}
				}
				repeat = false;
			}

			this.spawnAsteroid(asteroidSize,x,y);
		}
	},
	handleInputs:function(input){
		if(!this.ship.visible && !this.gameOver){
			if(input.isPressed("fire")){
				this.ship.visible = true;
			}
			return;
		}
		if(input.isDown("right")){
			this.ship.rotate(0.06);
		}
		if(input.isDown("left")){
			this.ship.rotate(-0.06);
		}
		if(input.isDown("up")){
			this.ship.addVel();
		}
		if(input.isPressed("fire")){
			if(this.gameOver){
				this.gameOver = false;
				this.lives = 3;
				this.level = 0;
				this.score = 0;
					
				this.ship = new Ship(Points.SHIP,Points.FLAMES,2,0,0);
				this.ship.rotate(-Math.PI/2);
				this.ship.maxX = this.canvasWidth;
				this.ship.maxY = this.canvasHeight;

				this.asteroids = [];
				this.bullets = [];


				this.generateLvl();

			}else{
				this.bullets.push(this.ship.shoot());
			}
		}
	},
	update:function(){
		for(var i=0, len = this.asteroids.length;i<len;++i){
			var a = this.asteroids[i];
			a.update();

			for(var ii=0, len3=this.asteroids.length;ii<len3;++ii){
				
				if (i == ii){
					continue;
				}

				var b = this.asteroids[ii];

				if(a.wasHit && b.wasHit){
					continue;
				}


				var tmp_x = (a.x - b.x);
				var tmp_y = (a.y - b.y);
				var tmp_dis = 2.5*a.size+2.5*b.size;

				if( tmp_x*tmp_x + tmp_y*tmp_y < tmp_dis*tmp_dis){

					a.wasHit = true;
					b.wasHit = true;
					var const1 =  2*b.size/(a.size+b.size)*((a.vel.x-b.vel.x)*(a.x-b.x)+(a.vel.y-b.vel.y)*(a.y-b.y));
					
					var tmp_a = (a.x-b.x);
					var tmp_b = (a.y-b.y);
					
					const1/=tmp_a*tmp_a+tmp_b*tmp_b;
					
					a.vel.x = a.vel.x-const1*(a.x-b.x);
					a.vel.y = a.vel.y-const1*(a.y-b.y);
				
					var const2 =  2*a.size/(a.size+b.size)*((b.vel.x-a.vel.x)*(b.x-a.x)+(b.vel.y-a.vel.y)*(b.y-a.y));
										
					var tmp_a = (a.x-b.x);
					var tmp_b = (a.y-b.y);
					
					const2/=tmp_b*tmp_b+tmp_a*tmp_a;
					
					b.vel.x = b.vel.x-const1*(b.x-a.x);
					b.vel.y = b.vel.y-const1*(b.y-a.y);
				}
			}

			if(this.ship.collide(a)){
				expl[Math.round(Math.random(expl.length))].play();
				this.ship.x = this.canvasWidth/2;
				this.ship.y = this.canvasHeight/2;
				this.ship.vel = {
					x:0,
					y:0
				}
				if(--this.lives <= 0){
					this.gameOver = true;
				}
				this.ship.rotate(-this.ship.angle-Math.PI/2);
				this.ship.visible = false;
			}

			//bullet collisions
			for(var  j=0,len2=this.bullets.length;j<len2;++j){
				var b = this.bullets[j];
				if(a.hasPoint(b.x,b.y)){
					this.bullets.splice(j,1);
					--j;
					--len2;

					if(a.size > asteroidSize/4){
						this.asteroids[i].playSound();
						this.spawnAsteroid(a.size/2,a.x,a.y);
						this.spawnAsteroid(a.size/2,a.x,a.y);
						this.score += 1;
						len+=2;
						var ast_a = this.asteroids[len-1];
						var ast_b = this.asteroids[len-2];
						ast_a.vel.x = a.vel.x;
						ast_a.vel.y = a.vel.y*(-1);
						ast_b.vel.x = -ast_a.vel.x;
						ast_b.vel.y = -ast_a.vel.y;
						do{
							var xx = ast_a.x - ast_b.x;
							var yy = ast_a.y - ast_b.y;
							var dd = ast_a.size+ast_b.size;
							var xx2 = xx*xx;
							var yy2 = yy*yy;
							var dd2 = dd*dd;
							ast_a.x += ast_a.vel.x;
							ast_a.y += ast_a.vel.y;
							ast_b.x += ast_b.vel.x;
							ast_b.y += ast_b.vel.y;
						}while(xx2 + yy2 < dd2);
					}
					this.asteroids.splice(i,1);
					--i;
					--len;
				}
			}
		}
		for(var i=0,len = this.bullets.length;i<len;++i){
			var b = this.bullets[i];
			b.update();

			if(b.shallRemove){
				this.bullets.splice(i,1);
				--len;
				--i;
			}
		}
		this.ship.update();

		if(this.asteroids.length == 0){
			this.level += 1;
			this.generateLvl();
		}
	},

	render:function(ctx){

		ctx.clearAll();

		if(this.gameOver){
		  ctx.font         = (17.5+2.5*this.ship.size)+'px myfont';
		  ctx.fillStyle    = '#ffffff';
		  ctx.textBaseline = 'middle';
			ctx.textAlign="center"; 
		  ctx.fillText  ('GAME OVER', this.canvasWidth/2, this.canvasHeight/2-100);
		  ctx.fillText  ('SCORE: '+this.score, this.canvasWidth/2, this.canvasHeight/2);
		  ctx.fillText  ('FIRE TO START', this.canvasWidth/2, this.canvasHeight/2+100);
		}else{

		  ctx.font         = (17.5+2.5*this.ship.size)+'px myfont';
		  ctx.fillStyle    = '#ffffff';
		  ctx.textBaseline = 'middle';
			ctx.textAlign="center"; 
		  ctx.fillText  (''+this.score, this.canvasWidth/2, 50);

			for(var i=0;i<this.lives;++i){
			  ctx.fillStyle    = '#aaaaaa';
				ctx.drawPolygon(this.lifepolygon,40+15*i,50);
			}

			for(var i=0, len = this.asteroids.length;i<len;++i){
				this.asteroids[i].draw(ctx);
			}
			this.ship.draw(ctx);
			for(var i=0,len = this.bullets.length;i<len;++i){
				this.bullets[i].draw(ctx);
			}
			if(!this.ship.visible){
			  ctx.font         = (17.5+2.5*this.ship.size)+'px myfont';
			  ctx.fillStyle    = '#ffffff';
			  ctx.textBaseline = 'middle';
				ctx.textAlign="center"; 
			  ctx.fillText  ('FIRE TO RESTART', this.canvasWidth/2, this.canvasHeight-50);
			}
		}

	}

});