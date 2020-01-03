// from here: https://github.com/slin12/react-p5-wrapper

export default function sketch (p) {
  let modelName = "";

  p.setup = function () {
    p.createCanvas(600, 400, p.WEBGL);
  };

  p.myCustomRedrawAccordingToNewPropsHandler = function (props) {
    if (props.modelName){
      modelName = props.modelName;
    }
  };

  p.draw = function () {
    p.background(100);
    p.noStroke();
    p.push();
    // todo - add text showing model name prop
    p.box(100);
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

// export default sketch;
