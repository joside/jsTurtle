var Vector = function(x, y){
    this.x = x;
    this.y = y;
};
Vector.prototype = {
    size: function(){
        return Math.sqrt(this.x * this.x, this.y * this.y);
    },
    plus: function(v){
        return new Vector(this.x + v.x, this.y + v.y);
    },
    minus: function(v){
        return new Vector(this.x - v.x, this.y - v.y);
    },
    mod: function(v){
        var newV = new Vector(this.x % v.x, this.y % v.y);
        if (newV.x < 0) 
            newV.x += v.x;
        if (newV.y < 0) 
            newV.y += v.y;
        return newV;
    },
    multiply: function(k){
        return new Vector(k * this.x, k * this.y);
    },
    rotate: function(angle){
        return this.multiply(Math.cos(angle)).plus(this.perp().multiply(Math.sin(angle)));
    },
    perp: function(){
        return new Vector(-this.y, this.x);
    },
    translate: function(amt){
        return new Vector(this.x + amt, this.y + amt);
    },
    toString: function(){
        return "(" + this.x + "," + this.y + ")";
    },
    equals: function(o){
        if (o == null) 
            return false;
        return (Math.abs(this.x - o.x) < 0.000001) && (Math.abs(this.y - o.y) < 0.000001);
    }
};

var State = function(v, penUp){
    this.setPositionVector(new Vector(v.x, v.y));
    this.setHeadingVector(90);
    this.penUp = !!penUp;
}
State.prototype = function(){
    var v, h;
    
    function deg2rad(deg){
        return deg * 2 * Math.PI / 360;
    }
    
    function rad2deg(rad){
        return rad * 360 / (2 * Math.PI);
    }
    
    function setHeading(degree){
        var rad = deg2rad(degree);
        if (h) {
            h = h.rotate(deg2rad(degree));
        }
        else {
            h = new Vector(Math.cos(rad), Math.sin(rad))
        }
    }
    
    function setPosition(vec){
        v = vec;
    }
    
    function getPosition(){
        return v;
    }
    
    function getHeading(){
        return h;
    }
    
    return {
        setHeadingVector: setHeading,
        setPositionVector: setPosition,
        getHeadingVector: getHeading,
        getPositionVector: getPosition
    }
}();

var Turtle = function(ctx){
    this.ctx = ctx;
    this.dimension = new Vector(ctx.canvas.width, ctx.canvas.height);
    this.ctx.fillStyle = "rgb(255,255,255)";
    this.ctx.fillRect(0, 0, this.dimension.x, this.dimension.y);
    this.ctx.strokeStyle = "rgb(0,0,0)";
    this.ctx.lineWidth = 1;
    this.ctx.translate(this.dimension.x / 2, this.dimension.y / 2)
    this.ctx.scale(1.0, -1.0);
    this.state = new State(new Vector(0, 0), true);
}
Turtle.prototype = (function(){

    function forward(distance){
        var pos = this.state.getPositionVector(), head = this.state.getHeadingVector();
        
        this.state.setPositionVector(pos.plus(head.multiply(distance)));
        
        this.ctx.beginPath();
        
        var current = this.state.getPositionVector();
        if (this.state.penUp) {
            this.ctx.moveTo(current.x, current.y);
        }
        else {
            this.ctx.moveTo(pos.x, pos.y);
            this.ctx.lineTo(current.x, current.y);
        }
        this.ctx.stroke();
        this.state.setPositionVector(current);
        return this;
    }
    
    function leftTurn(degree){
        this.state.setHeadingVector(degree);
        return this;
    }
    
    function rightTurn(degree){
        this.state.setHeadingVector(-degree);
        return this;
    }
    
    function penUp(){
        this.state.penUp = true;
        return this;
    }
    
    function penDown(){
        this.state.penUp = false;
        return this;
    }
    
    return {
        fd: forward,
        lt: leftTurn,
        rt: rightTurn,
        pu: penUp,
        pd: penDown
    };
})();
