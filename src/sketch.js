// import Drawing from './drawing';
import Drawing from './drawing';
// import p5 from 'p5';
// from here: https://github.com/slin12/react-p5-wrapper

// import ml5 from 'ml5';
// that import caused problems. instead i pasted the cdn link into index.html (hopefully that works?)

// figured out how to get ml5 "defined" even though it was correctly showing the version
const ml5 = window.ml5;

// maybe need to include the serialport thingy here?? (currently got added into index.html)
const p5 = window.p5; // idk, maybe do the npm install better...
// gonna try to just copy the file into my project

export default function sketch (p) {
  // props being initialized, will be changed by props soon
  let modelName = ""; // this is from a useful example where they take in a prop and do some math to it before assigning it to a variable that does something on the canvas
  // also need 
  let model;
  let strokePath = null;
  let x, y;
  let pen = 'down';

  let drawingAmount = 0;
  let canvasWidth = 0;
  let canvasHeight = 0;
  let drawingAnimation = "";
  let sendMessageToApp;

  // array to hold all drawing objects that are created
  let drawingsArray = [];
  // array to hold arrays of line data
  let currentDrawingLineData = [];

  // maybe? 
  let serial;

  const portName = '/dev/tty.usbmodem14201';


  // trying putting the sketch piece functions out here??
  function modelReady() {
    console.log("model ready");
    model.reset(); // should reset when loading but calling anyway - because this is a machine learning model giving us sequential information, we have to reset to draw a new model
    model.generate(gotSketch); // gives you a stroke object each time you say "generate" - includes dx, dy, and pen (up, down, or end)
  };

  function gotSketch(error, s) { // ml5 is written to use error first callbacks (different from p5)
    if (error) {
      console.error(error);
    } else {
    strokePath = s;
    // console.log(strokePath);
    }
  }


  p.setup = () => {
    p.createCanvas(canvasWidth, canvasHeight, p.WEBGL);
    // drawing1 = new Drawing(p, 600, 400, modelName); 
    
    // coding train says to put background in setup not in draw
    p.background(0,0,80);

    console.log('in sketch setup, modelName: ', modelName)

    // serialport basics from https://itp.nyu.edu/physcomp/labs/labs-serial-communication/lab-serial-input-to-the-p5-js-ide/
    serial = new p5.SerialPort(); // maybe move this outside of setup? i think it belongs here though

    // i think instead of all of this. you can put this: but maybe not

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
    
    // testing making a certain number of drawingsArray show up based on what's in props
    // for (let i = 0; i < drawingAmount; i++ ) {
    //   // to-do: make the xStart and yStart different depending on animation/size props
    //   const xStart = p.random(0, canvasWidth/2);
    //   const yStart = p.random(0, canvasHeight/2);
    //   // console.log(`drawing#{i}'s xStart: `, xStart);
    //   // console.log(`drawing#{i}'s yStart: `, yStart);

    //   drawingsArray.push(new Drawing(p, xStart, yStart, modelName))
    // };

    // testing making a sketch-rnn model get drawn based on what's in props
    // following along w/ the coding train
    // https://www.youtube.com/watch?v=pdaNttb7Mr8
    x = p.random(-canvasWidth / 2, canvasWidth / 2);
    y = p.random(-canvasHeight / 2, canvasHeight / 2);// p5 has changed since the video was made and 0,0 is the center of the canvas not width/2
    model = ml5.sketchRNN(modelName, modelReady);
  };

  p.myCustomRedrawAccordingToNewPropsHandler = function (props) {
    modelName = props.modelName;
    drawingAmount = props.drawingAmount; 
    drawingAnimation = props.drawingAnimation;
    canvasWidth = props.canvasWidth;
    canvasHeight = props.canvasHeight;
    sendMessageToApp = props.sendMessageToApp; // it has a warning that sendMessageToApp is a function (which it's supposed to be, which makes me think I'm doing this completely wrong but, it's working!! I think!)

    // leftover props passed into the p5wrapper:
    // drawingsArrayize={sketchDetails.drawingsArrayize}
    // drawingAmount={sketchDetails.drawingAmount}
    // drawingColor={sketchDetails.drawingColor}

    // testing making a sketch-rnn model get drawn based on what's in props
    // following along w/ the coding train
    // https://www.youtube.com/watch?v=pdaNttb7Mr8
    x = p.random(-canvasWidth / 2, canvasWidth / 2);
    y = p.random(-canvasHeight / 2, canvasHeight / 2);// p5 has changed since the video was made and 0,0 is the center of the canvas not width/2
    model = ml5.sketchRNN(modelName, modelReady);
  };
  
  p.draw = () => {

    p.noFill();

    // p.background(0,0,80);


    let t = p.frameCount / 60; // update time (from https://p5js.org/examples/simulate-snowflakes.html)
    
    // update(move) and display any existing drawingsArray
    p.push();
    if (drawingsArray.length > 0) {
      p.background(0,0,80);
      console.log(drawingsArray);
      for (let drawingObject of drawingsArray) { // apparently you can loop through the array like this
        drawingObject.update(t)
        drawingObject.display();

        // ALSO display the current bee beeing drawn
        p.beginShape();
        for (let lineParts of currentDrawingLineData) {
          p.vertex(lineParts[0], lineParts[1]);
        };
        p.endShape();


      };
  
    }
    p.pop();


    // for the example one
    // p.background(100);
    // p.noStroke();
    // p.push();

    // drawingsArray.forEach((drawing) => {
    //   drawing.move();
    //   drawing.display();
    // })
    // p.pop(); 

    // for the coding train one
    // he said to draw the background only in setup
    // p.translate(canvasWidth / 2, canvasHeight / 2);// he said he'd explain this line but never did! all it is doing is making my drawingsArray happen off canvas so I'm commenting it out.
    if (strokePath != null) { // he's saying he could control how the draw loop works with the query to the model in a different way, but this is an easy way to do it - draw's just going to loop (what other way is he talking about???)
      let newX = x + strokePath.dx * 0.1;
      let newY = y + strokePath.dy * 0.1;
      if (pen === 'down') {
          // draw immediately
          p.stroke(200,200, 0);
          p.strokeWeight(4);
          p.line(x, y, newX, newY);

          // add the line data to array
          currentDrawingLineData.push([x,y]);
          currentDrawingLineData.push([newX,newY]);
          console.log(currentDrawingLineData);

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
        // create and push a new Drawing object from the currentDrawingLineData into the drawingsArray array, and reset currentDrawingLineData to empty
        // what drawing v2 takes in:   constructor(p, xStart, yStart, modelName, lineData, drawingAnimation )
        const lineData = [...currentDrawingLineData]; // copy array
        drawingsArray.push(new Drawing(p, 0, 0, modelName, lineData, drawingAnimation));

        //move outside and call 'initializeNewDrawing()'?
        model.reset();
        model.generate(gotSketch);
        x = p.random(-canvasWidth / 2, canvasWidth / 2);
        y = p.random(-canvasHeight / 2, canvasHeight / 2);
        pen = 'down'; // bug found by yt commenter

        // https://www.jstips.co/en/javascript/two-ways-to-empty-an-array/
        currentDrawingLineData.length = 0;
      }


    };



  };
};

// from here: https://codesandbox.io/s/react-p5-wrapper-trjwy

// const sketch = p => {
//   p.setup = () => {
//     p.createCanvas(300, 300);
//   };
//   p.draw = () => {
//     p.background(240);
//     if (p.mouseX === 0 && p.mouseY === 0) return;
//     p.fill(255, 0, 0);
//     p.noStroke();
//     p.ellipse(p.mouseX, p.mouseY, 100, 100);
//   };
// };
