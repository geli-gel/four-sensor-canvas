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
        drawingModel: "bee",
        drawingSize: "",
        drawingAmount: 4,
        drawingColor: "",
        drawingAnimation: "",
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
        top: "cat",
        left: "Empty",
        right: "Empty",
        bottom: "Empty",  
      }
    }
  }

  onReaderMessage(message) {
    // when a message comes in..
    // to-do: add the serial listener for arduin
    // on 'data' change state that will cause App to rerender
    // this is where a lot of logic will be - for determining what the sketchDetails are depending on what messages come from arduino
    // ex:
    // message: "TOP1"
    // logic: if regex(letters) = TOP 
    //          if topTokenDescriptions[regex(numbers)] exists, setState drawingModel, readerLabel[top]: topTokensDesc[regex(numbers)]
    //          else (if no numbers (means it's "wrong"))
    //          drawingModel changes to nothing
    //          readerLabel[top]: changes to "Invalid Token"
    const lettersRegex = /(\D+)/
    const numbersRegex = /(\d+)/

    const messageWord = message.match(lettersRegex)[0];
    const messageNumber = message.match(numbersRegex)[0];
    console.log('onReaderMessage message contents (from App): ', message);
    console.log('messageWord: ', messageWord);
    console.log('messageNumber: ', messageNumber);

    switch(messageWord) {
      case "TOP":
        if (this.state.topTokenDescriptions[messageNumber]) { // I'm saying if the message has a number, set the sketch details and top reader label to that,
          let updatedSketchDetails = this.state.sketchDetails;
          updatedSketchDetails.drawingModel = this.state.topTokenDescriptions[messageNumber];

          let updatedReaderLabels = this.state.readerLabels;
          updatedReaderLabels.top = updatedSketchDetails.drawingModel;
          this.setState({
            sketchDetails: updatedSketchDetails,
            readerLabels: updatedReaderLabels,
          })
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

    return (
      <div className="App">
        <DrawingZone
          canvasWidth={600}
          canvasHeight={400}
          sketchDetails={this.state.sketchDetails}
          onReaderMessage={this.onReaderMessage}
        />
        {/* Weird P5Wrapper */}
        {/* <P5Wrapper sketch={sketch}  /> */}

        <SettingsZone
          readerLabels={this.state.readerLabels}
        />


      </div>
    );
  }
}


export default App;
