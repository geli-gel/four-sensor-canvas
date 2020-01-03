import React, { Component } from 'react';
import './App.css';
// import P5Wrapper from 'react-p5-wrapper'; // the legit one
import DrawingZone from './components/DrawingZone';
import SettingsZone from './components/SettingsZone';
// import P5Wrapper from "./P5Wrapper"; // the weird one

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      sketchDetails: {
        drawingModel: undefined,
        drawingSize: undefined,
        drawingCount: undefined,
        drawingColor: undefined,
        drawingAnimation: undefined,
      },

      topTokenDescriptions: {
        TOP1: "bee", // in the future these will be able to be set to whatever via dropdown in reader settings
        TOP2: "flower",
        TOP3: "strawberry",
        TOP4: "snail",
        TOP5: "castle",
        TOP6: "ant",
      },

      leftTokenDescriptions: {
        LEFT1: "slow, falling",
        LEFT2: "slow, rising",
        LEFT3: "slow, flocking",
      },

      rightTokenDescriptions: {
        RIGHT1: "small, many",
        RIGHT2: "medium, some",
        RIGHT3: "large, few",
        RIGHT4: "mix, some",
      },

      bottomTokenDescriptions: {
        BOTTOM1: "red", // it would be cool if when you change the token, new ones pop up in that color and slowly replace the old color (so drawings have lifetimes)
        BOTTOM2: "orange",
        BOTTOM3: "yellow",
        BOTTOM4: "green",
        BOTTOM5: "blue",
        BOTTOM6: "purple",
        BOTTOM7: "cyan",
        BOTTOM8: "magenta",
        BOTTOM9: "black",
        BOTTOM10: "rainbow", // either each drawing is a random color, or better, each stroke of each drawing is a random color
      },
      
      readerLabels: {
        top: "Empty",
        left: "Empty",
        right: "Empty",
        bottom: "Empty",  
      }
    }
  }

  // to-do: add the serial listener for arduino
  // on 'data' change state that will cause App to rerender
  // this is where a lot of logic will be - for determining what the sketchDetails are depending on what messages come from arduino
  // ex:
  // message: "TOP1"
  // logic: if TOP1, setState drawingModel: tokendesc[TOP1]

  // arduino logic: tokens belong to specific readers
  // ex:
  // message: "UPWrong"
  // logic: if UPWrong, 


  render() {
    return (
      <div className="App">
        <DrawingZone
          canvasWidth={600}
          canvasHeight={400}
          sketchDetails={this.state.sketchDetails}
        />
        {/* Weird P5Wrapper */}
        {/* <P5Wrapper sketch={sketch}  /> */}

        <SettingsZone
          modelName={this.state.sketchDetails.drawingModel}
        />


      </div>
    );
  }
}


export default App;
