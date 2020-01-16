import p5 from 'p5';

class Drawing {

  constructor(p, xStart, yStart, modelName, lineData, drawingAnimation, canvasWidth, canvasHeight, drawingSize, drawingColor){
    this.p = p
    this.x = xStart
    this.y = yStart
    this.modelName = modelName;
    this.lineData = lineData;
    this.drawingAnimation = drawingAnimation;
    this.drawingSize = drawingSize;
    this.drawingColor = String(drawingColor);

    this.canvasWidth = Number(canvasWidth);
    this.canvasHeight = Number(canvasHeight);
    
    // flock setup stuff goes here
    // modified https://p5js.org/examples/simulate-flocking.html

    this.acceleration = this.p.createVector(0,0);
    this.velocity = p5.Vector.random2D();
    this.position = this.p.createVector(this.x, this.y); // I have this.x, this.y start points. hmm. 
    this.r = drawingSize * 300; // need to set to drawingSize * 100? (.1 would become 10) // or use 30
    this.maxspeed = 2.5;
    this.maxforce = 0.04;
  }


  wiggleAround() {
    console.log('wiggling');
    this.x = this.x + this.p.random(-5,5);
    this.y = this.y + this.p.random(-5,5);
  }

  infiniteFall() {
    this.y = this.y + 2;
    if (this.y > (this.canvasWidth) + this.r) this.y = 0 - this.r;
  }

  // flocking functions
  run(boids) {
      this.flock(boids);
      this.flockUpdate(); // theirs is called update
      this.borders();
      this.render(); // needs to be different from display since using position instead of x and y
  }

  applyForce(force) {
    this.acceleration.add(force);
  }

  flock(boids) { // modified from https://p5js.org/examples/simulate-flocking.html to work with my system    
    if (boids) {
      if (boids.length > 0) {
        let sep = this.separate(boids); 
        let ali = this.align(boids);
        let coh = this.cohesion(boids);
        // arbitrarily weight these forces
        sep.mult(1.5);
        ali.mult(1.0);
        coh.mult(1.0);
        // add the force vectors to acceleration
        this.applyForce(sep);
        this.applyForce(ali);
        this.applyForce(coh);
      }
    }
  }

  flockUpdate() {
    // update velocity
    this.velocity.add(this.acceleration);
    // limit speed
    this.velocity.limit(this.maxspeed);
    this.position.add(this.velocity);
    // reset acceleration to 0 each cycle
    this.acceleration.mult(0);
  }

  // method that calcs and applies steering force towards a target
  seek(target) {
    let desired = p5.Vector.sub(target, this.position); // A vector pointing from the location to the target
    // to-do: understand what normalizing means better
    // normalize desired and scale to max speed (?????)
    desired.mult(this.maxspeed);
    // steering = desired minus velocity
    let steer = p5.Vector.sub(desired, this.velocity);
    steer.limit(this.maxforce);
    return steer;
  }

  render() {
    // Draw a triangle rotated in the direction of velocity

    // let theta = this.velocity.heading() + this.p.radians(90);
    // this.p.stroke(200);
    // this.p.push();
    // this.p.translate(this.position.x, this.position.y);
    // this.p.rotate(theta);
    // this.p.beginShape();
    // this.p.vertex(0, -this.r / 2);
    // this.p.vertex(-this.r, this.r / 2);
    // this.p.vertex(this.r, this.r / 2);
    // this.p.endShape(this.p.CLOSE);
    // this.p.pop();

    
    // Draw the ml5 drawing after translating to current position

    this.p.push();
    this.p.translate(this.position.x, this.position.y);
    this.p.stroke(this.drawingColor);
    // to-do: make it so that stroke weight depends on drawing size
    this.p.strokeWeight(4);
    this.p.beginShape(this.p.LINES);
    for (let lineParts of this.lineData) { 
      // to-do: make it so flock drawings can be drawn in random places and will line up with position of 
      this.p.vertex(lineParts[0], lineParts[1]); // only draws on top of position if actual drawing starts from 0,0...
    }
    this.p.endShape();
    this.p.pop();
  }

  // wraparound // THIS WAS MESSED UP AND DOING QUADRANTS
  borders() {
    if (this.position.x < (-this.canvasWidth / 2) -this.r)  this.position.x = (this.canvasWidth / 2 ) + this.r;
    if (this.position.y < (-this.canvasHeight / 2) -this.r)  this.position.y = (this.canvasHeight / 2) + this.r;
    if (this.position.x > (this.canvasWidth / 2) + this.r) this.position.x = (-this.canvasWidth / 2) -this.r;
    if (this.position.y > (this.canvasHeight / 2) + this.r) this.position.y = -(this.canvasHeight / 2) + this.r;
  }

  // Separation (steer away from nearby boids)
  separate(boids) {
    let desiredSeparation = this.drawingSize * 300;
    let steer = this.p.createVector(0,0);
    let count = 0;
    // check each boid IF there's a boid.
    if (boids && boids.length > 0) {
      for (let i = 0; i < boids.length; i++) {
        let d = p5.Vector.dist(this.position, boids[i].position);
        // if greater than 0 and less than arbitrary amount (0 when you are yourself)
        if ((d > 0) && (d < desiredSeparation)) {
          //calc vect pointing away from neighbor
          let diff = p5.Vector.sub(this.position, boids[i].position);
          diff.normalize();
          // to-do: understand the weight by distance thing better
          diff.div(d) // weight by distance (??)
          steer.add(diff);
          count++;
        }
      }
    }
    // avg - divide by how many
    if (count > 0) {
      steer.div(count);
    }
    // as long as vec is greater than 0
    if (steer.mag() > 0) {
      //implement reynonds: steering = desired - velocity
      steer.normalize();
      steer.mult(this.maxspeed);
      steer.sub(this.velocity);
      steer.limit(this.maxforce);
    }
    return steer;
  }

  // Alignment
  // For every nearby boid in the system, calculate the average velocity
  align(boids) {
    let neighborDist = this.drawingSize * 300;
    let sum = this.p.createVector(0, 0);
    let count = 0;
    for (let i = 0; i < boids.length; i++) {
      // let d = this.p.Vector.dist(this.position, boids[i].position);
      let d = p5.Vector.dist(this.position, boids[i].position);
      // if ((d > 0) && (d < neighborDist)) {
      if ((boids[i] !== this) && (d < neighborDist)) {
        sum.add(boids[i].velocity);
        count++;
      }
    }
    if (count > 0) {
      sum.div(count);
      sum.normalize();
      sum.mult(this.maxspeed);
      let steer = p5.Vector.sub(sum, this.velocity);
      steer.limit(this.maxforce);
      return steer;
    } else {
      return this.p.createVector(0, 0);
    }
  }

  // Cohesion
  // For the average location (i.e. center) of all nearby boids, calculate steering vector towards that location
  cohesion(boids) {
    let neighbordist = this.drawingSize * 600;
    let sum = this.p.createVector(0, 0); // Start with empty vector to accumulate all locations
    let count = 0;
    for (let i = 0; i < boids.length; i++) {
      // let d = this.p.Vector.dist(this.position, boids[i].position);
      let d = this.position.dist(boids[i].position);
      if ((d > 0) && (d < neighbordist)) {
        sum.add(boids[i].position); // Add location
        count++;
      }
    }
    if (count > 0) {
      sum.div(count);
      return this.seek(sum); // Steer towards the location
    } else {
      return this.p.createVector(0, 0);
    }
  }  

  display() {
    this.p.stroke(this.drawingColor);
    this.p.strokeWeight(4);
    this.p.beginShape(this.p.LINES);
    for (let lineParts of this.lineData) {
      // this.p.line(lineParts[0] + this.x, lineParts[1] + this.y , lineParts[2] + this.x, lineParts[3] + this.y);
      this.p.vertex(lineParts[0] + this.x, lineParts[1] + this.y);
    }
    this.p.endShape();
  }

  update = (time) => { 

    const animationType = String(this.drawingAnimation);
    console.log('drawing update, this.drawingAnimation: ', this.drawingAnimation);
    console.log('drawing update, animationType: ', animationType);
    switch(animationType) {
      case "wiggleAround":
        this.wiggleAround();
        break;
      case "infiniteFall":
        this.infiniteFall();
        break;
      default:
        console.log('no corresponding animation for: ', this.drawingAnimation);
    }
  }
}

export default Drawing;
