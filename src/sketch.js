import Drawing from './drawing';
const ml5 = window.ml5;
const p5 = window.p5;

export default function sketch (p) {
  // variables set by myCustomRedrawAccordingToNewPropsHandler
  let modelName = ""; 
  let drawingAmount = 0;
  let canvasWidth = 0;
  let canvasHeight = 0;
  let drawingAnimation = "";
  let drawingSize = 0.1;
  let sendMessageToApp;
  
  // ml5 model, stroke, tracking and drawing initializing variables
  let model;
  let strokePath = null;
  let pen = 'down';
  let x, y;
  let currentDrawingLineData = [];

  // array to hold all drawing objects that are created
  let drawingsArray = [];

  // object to hold all flocking boids
  let flock;

  // p5.serialport variables
  let serial;
  const portName = '/dev/tty.usbmodem14201'; // hard-coded to my computer's port recieving data from Arduino

  // function called in p.setup when creating ml5.sketchRNN model
  function modelReady() {
    console.log("model ready");
    model.reset();
    strokePath = null;
    model.generate(gotSketch); // model.generate returns an object containing stroke path and pen status which is passed into gotSketch
  };

  // function called in p.draw when generating new ml5 model stroke path
  function gotSketch(error, s) { // ml5 is written to use error first callbacks (different from p5)
    if (error) {
      console.error(error);
    } else {
    strokePath = s;
    }
  }

  p.setup = () => {
    p.createCanvas(canvasWidth, canvasHeight, p.WEBGL);
    p.background(0,0,80);

    // setup for flocking animation
    flock = new Flock();

    console.log('in sketch setup, modelName: ', modelName)

    // serialport basics from https://itp.nyu.edu/physcomp/labs/labs-serial-communication/lab-serial-input-to-the-p5-js-ide/
    serial = new p5.SerialPort(); 

    serial.list();

    serial.on('list', printList); // could be a callback to determine port that matches character's usb modem and programattically setting portName
    function printList(portList) { 
      for (let i = 0; i < portList.length; i++) {
        console.log(i + " " + portList[i])
      }
    };

    serial.open(portName);

    // TO-DO maybe: (write the callback functions)
    // serial.on('connected', serverConnected);
    // serial.on('error', serialError);
    // serial.on('close', portClose);

    serial.on('data', serialEvent);

    function serialEvent() {
      var arduinoMessage = serial.readLine();
      if (arduinoMessage.length > 1) {
        sendMessageToApp(arduinoMessage);      
      };
    };

    // following along w/ the coding train
    // https://www.youtube.com/watch?v=pdaNttb7Mr8
    x = p.random(-canvasWidth / 2, canvasWidth / 2);
    y = p.random(-canvasHeight / 2, canvasHeight / 2);
    model = ml5.sketchRNN(modelName, modelReady);
  };

  p.myCustomRedrawAccordingToNewPropsHandler = function (props) {
    modelName = props.modelName;
    drawingAmount = props.drawingAmount; 
    drawingAnimation = props.drawingAnimation;
    drawingSize = props.drawingSize;
    canvasWidth = props.canvasWidth;
    canvasHeight = props.canvasHeight;
    sendMessageToApp = props.sendMessageToApp; 

    // leftover props passed into the p5wrapper:
    // drawingAmount={sketchDetails.drawingAmount}
    // drawingColor={sketchDetails.drawingColor}

    x = p.random(-canvasWidth / 2, canvasWidth / 2);
    y = p.random(-canvasHeight / 2, canvasHeight / 2);
    model = ml5.sketchRNN(modelName, modelReady);
    currentDrawingLineData.length = 0;
  };
  
  p.draw = () => {
    
    p.noFill();
    
    let t = p.frameCount / 60; // update time (from https://p5js.org/examples/simulate-snowflakes.html)
    p.background(0,0,80);

    // FIRST update the flock
    flock.run();
    
    // update location of and display any existing drawings in drawingsArray
    p.push();
    if (drawingsArray.length > 0) {
      // p.background(0,0,80);
      // console.log(drawingsArray);
      for (let drawingObject of drawingsArray) { 
        drawingObject.update(t);
        drawingObject.display();
      };
    }
    p.pop();

    // 

    // ALSO display the current bee beeing drawn (since it hasn't been made into an object yet)
    // IF
    if (strokePath != null) {
      p.beginShape();
      for (let lineParts of currentDrawingLineData) {
        p.vertex(lineParts[0], lineParts[1]);
      };
      p.endShape();
    }


    // for the coding train one
    // p.translate(canvasWidth / 2, canvasHeight / 2);// he said he'd explain this line but never did! all it is doing is making my drawingsArray happen off canvas so I'm commenting it out.
    if (strokePath != null) { // he's saying he could control how the draw loop works with the query to the model in a different way, but this is an easy way to do it - draw's just going to loop (what other way is he talking about???)
      let newX = x + strokePath.dx * drawingSize;
      let newY = y + strokePath.dy * drawingSize;
      if (pen === 'down') {
          // draw immediately
          p.stroke(200,200, 0);
          p.strokeWeight(4);
          p.line(x, y, newX, newY);

          // add the line data to array
          currentDrawingLineData.push([x,y]);
          currentDrawingLineData.push([newX,newY]);
          // console.log(currentDrawingLineData);

        }
      // move x and y to new spot, reset strokePath, set pen for next stroke
      x = newX;
      y = newY;
      pen = strokePath.pen;
      strokePath = null;

      if (pen !== 'end') {
        model.generate(gotSketch); // request the next strokePath
      } else {
        console.log('drawing complete');

        const lineData = [...currentDrawingLineData]; // copy array
        
        // add to flock as a boid if drawingAnimation is flock
        console.log('sketch drawingAnimation: ', drawingAnimation);
        console.log('sketch drawingAnimation === "flock": ', drawingAnimation === "flock");
        let animationType = String(drawingAnimation);
        if (animationType === "flock") {
          flock.addBoid(new Drawing(p, 0, 0, modelName, lineData, drawingAnimation, canvasWidth, canvasHeight));
        } else { // otherwise just push a new drawing object
          // create and push a new Drawing object from the currentDrawingLineData into the drawingsArray array, and reset currentDrawingLineData to empty
          drawingsArray.push(new Drawing(p, 0, 0, modelName, lineData, drawingAnimation, canvasWidth, canvasHeight));
        }

        //move outside and call 'initializeNewDrawing()'?
        model.reset();
        model.generate(gotSketch);
        x = p.random(-canvasWidth / 2, canvasWidth / 2);
        y = p.random(-canvasHeight / 2, canvasHeight / 2);
        pen = 'down'; // bug found by youtube commenter

        currentDrawingLineData.length = 0;
      }

    };

  };

  function Flock() {
    this.boids = [];
  }

  Flock.prototype.run = function() {
    // p.background(0,0,80);

    for (let i = 0; i < this.boids.length; i++) {
      this.boids[i].run(this.boids); // passing the entire boids array to each boid and calling boid.run
    }
  }

  Flock.prototype.addBoid = function(b) {
    this.boids.push(b);
  }


};
