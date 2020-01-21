import Drawing from './drawing';
const ml5 = window.ml5;
const p5 = window.p5;

// modified https://p5js.org/examples/simulate-flocking.html

export default function sketch (p) {
  // variables set by myCustomRedrawAccordingToNewPropsHandler
  let modelName = ""; 
  let drawingAmount = 0;
  let canvasWidth = 0;
  let canvasHeight = 0;
  let drawingAnimation = "";
  let drawingSize = 0;
  let sendMessageToApp;
  let drawingColor = "";
  let rainbowOn = false;
  const rainbowColors = ['crimson','orange','gold','lawngreen','mediumblue','darkviolet','cyan','magenta','aquamarine'];
  
  // ml5 model, stroke, tracking and drawing initializing variables
  let model;
  let strokePath = null;
  let pen = 'down';
  let x, y;
  let xStart, yStart;
  let currentDrawingLineData = [];
  // array to hold all drawing objects that are created
  let drawingsArray = [];

  // object to hold all flocking boids
  let flock;

  // object to represent slider
  let drawingSizeSlider;
  let canvasRed;
  let canvasGreen;
  let canvasBlue;

  // button objects & functions
  let clearOldDrawingsButton;
  let newDrawingButton;
  let nonstopButton;

  let nonstop = false;

  function toggleNonstop() {
    nonstop = !nonstop;
    if (nonstop) {

    // initialize new drawing stuff
    currentDrawingLineData.length = 0;
    pen = 'down'
    // set drawingColor to random if it's currently set to Rainbow
    if (rainbowOn) {
      drawingColor = String(rainbowColors[Math.floor(Math.random()*rainbowColors.length)]);
    } 

    //to-do: move outside and call 'initializeNewDrawing()'?
    model.reset();
    model.generate(gotSketch);

    if (drawingAnimation === 'flock'){
      x = 0;
      y = 0;
      xStart = x;
      yStart = y;

    } else {
      x = p.random((-canvasWidth / 2) * 0.9, (canvasWidth / 2) * 0.9);
      y = p.random((-canvasHeight / 2) * 0.9, (canvasHeight / 2) * 0.9);
      xStart = x;
      yStart = y;
    }
    }
  }

  function clearOldDrawings() {
    if (flock.boids.length > 0) {
      flock.boids.length = 0;
    }
    if (drawingsArray.length > 0) {
      drawingsArray.length = 0;
    }
    // initialize new drawing stuff
    currentDrawingLineData.length = 0;
    pen = 'down'
    // set drawingColor to random if it's currently set to Rainbow
    if (rainbowOn) {
      drawingColor = String(rainbowColors[Math.floor(Math.random()*rainbowColors.length)]);
    } 

    //to-do: move outside and call 'initializeNewDrawing()'?
    model.reset();
    model.generate(gotSketch);

    if (drawingAnimation === 'flock'){
      x = 0;
      y = 0;
      xStart = x;
      yStart = y;

    } else {
      x = p.random((-canvasWidth / 2) * 0.9, (canvasWidth / 2) * 0.9);
      y = p.random((-canvasHeight / 2) * 0.9, (canvasHeight / 2) * 0.9);
      xStart = x;
      yStart = y;
    }
  }

  function deleteOldestDrawing() {
    if (flock.boids.length > 0) {
      flock.boids.splice(0,1);
    } else if (drawingsArray.length > 0) {
      drawingsArray.splice(0,1);
    }

    if (strokePath === null) {
  
      // initialize new drawing stuff
      currentDrawingLineData.length = 0;
      pen = 'down'
      // set drawingColor to random if it's currently set to Rainbow
      if (rainbowOn) {
        drawingColor = String(rainbowColors[Math.floor(Math.random()*rainbowColors.length)]);
      } 
  
      //to-do: move outside and call 'initializeNewDrawing()'?
      model.reset();
      model.generate(gotSketch);
  
      if (drawingAnimation === 'flock'){
        x = 0;
        y = 0;
        xStart = x;
        yStart = y;
  
      } else {
        x = p.random((-canvasWidth / 2) * 0.9, (canvasWidth / 2) * 0.9);
        y = p.random((-canvasHeight / 2) * 0.9, (canvasHeight / 2) * 0.9);
        xStart = x;
        yStart = y;
      }

    }

  }

  // p5.serialport variables
  let serial;
  const portName = '/dev/tty.usbmodem14201'; // hard-coded to my computer's port recieving data from Arduino

  // function called in p.setup when creating ml5.sketchRNN model
  function modelReady() {
    console.log("model ready");
    model.reset();
    strokePath = null;
    model.generate(gotSketch); // model.generate returns an object containing stroke path and pen status which is passed into gotSketch
    // set drawingColor to random if it's currently set to Rainbow
    if (rainbowOn) {
      drawingColor = String(rainbowColors[Math.floor(Math.random()*rainbowColors.length)]);
    } 
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
    
    // setup for flocking animation
    flock = new Flock();
    
    // slider variables for new drawing size, canvas color
    drawingSizeSlider = p.createSlider(.05,.7, .1, .05);
    drawingSizeSlider.class('size')
    canvasRed = p.createSlider(0,255,60,10);
    canvasRed.class('slider red');
    canvasGreen = p.createSlider(0,255,160,10);
    canvasGreen.class('slider green');
    canvasBlue = p.createSlider(0,255,170,10);
    canvasBlue.class('slider blue');
    
    p.background(canvasRed.value(), canvasGreen.value(), canvasBlue.value());

    // button variables
    clearOldDrawingsButton = p.createButton('clear old drawings')
    clearOldDrawingsButton.mouseClicked(clearOldDrawings);
    newDrawingButton = p.createButton('delete oldest drawing & create new')
    newDrawingButton.mouseClicked(deleteOldestDrawing);
    nonstopButton = p.createButton('nonstop');
    nonstopButton.mouseClicked(toggleNonstop);
    
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
    if (drawingAnimation === 'flock'){
      x = 0;
      y = 0;
      xStart = x;
      yStart = y;

    } else {
      x = p.random(-canvasWidth / 2, canvasWidth / 2);
      y = p.random(-canvasHeight / 2, canvasHeight / 2);
      xStart = x;
      yStart = y;
    }

    // clear lineData array
    currentDrawingLineData.length = 0;

    // set drawingColor to random if it's currently set to Rainbow
    if (drawingColor === "rainbow") {
      rainbowOn = true;
      drawingColor = String(rainbowColors[Math.floor(Math.random()*rainbowColors.length)]);
    } 
  };

  p.myCustomRedrawAccordingToNewPropsHandler = function (props) {
    modelName = props.modelName;
    switch (props.drawingAmount) {
      case "few":
        drawingAmount = 7;
        break;
      case "some":
        drawingAmount = 11;
        break;
      case "many":
        drawingAmount = 16;
        break;
      case "tooMany":
        drawingAmount = 21;
        break;
      default:
        console.log('invalid drawing amount: ', props.drawingAmount);
    }

    drawingColor = String(props.drawingColor);
    if (drawingColor === "rainbow") {
      rainbowOn = true;
    } else {
      rainbowOn = false;
    }
    drawingAnimation = String(props.drawingAnimation);
    canvasWidth = props.canvasWidth;
    canvasHeight = props.canvasHeight;
    sendMessageToApp = props.sendMessageToApp; 

    if (drawingAnimation === 'flock'){
      x = 0;
      y = 0;
      xStart = x;
      yStart = y;

    } else {
      x = p.random(-canvasWidth / 2, canvasWidth / 2);
      y = p.random(-canvasHeight / 2, canvasHeight / 2);
      xStart = x;
      yStart = y;
    }

    model = ml5.sketchRNN(modelName, modelReady);
    currentDrawingLineData.length = 0;
  };
  
  p.draw = () => {
    p.background(canvasRed.value(), canvasGreen.value(), canvasBlue.value());
    p.noFill();
    p.stroke(drawingColor);

    // button class stuff
    if (nonstop) {
      nonstopButton.class('nonstop-on');
    } else {
      nonstopButton.removeClass('nonstop-on')
    }
    
    // to-do: figure out how to incorporate time for an animation
    // let t = p.frameCount / 60; // update time (from https://p5js.org/examples/simulate-snowflakes.html)


    // FIRST FIRST remove a things if the flock or drawings list is too big
    let numberOfAllowedDrawings = Number(drawingAmount);
    if (drawingsArray.length + flock.boids.length > numberOfAllowedDrawings) {
      if (drawingsArray.length >= flock.boids.length) {
        drawingsArray.splice(0,1);
      }
      else {
        flock.boids.splice(0,1);
      }
    } else if ((flock.boids.length + drawingsArray.length === numberOfAllowedDrawings) && nonstop) {
      if (drawingsArray.length >= flock.boids.length) {
        drawingsArray.splice(0,1);
      }
      else {
        flock.boids.splice(0,1);
      }
    }

    // FIRST update the flock
    flock.run();
    
    // update location of and display any existing drawings in drawingsArray
    p.push();
    if (drawingsArray.length > 0) {
      for (let drawingObject of drawingsArray) { 
        drawingObject.update();
        drawingObject.display();
      };
    }
    p.pop();

    // 

    // ALSO display the current bee beeing drawn (since it hasn't been made into an object yet)
    if (strokePath != null) {
      p.noFill();
      p.stroke(drawingColor);
      p.beginShape();
      for (let lineParts of currentDrawingLineData) {
        p.vertex(lineParts[0], lineParts[1]);
      };
      p.endShape();
    }


    // for the coding train one
    // p.translate(canvasWidth / 2, canvasHeight / 2);// he said he'd explain this line but never did! all it is doing is making my drawingsArray happen off canvas so I'm commenting it out.
    if (strokePath != null) {
      let newX = x + strokePath.dx * drawingSize;
      let newY = y + strokePath.dy * drawingSize;
      if (pen === 'down') {
          // draw immediately
          p.stroke(drawingColor);
          // to-do: make it so that stroke weight depends on drawing size
          p.strokeWeight(4);
          p.line(x, y, newX, newY);

          // add the line data to array
          currentDrawingLineData.push([x,y]);
          currentDrawingLineData.push([newX,newY]);
        }
      // move x and y to new spot, reset strokePath, set pen for next stroke
      x = newX;
      y = newY;
      pen = strokePath.pen;
      strokePath = null;

      if (pen !== 'end') {
        model.generate(gotSketch); // request the next strokePath
      } else {
        // add the final line data to array
        currentDrawingLineData.push([x,y]);
        currentDrawingLineData.push([newX,newY]);
        
        const lineData = [...currentDrawingLineData]; // copy array
        
        // set drawingSize according to slider
        drawingSize = drawingSizeSlider.value();
        
        // add to flock as a boid if drawingAnimation is flock
        let animationType = String(drawingAnimation);
        if (animationType === "flock") {
          flock.addBoid(new Drawing(p, xStart, yStart, modelName, lineData, drawingAnimation, canvasWidth, canvasHeight, drawingSize, drawingColor)); // testing drawing from x,yStart instead of 0 and should be original xystart
        } else { // otherwise just push a new drawing object
          // create and push a new Drawing object from the currentDrawingLineData into the drawingsArray array, and reset currentDrawingLineData to empty
          drawingsArray.push(new Drawing(p, 0, 0, modelName, lineData, drawingAnimation, canvasWidth, canvasHeight, drawingSize, drawingColor));
        }

        // reset the model and generate sketch line if there is room for another drawing
        if (!((flock.boids.length + drawingsArray.length) >= numberOfAllowedDrawings) || nonstop ) {

          // set drawingColor to random if it's currently set to Rainbow
          if (rainbowOn) {
            drawingColor = String(rainbowColors[Math.floor(Math.random()*rainbowColors.length)]);
          } 

          //to-do: move outside and call 'initializeNewDrawing()'?
          model.reset();
          model.generate(gotSketch);

          if (drawingAnimation === 'flock'){
            x = 0;
            y = 0;
            xStart = x;
            yStart = y;

          } else {
            x = p.random(-canvasWidth / 2, canvasWidth / 2);
            y = p.random(-canvasHeight / 2, canvasHeight / 2);
            xStart = x;
            yStart = y;
          }
          
        }
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
