// react popup class example from https://codepen.io/bastianalbers/pen/PWBYvz
import React from 'react';
import './Popup.css'

class Popup extends React.Component {
  
  render() {
    return (
      <div className='popup'>
        <div className='popup_inner'>
          <h1>{this.props.text}</h1>
        <button onClick={this.props.closePopup}>close me</button>
        </div>
      </div>
    );
  }
}

export default Popup;

