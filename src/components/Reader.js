import React from 'react';
import './Reader.css'

const Reader = (props) => {

  const { position, label, imageUrl } = props;

  return (
    <div className={`reader-${position}`}>
      {/* to-do: add CSS to positon card based on position, and give it the diamond shape! */}
      <section className="reader-label">
        {label}
      </section>
      <img class="card-img-top img-fluid" src={imageUrl} alt={label} />

      {/* to-do: add  */}
    </div>
  )
}

export default Reader;

