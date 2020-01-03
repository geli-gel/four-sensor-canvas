import React from 'react';
import P5Wrapper from 'react-p5-wrapper';
import sketch from "../sketch";


const DrawingZone = ({canvasWidth, canvasHeight, sketchDetails}) => {
  // to-do: add propTypes for shape of sketchDetails?
  return (
    <div className="drawing-zone" >
      <P5Wrapper 
        sketch={sketch} 
        canvasWidth={canvasWidth}
        canvasHeight={canvasHeight}
        // modelName={sketchDetails.drawingModel}
        modelName="cat"
      />.
    </div>
  )
}


export default DrawingZone;
