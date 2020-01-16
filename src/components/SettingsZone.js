import React, { Component } from 'react';
import Reader from './Reader';
import './SettingsZone.css'

const SettingsZone = ({readerLabels, readerOptions, onSettingChange}) => {
  
  const readers = Object.keys(readerLabels).map(function(readerPosition, index) {
    return (
      <Reader
        key={index}
        position={readerPosition}
        label={readerLabels[readerPosition]}
        dropDownOptions={readerOptions[readerPosition]}
        onDropDownSelection={(selection) => onSettingChange(readerPosition, selection)}
      />
    )
  });

  return (
    <div className="all-readers">
      {readers}
    </div>
  )
}


export default SettingsZone;
