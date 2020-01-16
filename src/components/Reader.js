import React from 'react';
import './Reader.css'
import Select from 'react-select';

const Reader = (props) => {

  const { position, label, dropDownOptions, onDropDownSelection} = props;

  // const readers = Object.keys(readerLabels).map(function(readerPosition, index) {

  const valuesLabels = Object.keys(dropDownOptions).map(function(optionNumber, index){
    return {val: String(optionNumber), label: String(dropDownOptions[optionNumber])};
  });

  const selectionDropdown = (position === "RIGHT" || position === "BOTTOM") ? 
    <Select
      value={label}
      options={valuesLabels}
      onChange={(value) => onDropDownSelection(String(value.val))} 
    /> 
  : ""


  return (
    <div className={`reader ${position}`}>
      <span>
        {position}     {label}
        {selectionDropdown}
      </span>
    </div>
  )
}

export default Reader;

