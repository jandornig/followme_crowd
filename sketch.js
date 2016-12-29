var v; // all vehicles
var t; // all targets
var count = 20;

function setup() {
    createCanvas(600,600)
    frameRate(30)
    
    v = []; // initialise empty vehicles array
    t = []; // initialise empty targets array
    for( var i=0; i<count; i++ ) {

        // add new Vehicle to the end of the vehicles array
        v.push( 
            new Vehicle( 
                floor(random(width)),floor(random(height)), 
                color( floor(random(255))+50,floor(random(255)) ) 
            ) 
        );

        // add new target to the end of the targets array
        t.push( newTarget() );
    }

}

function draw(){
    
    var alertness = map(dist(mouseX,mouseY, pmouseX,pmouseY),0,200,0,100)
    background(50+alertness*2);
    
    disturber(alertness)
  

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

        // alter general alertness by distance of mouse to vehicle

        var factor = 1-(dist( v[i].position.x, v[i].position.y, mouseX, mouseY )/200);

        if( factor < 0 ) factor = 0;
        if( factor > 1 ) factor = 1;

        var vAlertness = alertness * factor;

        v[i].seek(t[i]);
        v[i].update();
        v[i].draw();
        v[i].addAlertness( vAlertness );
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
    this.alertness = 0;
    this.color = color;
    this.acceleration = new p5.Vector(0,0)
    this.velocity = new p5.Vector(0,-1)
    this.position = new p5.Vector(x,y)
    this.r=5
    this.maxspeed = 0.8
    this.maxforce = 0.2
    this.maxAlertness = 60;
  }

Vehicle.prototype.update=function(){
    this.velocity.add(this.acceleration)
    this.velocity.limit(this.maxspeed)
    this.position.add(this.velocity)
    this.acceleration.mult(0)

    // decrease allertness. 
    // if you multiply by percentage you will not have to check if its negative
    this.alertness -= this.alertness*0.05;

    // limit alertness
    if( this.alertness > this.maxAlertness ) {
        this.alertness = this.maxAlertness;
    }

}

Vehicle.prototype.applyForce=function(force) {
    this.acceleration.add(force);
}

Vehicle.prototype.addAlertness = function(a) {
    this.alertness += a;
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
    
   
    translate(this.position.x,this.position.y)
    var radius = this.r + this.alertness
    
    
  
    stroke(0)
    strokeWeight(0)
    rotate( this.velocity.heading() + Math.PI*0.5);
    
    fill(this.color)
    ellipse(0, -radius*2, 20,20)
    ellipse(-radius*2, radius*2, 20,20)
    ellipse(radius*2, radius*2, 20,20)
    
    stroke(255,255-radius*20)
    strokeWeight(1)
    noFill()
    ellipse(0,0,radius*5,radius*5)
    
    pop()
    
}

/* end of Vehicle class */

function disturber(inf){
distSize = inf
  
    push()
    noStroke()
    fill(255,(distSize*10)+50)
    ellipse(mouseX,mouseY,(distSize*2)+10,(distSize*2)+10)
    ellipse(mouseX,mouseY,(distSize*4)+30,(distSize*4)+30)
    ellipse(mouseX,mouseY,(distSize*8)+50,(distSize*8)+50)
    pop()
}




