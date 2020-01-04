import Drawing from './drawing';
// from here: https://github.com/slin12/react-p5-wrapper

// import ml5 from 'ml5';
// that import caused problems. instead i pasted the cdn link into index.html (hopefully that works?)

// figured out how to get ml5 "defined" even though it was correctly showing the version
const ml5 = window.ml5;

export default function sketch (p) {
  // props being initialized, will be changed by props soon
  let modelName = ""; // this is from a useful example where they take in a prop and do some math to it before assigning it to a variable that does something on the canvas
  let drawingAmount = 0;
  let canvasWidth = 0;
  let canvasHeight = 0;
  // array to hold all drawing objects that are created
  let drawings = [];

  // the props passed into the p5wrapper:
  // sketch={sketch} 
  // canvasWidth={canvasWidth}
  // canvasHeight={canvasHeight}
  // modelName={sketchDetails.drawingModel}
  // drawingSize={sketchDetails.drawingSize}
  // drawingAmount={sketchDetails.drawingAmount}
  // drawingColor={sketchDetails.drawingColor}
  // drawingAnimation=

  p.setup = () => {
    p.createCanvas(canvasWidth, canvasHeight, p.WEBGL);
    // drawing1 = new Drawing(p, 600, 400, modelName);   
    console.log('setup drawingAmount:', drawingAmount)
    console.log('in setup, modelName: ', modelName)

   

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
