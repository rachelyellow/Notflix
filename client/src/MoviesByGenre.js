import React, { useState } from 'react';
import MovieList from './MovieList';


function MoviesByGenre({ allMovies, capitalize }) {

  const [genre, setGenre] = useState(null);
  const [movies, setMovies] = useState(null);

  const chooseGenre = (genre, movies) => {
    setGenre(genre);
    setMovies(movies);
  }

  const handleClick = e => {
    e.preventDefault();
    setGenre(null);
    setMovies(null);
  }

  if (genre === null) {
    return (
      <div className="MoviesByGenre tab-content">
        <h1>Movies By Genre</h1>
        {allMovies.map((group, index) => 
        <div className="genre" key={index} onClick={() => chooseGenre(group.genre, group.movies)} >
          <h2>{capitalize(group.genre)}</h2>
        </div>
        )}
      </div>
    );
  } else {
    return (
      <div className="MoviesByGenre tab-content">
        <div>
          <button id="back-button" onClick={(e) => handleClick(e)} >{'< '}GENRES</button>
          <h1>{capitalize(genre)} Movies</h1>
          <MovieList movies={movies} capitalize={capitalize} status="available" />
        </div>
      </div>
    );
  }
}


export default MoviesByGenre;
