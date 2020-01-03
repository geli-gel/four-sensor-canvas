import React, { Component } from 'react';
import Reader from './Reader';

const SettingsZone = ({movies, buttonText, tokenRead}) => {
  const readers = readers.map((reader) => {
    return (
      <Reader 
        key={reader.id}
        position={reader.position}
        name={reader.name}
        currentToken={reader.tokenRead}
        imageUrl={reader.imageUrl}
        // onButtonClick={ () => onReaderButtonClick(reader)}
      />
    )
  })

  return (
    <div className="settingsZone" >
      {readers}
    </div>
  )
}


export default SettingsZone;
