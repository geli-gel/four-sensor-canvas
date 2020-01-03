import React, { Component } from 'react';
import Reader from './Reader';

const SettingsZone = (props) => {
  // to-do: make the readers take in props of reader info (position, label)
  // const readers = props.readers.map((reader) => {
  //   return (
  //     <Reader 
  //       key={reader.id}
  //       position={reader.position}
  //       label={reader.tokenRead}
  //       imageUrl={reader.imageUrl}
  //       // to-do: add settings prop
  //       // onButtonClick={ () => onReaderButtonClick(reader)}
  //     />
  //   )
  // })

  return (
    <div className="settingsZone" >
      {/* {readers} */}
    </div>
  )
}


export default SettingsZone;
