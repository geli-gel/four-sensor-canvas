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
      }
    }
  }

  // to-do: add the serial listener for arduino
  // on 'data' change state that will cause App to rerender
  




  clearCanvas = () => {
    this.setState({
      canvasItems: []
    })
  }

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
          modelName={this.state.sketchDetails.modelName}
        />


      </div>
    );
  }
}


export default App;
