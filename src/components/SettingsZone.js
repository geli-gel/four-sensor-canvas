import React from 'react';
import Reader from './Reader';
import './SettingsZone.css'

const SettingsZone = ({readerLabels, readerOptions, onSettingChange, togglePopup}) => {

  const controls = ["model","movement","amount","color"]

  const readers = Object.keys(readerLabels).map(function(readerPosition, index) {
    return (
      <Reader
        key={index}
        position={readerPosition}
        label={readerLabels[readerPosition]}
        controllerOf={controls[index]}
        dropDownOptions={readerOptions[readerPosition]}
        onDropDownSelection={(selection) => onSettingChange(readerPosition, selection)} // for readers
        onSettingsButtonClick={() => togglePopup(readerPosition)}
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
