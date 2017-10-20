var MenuState = State.extend({
	
	init: function(game){
		this._super(game);
		this.canvasWidth = game.canvas.ctx.width;
		this.canvasHeight = game.canvas.ctx.height;

	},
	handleInputs:function(input){		
		if(input.isPressed("fire")){
			game.nextState = States.GAME;
		}
	},
	update:function(){
	
	},

	render:function(ctx){
		ctx.clearAll();
	  ctx.font         = '20px myfont';
	  ctx.fillStyle    = '#ffffff';
	  ctx.textBaseline = 'middle';
		ctx.textAlign		 = "center"; 
	  ctx.fillText  ('I - ACCELERATE', this.canvasWidth/2, this.canvasHeight/2-100);
	  ctx.fillText  ('J - STEER LEFT', this.canvasWidth/2, this.canvasHeight/2-50);
	  ctx.fillText  ('L - STEER RIGHT', this.canvasWidth/2, this.canvasHeight/2);
	  ctx.fillText  ('D - FIRE', this.canvasWidth/2, this.canvasHeight/2+50);
	  ctx.fillText  ('FIRE TO START', this.canvasWidth/2, this.canvasHeight/2+100);
	}

});