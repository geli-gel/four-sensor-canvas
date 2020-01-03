import React, { Component } from 'react';
import Reader from './Reader';
import './SettingsZone.css'

const SettingsZone = ({readerLabels}) => {
  // to-do: make the readers take in props of reader info (position, label)
  
  const readers = Object.keys(readerLabels).map(function(readerPosition, index) {
    return (
      <Reader
        key={index}
        position={readerPosition}
        label={readerLabels[readerPosition]}
        // to-do: add settings prop
        // onButtonClick={ () => onReaderButtonClick(reader)}
      />
    )
  });

  return (
    <div className="settings-zone" >
      {readers}
    </div>
  )
}


export default SettingsZone;
