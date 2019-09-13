import React from 'react';
import MovieList from './MovieList';


function MyMovies({ myMovies, capitalize }) {

  return (
    <div className="MyMovies tab-content">
      <h1>My Movies</h1>
      {myMovies.map((group, index) => 
      <div>
        <h2>{capitalize(group.genre)}</h2>
        <MovieList key={"owned" + index} movies={group.movies} capitalize={capitalize} status="owned" />
      </div>
    )}
    </div>
  );
}

export default MyMovies;
