// I don't think I'm using this- I was previously confused about how the p5wrapper worked

import React from 'react';
import './Drawing.css'

const Drawing = (props) => {

  const { sketchDetails, size } = props;

  return (
    <div className={size}>
      <section className="reader-card-name">
        {name}
      </section>
      <img class="card-img-top img-fluid" src={imageUrl} alt="Drawing Image" />
      
      <section className="movie-card-body">
        {overview}
      </section>

      <button className="btn btn-primary" onClick={onButtonClick} >
        {buttonText}
      </button>
    </div>
  )
}

export default Drawing;

