import React, { Component } from 'react';
import './App.css';
import DrawingZone from './components/DrawingZone';
import SettingsZone from './components/SettingsZone';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      sketchDetails: {
        drawingModel: "bee",
        drawingSize: "",
        drawingAmount: 4,
        drawingColor: "",
        drawingAnimation: "wiggleAround",
      },

      topTokenDescriptions: {
        1: "bee", // in the future these will be able to be set to whatever via dropdown in reader settings
        2: "flower",
        3: "strawberry",
        4: "snail",
        5: "castle",
        6: "ant",
      },

      leftTokenDescriptions: {
        1: ["slow" , "falling"],
        2: ["slow", "rising"],
        3: ["slow", "flocking"],
      },

      rightTokenDescriptions: {
        1: ["small", "many"],
        2: ["medium", "some"],
        3: ["large", "few"],
        4: ["mix", "some"],
      },

      bottomTokenDescriptions: {
        1: "red", // it would be cool if when you change the token, new ones pop up in that color and slowly replace the old color (so drawings have lifetimes)
        2: "orange",
        3: "yellow",
        4: "green",
        5: "blue",
        6: "purple",
        7: "cyan",
        8: "magenta",
        9: "black",
        10: "rainbow", // either each drawing is a random color, or better, each stroke of each drawing is a random color
      },
      
      readerLabels: {
        top: "Empty",
        left: "Empty",
        right: "Empty",
        bottom: "Empty",  
      }
    }
  }

  onReaderMessage = (message) => {
    const lettersRegex = /(\D+)/
    const numbersRegex = /(\d+)/

    const messageWordMatch = message.match(lettersRegex);
    const messageNumberMatch = message.match(numbersRegex);
    console.log('onReaderMessage message contents (from App): ', message);

    switch(messageWordMatch[0]) {
      case "TOP":
        console.log('in switch case "TOP"')
        console.log('this.state', this.state)
        if (messageNumberMatch) {
          console.log('number match:', messageNumberMatch[0]);
          if (this.state.topTokenDescriptions[messageNumberMatch[0]]) { // I'm saying if the message has a number that corresponds to a number in this reader's state description, set the sketch details and top reader label to that,
            let updatedSketchDetails = this.state.sketchDetails;
            updatedSketchDetails.drawingModel = this.state.topTokenDescriptions[messageNumberMatch[0]];

            let updatedReaderLabels = this.state.readerLabels;
            updatedReaderLabels.top = updatedSketchDetails.drawingModel;
            this.setState({
              sketchDetails: updatedSketchDetails,
              readerLabels: updatedReaderLabels,
            })
          }
        }
        else {
          // correct word but incorrect number, so change readerlabel[top] to "invalid token"
          console.log('invalid token. message: ', message);
          let updatedReaderLabels = this.state.readerLabels;
          updatedReaderLabels.top = "Invalid Token";
          this.setState({
            readerLabels: updatedReaderLabels,
          })
        }
        break;
      default:
        console.log("invalid messageWord")
    }    
  }


  render() {

    console.log('rendering, state: ', this.state);

    return (
      <div className="App">
        <DrawingZone
          canvasWidth={600}
          canvasHeight={400}
          sketchDetails={this.state.sketchDetails}
          onReaderMessage={this.onReaderMessage}
        />

        <SettingsZone
          readerLabels={this.state.readerLabels}
        />

      </div>
    );
  }
}


export default App;
