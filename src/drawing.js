import p5 from 'p5';

class Drawing {

  constructor(p, xStart, yStart, modelName, lineData, drawingAnimation, canvasWidth, canvasHeight){
    this.p = p
    this.x = xStart
    this.y = yStart
    this.modelName = modelName;
    this.lineData = lineData;
    this.drawingAnimation = drawingAnimation;

    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    
    // flock setup stuff goes here
    // to-do: decide if p5.Vector.random2D() plus setMag is better for velocity (see https://www.youtube.com/watch?v=mhjuuHl6qHM 6:43)
    this.acceleration = this.p.createVector(0,0);
    this.velocity = this.p.createVector(this.p.random(-1,1), this.p.random(-1,1));
    this.position = this.p.createVector(this.x,this.y); // I have this.x, this.y start points. hmm.
    this.r = 2.0;
    this.maxspeed = 3;
    this.maxforce = 0.05;
  }


  wiggleAround() {
    console.log('wiggling');
    this.x = this.x + this.p.random(-5,5);
    this.y = this.y + this.p.random(-5,5);
  }

  // to-do: for bonk - what to do if it's reached an edge

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

  flock(boids) { // trying to modify https://p5js.org/examples/simulate-flocking.html to work with my system    
    // "run"
    // flock(boids)
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
    // normalize desired and scale to max speed (?????)
    desired.mult(this.maxspeed);
    // steering = desired minus velocity
    let steer = p5.Vector.sub(desired, this.velocity);
    steer.limit(this.maxforce);
    return steer;
  }

  render() {
    // let theta = this.velocity.heading() + radians(90);
    // this.p.fill(127);
    // this.p.stroke(200);
    // this.p.push();
    // this.p.translate(this.position.x, this.position.y);
    // this.p.rotate(theta);
    // this.p.beginShape();
    // this.p.vertex(0, -this.r * 2);
    // this.p.vertex(-this.r, this.r * 2);
    // this.p.vertex(this.r, this.r * 2);
    // this.p.endShape(CLOSE);
    // this.p.pop();
    //
    this.p.push();
    this.p.stroke(200,200, 0);
    this.p.strokeWeight(4);
    this.p.beginShape(this.p.LINES);
    for (let lineParts of this.lineData) {
      this.p.vertex(lineParts[0] + this.position.x, lineParts[1] + this.position.y);
    }
    this.p.endShape();
    this.p.pop();
  }

  // wraparound
  borders() {
    if (this.position.x < -this.r) this.position.x = this.canvasWidth + this.r;
    if (this.position.y < -this.r) this.position.y = this.canvasHeight + this.r;
    if (this.position.x > this.canvasWidth + this.r) this.position.x = -this.r;
    if (this.position.y > this.canvasHeight + this.r) this.position.y = -this.r;
  }

  // Separation (steer away from nearby boids)
  separate(boids) {
    let desiredSeparation = 10.0;
    let steer = this.p.createVector(0,0);
    let count = 0;
    // check each boid IF there's a boid.
    if (boids && boids.length > 0) {
      // console.log('boids[0].position:', boids[0].position);
      for (let i = 0; i < boids.length; i++) {
        let d = p5.Vector.dist(this.position, boids[i].position);
        // let d = p5.Vector.dist(boids[i].position);
        // if greater than 0 and less than arbitrary amount (0 when you are yourself)
        if ((d > 0) && (d < desiredSeparation)) {
          //calc vect pointing away from neighbor
          let diff = p5.Vector.sub(this.position, boids[i].position);
          diff.normalize();
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
    let neighborDist = 50;
    let sum = this.p.createVector(0, 0);
    let count = 0;
    for (let i = 0; i < boids.length; i++) {
      // let d = this.p.Vector.dist(this.position, boids[i].position);
      let d = p5.Vector.dist(this.position, boids[i].position);
      if ((d > 0) && (d < neighborDist)) {
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
    let neighbordist = 50;
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
    this.p.stroke(200,200, 0);
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
      default:
        console.log('no corresponding animation for: ', this.drawingAnimation);
    }
  }
}

export default Drawing;
