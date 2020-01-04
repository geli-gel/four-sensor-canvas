class Drawing {

  constructor(p, xStart, yStart){
    this.p = p
    this.x = xStart
    this.y = yStart
    //... kind of a work in progress...
    //   this.modelName = modelName
    console.log('drawing testname from constructor: ', this.testName)
  }


  move() {
    this.x = this.x + this.p.random(-5,5);
    this.y = this.y + this.p.random(-5,5);
    // to-do: make move take in a type parameter and do a case-switch with how to move it (i think?)
    // this.x += this.p.random(-this.speed, this.speed)
  }

  // to-do: for bonk - what to do if it's reached an edge


  display() {
    this.p.stroke(255);
    this.p.strokeWeight(4);
    this.p.noFill();
    this.p.ellipse(this.x, this.y, 20, 20);
    this.p.push()
    this.p.text('poopy',200,150)
  }
}

export default Drawing;
