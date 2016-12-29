var v; // all vehicles
var t; // all targets
var count = 20;

function setup() {
    createCanvas(600,600)
    v = []; // initialise empty vehicles array
    t = []; // initialise empty targets array
    for( var i=0; i<count; i++ ) {

        // add new Vehicle to the end of the vehicles array
        v.push( 
            new Vehicle( 
                floor(random(width)),floor(random(height)), 
                color( floor(random(255)),floor(random(255)),floor(random(255)) ) 
            ) 
        );

        // add new target to the end of the targets array
        t.push( newTarget() );
    }

}

function draw(){
    background(200);
    var newR = floor(map(dist(mouseX,mouseY, pmouseX,pmouseY),0,200,6,60))
    

    for( var i=0; i<count; i++ ) {

        // check if current vehicle at array index i has hit its target.
        if(v[i].position.x < t[i].x +2 && v[i].position.x> t[i].x-2 && v[i].position.y<t[i].y+2 && v[i].position.y> t[i].y-2){
            // create new target for vehicle at index i
            t[i] = newTarget();
        }

        // draw target for vehicle at index i
        /*push();
        fill(v[i].color);
        stroke(0);
        strokeWeight(0);
        ellipse(t[i].x,t[i].y, 20,20);
        pop();*/

        // update and draw the vehicle at index i
        v[i].seek(t[i]);
        v[i].update();
        v[i].draw();
        v[i].r = newR
    }
}

function newTarget(){
    // create new random target
    return new createVector(floor(random(width)),floor(random(height)));
}


/* Vehicle class */
var Vehicle = function(x,y,color){
    // 'this' in this case referst to the Vehicle class itself. 
    // It means all those variable are instance vars of the 
    // Vehicle class. Every vehicle has its own set of those
    // variables.
    this.color = color;
    this.acceleration = new p5.Vector(0,0)
    this.velocity = new p5.Vector(0,-1)
    this.position = new p5.Vector(x,y)
    this.r=3
    this.maxspeed = 2
    this.maxforce = 0.5
}

Vehicle.prototype.update=function(){
    this.velocity.add(this.acceleration)
    this.velocity.limit(this.maxspeed)
    this.position.add(this.velocity)
    this.acceleration.mult(0)
}

Vehicle.prototype.applyForce=function(force) {
    this.acceleration.add(force);
}

Vehicle.prototype.seek=function(target){
    var desired = p5.Vector.sub(target,this.position)
  
    desired.setMag(this.maxspeed);
  
    var steer = p5.Vector.sub(desired,this.velocity)
    steer.limit(this.maxforce);
  
    this.applyForce(steer)
}

Vehicle.prototype.draw=function(){
    push()
    fill(this.color)
    stroke(0)
    strokeWeight(0)
    translate(this.position.x,this.position.y)
  
    rotate( this.velocity.heading() + Math.PI*0.5);
    
    ellipse(0, -this.r*2, 20,20)
    ellipse(-this.r*2, this.r*2, 20,20)
    ellipse(this.r*2, this.r*2, 20,20)
    
    pop()
}

/* end of Vehicle class */






