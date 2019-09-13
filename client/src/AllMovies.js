import React from 'react';
import MovieList from './MovieList';


function AllMovies(props) {

  return (
    <div className="AllMovies tab-content">
      <h1>All Movies</h1>
    {props.allMovies.map((group, index) => 
      <div>
        <h2>{props.capitalize(group.genre)}</h2>
        <MovieList key={index} movies={group.movies} capitalize={props.capitalize} status="available" />
      </div>
    )}
    </div>
  );
}


export default AllMovies;
