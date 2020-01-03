import React from 'react';
import './Reader.css'

const Reader = (props) => {

  const { position, name, currentToken, imageUrl } = props;

  return (
    <div className={`reader-card ${position}`}>
      <section className="reader-card-name">
        {name}
      </section>
      <img class="card-img-top img-fluid" src={imageUrl} alt="Reader Image" />
      
      <section className="movie-card-body">
        {overview}
      </section>

      <button className="btn btn-primary" onClick={onButtonClick} >
        {buttonText}
      </button>
    </div>
  )
}

export default Reader;

