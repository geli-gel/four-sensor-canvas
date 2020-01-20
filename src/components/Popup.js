// react popup class example from https://codepen.io/bastianalbers/pen/PWBYvz
import React from 'react';
import './Popup.css'
import Select from 'react-select';


class Popup extends React.Component {

  // https://medium.com/@agoiabeladeyemi/the-complete-guide-to-forms-in-react-d2ba93f32825
  
  constructor(props) {
    super(props);
    this.state = {
      formControls: props.currentSettings,
    } 
    console.log('props.currentSettings: ', props.currentSettings);
    console.log('popup state: ', this.state);
    }
    

  changeHandler = event => { 
    console.log('change handler, event: ', event);
    const name = event.name;
    const value = event.value;
  
    this.setState({
      formControls: {
        ...this.state.formControls,
        [name]: value
      }
    });
  }
  // const readers = Object.keys(readerLabels).map(function(readerPosition, index) {

  allOptions = this.props.otherOptions.map(function(option) {
    return (
      {val: option, label: option}
    )
  })

  handleSubmit = (event) => {
    event.preventDefault();
    //callback
    this.props.updateTokenDescriptions(this.state.formControls);
    //other callback
    this.props.closePopup();
  } 


  
  render() {
    console.log('allOptions: ', this.allOptions)

    const selectDropdowns = Object.keys(this.props.currentSettings).map((optionNumber, index) => {
      return (
        <Select
          key={index}
          className="selectionDropdown"
          name={optionNumber}
          defaultValue={this.props.currentSettings[optionNumber]}
          value={{value: this.state.formControls[optionNumber], label: this.state.formControls[optionNumber]}}
          onChange={(value) => this.changeHandler({name: optionNumber, value: String(value.label)})}
          options={this.allOptions}
        /> 
      )
    })

    console.log('popup is rendered. this: ', this)
    return (
      <div className='popup'>
        <div className='popup_inner'>
          <h1>{this.props.text}</h1>
          <form
          name="change-token-settings"
          id="change-token-settings"
          onSubmit={this.handleSubmit}
          >
            {selectDropdowns}
          <input type="submit"></input>
          </form>
          <button onClick={this.props.closePopup}>cancel</button>

        </div>
      </div>
    );
  }
}

export default Popup;

