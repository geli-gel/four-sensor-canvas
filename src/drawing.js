class Drawing {

  constructor(p, xStart, yStart, modelName, lineData, drawingAnimation){
    this.p = p
    this.x = xStart
    this.y = yStart
    this.modelName = modelName;
    this.lineData = lineData;
    this.drawingAnimation = drawingAnimation;

    // setup stuff goes here


  }


  wiggleAround() {
    this.x = this.x + this.p.random(-5,5);
    this.y = this.y + this.p.random(-5,5);
  }

  // to-do: for bonk - what to do if it's reached an edge


  display() {

    // this.p.ellipse(this.x, this.y, 5);

    // this.p.background(0,0,80);

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
    switch(this.drawingAnimation) {
      case "wiggleAround":
        this.wiggleAround();
        break;
      default:
        console.log('no corresponding animation for: ', this.drawingAnimation);
    }
  }
}

export default Drawing;
