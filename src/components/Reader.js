import React from 'react';
import './Reader.css'
import Select from 'react-select';

const Reader = (props) => {

  const { position, label, dropDownOptions, onDropDownSelection, controllerOf, onSettingsButtonClick} = props;

  const valuesLabels = Object.keys(dropDownOptions).map(function(optionNumber, index){
    return {val: String(optionNumber), label: String(dropDownOptions[optionNumber])};
  });


  const selectionDropdown = 
    <Select
      className="selectionDropdown"
      classNamePrefix="selector"
      name={controllerOf}
      value={{val: label, label: label}}
      // value={label}
      options={valuesLabels}
      onChange={(value) => onDropDownSelection(String(value.val))} 
      isSearchable={false}
    /> 

  return (
    <div className={`reader ${position}`}>
      <span>
        {controllerOf}
        {String(position) === "TOP" ? <button onClick={onSettingsButtonClick}>settings</button> : ""}
        {/* uncomment selection Dropdown to display dropdowns instead of using readers */}
        {selectionDropdown}
      </span>
    </div>
  )
}

export default Reader;

