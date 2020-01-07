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
  let drawingAmount = 0;
  let canvasWidth = 0;
  let canvasHeight = 0;

  function sendMessageToApp(){};
  // array to hold all drawing objects that are created
  let drawings = [];

  // maybe? 
  let serial;

  const portName = '/dev/tty.usbmodem14201';


  // the props passed into the p5wrapper:
  // sketch={sketch} 
  // canvasWidth={canvasWidth}
  // canvasHeight={canvasHeight}
  // modelName={sketchDetails.drawingModel}
  // drawingSize={sketchDetails.drawingSize}
  // drawingAmount={sketchDetails.drawingAmount}
  // drawingColor={sketchDetails.drawingColor}
  // drawingAnimation=
  // sendMessageToApp= function onReaderMessage

  p.setup = () => {
    p.createCanvas(canvasWidth, canvasHeight, p.WEBGL);
    // drawing1 = new Drawing(p, 600, 400, modelName);   
    console.log('setup drawingAmount:', drawingAmount)
    console.log('in setup, modelName: ', modelName)

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

    // TO-DO for sure:
    serial.on('data', serialEvent);

    function serialEvent() {
      // read a byte from the serial port:
      var arduinoMessage = serial.readLine();
      // store it in a global variable:
      // console.log(arduinoMessage);
      // console.log('typeof arduinoMessage',typeof arduinoMessage)
      if (arduinoMessage.length > 1) {
        sendMessageToApp(arduinoMessage);      
      };
    };
    
    

   

    for (let i = 0; i < drawingAmount; i++ ) {
      // to-do: make the xStart and yStart different depending on animation/size props
      const xStart = p.random(0, canvasWidth/2);
      const yStart = p.random(0, canvasHeight/2);
      console.log(`drawing#{i}'s xStart: `, xStart)
      console.log(`drawing#{i}'s yStart: `, yStart)

      drawings.push(new Drawing(p, xStart, yStart, modelName))
    }

  };

  p.myCustomRedrawAccordingToNewPropsHandler = function (props) {
    modelName = props.modelName;
    drawingAmount = props.drawingAmount; 
    canvasWidth = props.canvasWidth;
    canvasHeight = props.canvasHeight;
    sendMessageToApp = props.sendMessageToApp; // it has a warning that sendMessageToApp is a function (which it's supposed to be, which makes me think I'm doing this completely wrong but, it's working!! I think!)
  };

  p.draw = () => {
    p.background(100);
    p.noStroke();
    p.push();

    drawings.forEach((drawing) => {
      drawing.move();
      drawing.display();
    })
    p.pop(); 
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
