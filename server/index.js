"use strict";

const express = require('express');
const app = express();

const PORT = 5000;

const fs = require('fs');

// all available movies
const allMovies = require("./data-files/available_movies");

// all movie genres
const allGenres = Object.keys(allMovies);

// path to my movies json file
const myMovies =  require("./data-files/my_movies.json");

// path to user account info
const myAccount =  require("./data-files/my_account.json");

app.use(express.json());


// Add headers
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});



// get routes

app.get('/movies', (req, res) => {
  res.status(200).send(allMovies);
});

app.get('/mymovies', (req, res) => {
  res.status(200).send(myMovies);
});

app.get('/myaccount', (req, res) => {
  res.status(200).send(myAccount);
});


// genre routes for larger data sets (not currently used in app)

app.get('movies/genres', (req, res) => {
  res.status(200).send(allGenres);
});

app.get('movies/action', (req, res) => {
  res.status(200).send(allMovies.action);
});

app.get('movies/comedy', (req, res) => {
  res.status(200).send(allMovies.comedy);
});

app.get('movies/documentary', (req, res) => {
  res.status(200).send(allMovies.documentary);
});

app.get('movies/drama', (req, res) => {
  res.status(200).send(allMovies.drama);
});

app.get('movies/horror', (req, res) => {
  res.status(200).send(allMovies.horror);
});

app.get('movies/scifi', (req, res) => {
  res.status(200).send(allMovies.scifi);
});

app.get('movies/thriller', (req, res) => {
  res.status(200).send(allMovies.thriller);
});


// post routes

app.post('/purchase', (req, res) => {

  // use title to find the movie object
  const findMovie = function(title) {
    let returnObj = {};
    for (let [key, value] of Object.entries(allMovies)) {
      value.forEach(movie => {
        if (movie.title === title) {
          returnObj.genre = key;
          returnObj.movieObj = movie;
          return;
        }
      });
    };
    return returnObj;
  };

  // extract genre and movie cost, rating to add to purchased movie list
  const { movieObj, genre } = findMovie(req.body.title);

  // create new object to add into my_movies.json with 'watched' property
  let newMovieObj = {
    ...movieObj,
    watched: false
  };

  // make copy of current movies in my_movies list
  let updatedMyMovies = {
    ...myMovies
  }

  // add new movie to copied list
  if (genre in updatedMyMovies) {
    updatedMyMovies[genre] = [...updatedMyMovies[genre], newMovieObj];
  } else {
    updatedMyMovies[genre] = [newMovieObj];
  }
  
  fs.writeFile('./data-files/my_movies.json', JSON.stringify(updatedMyMovies, null, '  '), err => {
    if (err) throw err;
  });


  // copy account info and update the balance to reflect changes after purchase
  const updatedAccountInfo = [{
    ...myAccount[0],
    balance: myAccount[0].balance - req.body.cost
  }];

  fs.writeFile('./data-files/my_account.json', JSON.stringify(updatedAccountInfo, null, '  '), err => {
    if (err) throw err;
  });


  res.status(200).send({ myAccount: updatedAccountInfo, myMovies: updatedMyMovies });
})



app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`);
});