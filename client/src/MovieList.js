import React from 'react';


function MovieList(props) {

  return (
    <ul className="MovieList">
    {props.movies.map((movie, index) => 
      <li key={props.status + index} >
        <h4>{props.capitalize(movie.title)}</h4>
        <p>Rating: {movie.rating}/10</p>
        <h5 className="cost">${movie.cost}.00</h5>
        {props.status === 'owned' ? <h6>Watched: {movie.watched === true ? 'YES' : 'NO'}</h6> : null}
      </li>
    )}
    </ul>
  );
}


export default MovieList;
