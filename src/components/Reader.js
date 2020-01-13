import React from 'react';
import './Reader.css'

const Reader = (props) => {

  const { position, label } = props;

  return (
    <div className={`reader ${position}`}>
      <span>
        {position}     {label}
        {/* <img class="card-img-top img-fluid" src={imageUrl} alt={label} /> */}
        {/* to-do: add lots of stuff for token settings */}
      </span>
    </div>
  )
}

export default Reader;

