import React, { Component } from 'react';
import './App.css';
import DrawingZone from './components/DrawingZone';
import SettingsZone from './components/SettingsZone';
import Popup from './components/Popup';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showPopup: false,
      chosenReader: "",

      sketchDetails: {
        // to-do: SET TO ""
        "TOP": "bee",   
        // to-do: SET TO ""           // drawingModel (from reader) 
        "LEFT": "wiggleAround",    // drawingAnimation (from reader)
        "RIGHT": "few",                // drawingAmount (from button) // works better w/ a default :)
        "BOTTOM": "",              // drawingColor (from button)
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
          1: "wiggleAround",
          2: "flock",
          3: "infiniteFall",
          4: "noMovement",
        },

        // if only 2 readers, this will be on the app
        "RIGHT": { // and a cycle of removing when new ones are added once at max
          1: "few",     // 7
          2: "some",    // 11
          3: "many",    // 16
          4: "tooMany", // 21 
        },

        // if only 2 readers, this will be on the app
        "BOTTOM": { 
          1: "crimson", // it would be cool if when you change the token, new ones pop up in that color and slowly replace the old color (so drawings have lifetimes)
          2: "orange",
          3: "gold",
          4: "lawngreen",
          5: "mediumblue",
          6: "darkviolet",
          7: "cyan",
          8: "magenta",
          9: "black",
          10: "rainbow", // either each drawing is a random color, or better, each stroke of each drawing is a random color
          11: "white", 
          12: "aquamarine", // to-do: need to add a 12th option to the arduino code
        },
      },

      otherOptions: {
        "TOP": [
          "alarm_clock",
          "barn",
          "bear",
          "bicycle",
          "bird",
          "book",
          "bus",
          "butterfly",
          "cactus",
          "cat",
          "dog",
          "dolphin",
          "duck",
          "elephant",
          "eye",
          "hand",
          "key",
          "map",
          "octopus",
          "owl",
          "palm_tree",
          "parrot",
          "penguin",
          "pig",
          "radio",
          "rain",
          "scorpion",
          "sheep",
          "snowflake",
          "spider",
          "squirrel",
          "swan",
          "tiger",
          "whale",
          "windmill",
          "yoga",
          "everything",
        ]
      },
      
      //to-do: this is the same as sketch details except when it's empty so... yeah
      readerLabels: {
        "TOP": "empty",
        "LEFT": "empty",
        "RIGHT": "few",
        "BOTTOM": "empty",  
      }
    }
  }

  updateSketchDetails = (messageWord, messageNumber) => {
    // console.log('in App')
    // console.log('messageWord: ', messageWord)
    // console.log('messageNumber: ', messageNumber)
    // console.log('typeof messageWord: ', typeof messageWord)
    // console.log('typeof messageNumber: ', typeof messageNumber)
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


  togglePopup = (readerPosition) => {
    this.setState({
      showPopup: !this.state.showPopup,
      chosenReader: readerPosition,
    });
    console.log('toggled popup')
  }

  updateTokenDescriptions = (reader, newSettings) => {
    let updatedTokenDescriptions = this.state.TokenDescriptions;
    updatedTokenDescriptions[reader] = newSettings
    this.setState({
      TokenDescriptions: updatedTokenDescriptions,
    })
  }


  render() {

    console.log('rendering, state: ', this.state);

    return (
      <div className="App">
        <DrawingZone className="drawing-zone"
          canvasWidth={600}
          canvasHeight={400}
          sketchDetails={this.state.sketchDetails}
          onReaderMessage={this.onReaderMessage}
        />
        <div className="settings-zone">
          <div className="readers-wrapper">
            <SettingsZone
              readerLabels={this.state.readerLabels}
              readerOptions={this.state.TokenDescriptions}
              onSettingChange={this.updateSketchDetails}
              togglePopup={this.togglePopup}
            />
          </div>
        </div>

        {this.state.showPopup ? 
          <Popup
            text={`edit controls for ${this.state.chosenReader.toLowerCase()} polygon`}
            closePopup={this.togglePopup.bind(this)} // i don't think it needs the bind part
            // closePopup={this.togglePopup}
            // display a form with current reader settings
            chosenReader={this.state.chosenReader}
            currentSettings={this.state.TokenDescriptions[this.state.chosenReader]}
            // dropdowns for each one
            otherOptions={this.state.otherOptions[this.state.chosenReader]}
            // a button that sets state for the new settings from the form
            updateTokenDescriptions={(newSettings) => this.updateTokenDescriptions(this.state.chosenReader, newSettings)}
          />
          : null
        }

      </div>
    );
  }
}


export default App;
