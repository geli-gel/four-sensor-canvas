import React from 'react';
import P5Wrapper from 'react-p5-wrapper';
import sketch from "../sketch";
import './DrawingZone.css'



const DrawingZone = ({canvasWidth, canvasHeight, sketchDetails, onReaderMessage}) => {
  // to-do: add propTypes for shape of sketchDetails?
  return (
    <div className="drawing-zone" >
      <P5Wrapper 
        sketch={sketch} 
        canvasWidth={canvasWidth}
        canvasHeight={canvasHeight}
        modelName={sketchDetails["TOP"]}
        drawingAnimation={sketchDetails["LEFT"]}
        drawingAmount={sketchDetails["RIGHT"]}
        drawingColor={sketchDetails["BOTTOM"]}
        drawingSize={sketchDetails.drawingSize}
        sendMessageToApp={onReaderMessage}
      />
    </div>
  )
}


export default DrawingZone;
