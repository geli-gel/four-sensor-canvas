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
    console.log('wiggled the drawing')
    // to-do: make move take in a type parameter and do a case-switch with how to move it (i think?)
    // this.x += this.p.random(-this.speed, this.speed)
  }

  // to-do: for bonk - what to do if it's reached an edge


  display() {
    console.log('in Drawing, preparing to display the drawing')
    this.p.stroke(200,200, 0);
    this.p.strokeWeight(4);
    // this.p.noFill();
    this.p.beginShape(this.p.LINES);
    for (let lineParts of this.lineData) {
      // this.p.line(lineParts[0] + this.x, lineParts[1] + this.y , lineParts[2] + this.x, lineParts[3] + this.y);
      this.p.vertex(lineParts[0] + this.x, lineParts[1] + this.y);
    }
    this.p.endShape(); // forgot this... bug fixed lol >:( uhhh, 
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

// old Drawing from following video

// class Drawing {

//   constructor(p, xStart, yStart, modelName){
//     this.p = p
//     this.x = xStart
//     this.y = yStart
//     //... kind of a work in progress...
//     //   this.modelName = modelName
//     console.log('drawing modelName from constructor: ', this.modelName)
//   }


//   move() {
//     this.x = this.x + this.p.random(-5,5);
//     this.y = this.y + this.p.random(-5,5);
//     // to-do: make move take in a type parameter and do a case-switch with how to move it (i think?)
//     // this.x += this.p.random(-this.speed, this.speed)
//   }

//   // to-do: for bonk - what to do if it's reached an edge


//   display() {
//     this.p.stroke(255);
//     this.p.strokeWeight(4);
//     this.p.noFill();
//     this.p.ellipse(this.x, this.y, 20, 20);
//     this.p.push()
//     this.p.text('poopy',200,150)
//   }
// }

// export default Drawing;
