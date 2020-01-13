import React, { Component } from 'react';
import './App.css';
import DrawingZone from './components/DrawingZone';
import SettingsZone from './components/SettingsZone';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      sketchDetails: {
        "TOP": "",              // drawingModel (from reader)
        "LEFT": "",    // drawingAnimation (from reader)
        "RIGHT": 4,                // drawingAmount (from button)
        "BOTTOM": "",              // drawingColor (from button)
        drawingSize: 0.1,          // drawingSize (from a button?)
      },

      TokenDescriptions: {
        "TOP": {
          1: "bee", // in the future these will be able to be set to whatever via dropdown in reader settings
          2: "flower",
          3: "strawberry",
          4: "snail",
          5: "castle",
          6: "ant",
        },

        "LEFT": { 
          1: ["wiggleAround"],
          2: ["flock"],
          3: ["bonkAround"],
        },

        // if only 2 readers, this will be on the app
        "RIGHT": { // and a cycle of removing when new ones are added once at max
          1: ["few"],     // 5
          2: ["some"],    // 11
          3: ["many"],    // 16
          4: ["tooMany"], // 20 
        },

        // if only 2 readers, this will be on the app
        "BOTTOM": { 
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
      },
      
      //to-do: this is the same as sketch details except when it's empty so... yeah
      readerLabels: {
        "TOP": "Empty",
        "LEFT": "Empty",
        "RIGHT": "Empty",
        "BOTTOM": "Empty",  
      }
    }
  }

  updateSketchDetails = (messageWord, messageNumber) => {
    let updatedSketchDetails = this.state.sketchDetails;
    updatedSketchDetails[messageWord] = this.state.TokenDescriptions[messageWord][messageNumber];
    // to-do: again, sketchdetails is the same as reader labels...need to get rid of it i think
    let updatedReaderLabels = this.state.readerLabels;
    updatedReaderLabels[messageWord] = updatedSketchDetails[messageWord];
    this.setState({
      sketchDetails: updatedSketchDetails,
      readerLabels: updatedReaderLabels,
    })
  }

  onReaderMessage = (message) => {
    const lettersRegex = /(\D+)/
    const numbersRegex = /(\d+)/

    const messageWordMatch = message.match(lettersRegex);
    const messageNumberMatch = message.match(numbersRegex);

    console.log('onReaderMessage message contents (from App): ', message);

    if (messageWordMatch && messageNumberMatch) {
      const messageWord = messageWordMatch[0];
      const messageNumber = messageNumberMatch[0];

      if (this.state.TokenDescriptions[messageWord]) {
        if (this.state.TokenDescriptions[messageWord][messageNumber]) { // I'm saying if the message has a number that corresponds to a number in this reader's state description, set the sketch details and top reader label to that,
          this.updateSketchDetails(messageWord, messageNumber);
        }
        else {
          // correct word but incorrect number, so change readerlabel[top] to "invalid token"
          console.log('invalid token number for reader: ', messageWord);
          console.log('token number:', messageNumber);
          let updatedReaderLabels = this.state.readerLabels;
          updatedReaderLabels[messageWord] = "Invalid Token";
          this.setState({
            readerLabels: updatedReaderLabels,
          })
        }  
      }
      else {
        console.log('inavlid message word: ', messageWord);
      }
    }
    else {
      console.log('bad message: ', message)
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
        <div className="settings-zone">
          <div className="readers-wrapper">
            <SettingsZone
              readerLabels={this.state.readerLabels}
            />
          </div>
        </div>
      </div>
    );
  }
}


export default App;
