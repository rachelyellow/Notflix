import React, { useState, useEffect } from 'react';
import MainMenu from './MainMenu';
import AllMovies from './AllMovies';
import MoviesByGenre from './MoviesByGenre';
import MyMovies from './MyMovies';
import CreditBalance from './CreditBalance';
import PurchaseMovie from './PurchaseMovie';
import BackButton from './BackButton';
import axios from 'axios';
import './styles/App.scss';


function App() {

  // status of app determines which section to show
  const [action, setAction] = useState(null);

  // movie lists
  const [allMovies, setAllMovies] = useState({});
  const [myMovies, setMyMovies] = useState(null);
  const [myAccount, setMyAccount] = useState({});

    
  useEffect(() => {

    axios.all([
      axios.get('http://localhost:5000/movies'),
      axios.get('http://localhost:5000/mymovies'),
      axios.get('http://localhost:5000/myaccount')
    ]).then(axios.spread(function(allmovies, mymovies, myaccount) {
      
      const allMoviesByGenre = sortMovies(allmovies.data);
      setAllMovies(allMoviesByGenre);

      // convert my_movies data to array form
      const myMoviesByGenre = sortMovies(mymovies.data);
      setMyMovies(myMoviesByGenre);

      // get account info [already in array form]
      const accountInfo = myaccount.data[0];
      setMyAccount(accountInfo);

    }));

  }, []);

  // sort the movies array by alphabetical order
  const alphabeticalize = function(arr) {

    const compare = function(a, b) {
      let aTitle = a.title.toLowerCase(),
          bTitle = b.title.toLowerCase();
          
      aTitle = removeArticles(aTitle);
      bTitle = removeArticles(bTitle);
      
      if (aTitle > bTitle) return 1;
      if (aTitle < bTitle) return -1; 
      return 0;
    };

    function removeArticles(str) {
      let words = str.split(" ");
      if(words.length <= 1) return str;
      if( words[0] === 'a' || words[0] === 'the' || words[0] === 'an' )
        return words.splice(1).join(" ");
      return str;
    }

    const sortedMovies = arr.sort(compare);

    return sortedMovies;

  };

  // capitalizes data when rendering. it's important not to mutate the data set
  const capitalize = function(str) {
    return str.replace(
        /\w\S*/g,
        function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }
    );
  }

  const chooseAction = (action) => {
    setAction(action);
  }

  const purchaseMovie = function(title, cost) {
    console.log(`I wish to purchase ${title} for ${cost} dollars.`);
    axios.post('http://localhost:5000/purchase', {
      title: title,
      cost: cost
    })
    .then(function (response) {
      console.log(response.data);
      setMyMovies(sortMovies(response.data.myMovies));
      setMyAccount(response.data.myAccount);
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  const sortMovies = (movies) => {
    // get all available movies and genres
    const allMovies = movies;
    const allGenres = Object.keys(allMovies);

    // convert data to array form
    const moviesByGenre = [];
    allGenres.forEach(function(genre) {
      moviesByGenre.push({
        genre: genre,
        movies: alphabeticalize(allMovies[genre])
      });
    });

    return moviesByGenre;
  }


  return (
    <div className="App">
      <header>
        <h1 id="notflix-title">NƟTFLIX</h1>
        {action !== null && <BackButton chooseAction={chooseAction} />}
      </header>

      <div className="page-content">
        {action === null && <MainMenu chooseAction={chooseAction} capitalize={capitalize} />}
        {action === "list all movies" && <AllMovies allMovies={allMovies} capitalize={capitalize}/>}
        {action === "movies by genre" && <MoviesByGenre allMovies={allMovies} capitalize={capitalize}/>}
        {action === "my movies" && <MyMovies myMovies={myMovies} capitalize={capitalize} />}
        {action === "check credit" && <CreditBalance myAccount={myAccount} />}
        {action === "purchase" && <PurchaseMovie allMovies={allMovies} myMovies={myMovies} alphabeticalize={alphabeticalize} capitalize={capitalize} purchaseMovie={purchaseMovie} myAccount={myAccount} />}
      </div>

    </div>
  );
}

// ΘƟØ0

export default App;
