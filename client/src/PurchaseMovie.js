import React, { useState, useEffect, useRef } from "react";
import './styles/Search.scss';


const SEARCH_DELAY = 500;

//Custom hook
const useMovieList = () => {
  const [movieList, setMovieList] = useState({
    data: null,
    loading: false,
    error: null
  });

  const getMovieList = (searchString, allMovies, myMovies, sortFunction) => {
    const availableAndOwned = [];
    
    const allMoviesArr = allMovies.map(function(genre) {
      return genre.movies;
    });

    const ownedMoviesArr = myMovies.map(function(genre) {
      return genre.movies;
    });

    // combine all arrays, sort and flatten 
    const searchPool = sortFunction(availableAndOwned.concat(ownedMoviesArr, allMoviesArr).flat(Infinity));

    setMovieList({ ...movieList, loading: true, error: null });

    const results = searchPool.filter(function(movie) {
      return movie.title.toLowerCase().match(new RegExp(searchString.toLowerCase()));
    })

    if (searchString.length > 2) {
      if (results.length === 0) {
        setMovieList({ ...movieList, loading: false, error: `No movies found matching '${searchString}'.` })      
      } else {
        setMovieList({ data: results, loading: false, error: null })
      }
    }

  };

  return { movieList, getMovieList };
};

//component
const PurchaseMovie = props => {
  const [searchString, setSearchString] = useState("");
  const [timer, setTimer] = useState(null);
  const { movieList, getMovieList } = useMovieList();
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [purchaseStatus, setPurchaseStatus] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const suggestionBox = useRef();

  const allMovies = props.allMovies;
  const myMovies = props.myMovies;


  useEffect(() => {
    document.addEventListener("click", handleOutSideClick);
    return () => document.removeEventListener("click", handleOutSideClick);
  }, []);

  const handleOutSideClick = e => {
    if (!suggestionBox.current.contains(e.target)) {
      setDropdownVisible(false);
    }
  };

  const handlePurchase = (title, cost) => {
    console.log(title, cost);

    setSelectedMovie(title);

    if (~JSON.stringify(myMovies).indexOf(title)) {
      console.log('already owned');
      setPurchaseStatus("owned");
    } else if (props.myAccount.balance < cost) {
      setPurchaseStatus("insufficient");
    } else {
      props.purchaseMovie(title, cost);
      setPurchaseStatus("purchased");
    }
  }

  const onTextChange = e => {
    const { value } = e.target;
    if (timer) clearTimeout(timer);
    const newTimer = setTimeout(() => {
      getMovieList(value, allMovies, myMovies, props.alphabeticalize);
    }, SEARCH_DELAY);
    setTimer(newTimer);
    setSearchString(value);
  };

  const charMatching = char => {
    return searchString.toLowerCase().includes(char.toLowerCase());
  };

  const renderPurchaseStatus = () => {
    let content;
    switch (purchaseStatus) {
      case "insufficient":
        content = `Not enough credit remaining to purchase ${props.capitalize(selectedMovie)}.`;
        break;
      
      case "purchased":
        content = `Purchased ${props.capitalize(selectedMovie)}!`;
        break;
      
      case "owned":
        content = `You have already purchased ${props.capitalize(selectedMovie)}.`;
        break;

      default:
        content = "";
    }

    return (
      <p className="purchase-status">{content}</p>
    );
  };

  const renderMovieList = () => {
    const { data, error, loading } = movieList;
    let content;

    if (loading) {
      content = (
        <div className="loading-wrap">
          <h5>Please type at least 3 characters. <i className="fa fa-spinner fa-spin" /></h5>
        </div>
      );
    } else if (error) {
      content = <h5>{error}</h5>;
    } else if (!data) {
      content = null;
    } else {
      content = data.map(movie => {
        const { title, rating, cost, watched } = movie;
        const capitalized = props.capitalize(title);
        const charArray = capitalized.split("");
        return (
          <div className="search-movie-info">
            <h5 key={title}>
              {charArray.map(c => (charMatching(c) ? <b>{c}</b> : c))}
            </h5>
            <div className="movie-stats">
              <div id="booger">
                <span>Rating: {rating}/10</span>
                <span>${cost}.00</span>
              </div>
              {watched === true || watched === false ? <h6>(Owned)</h6> : <h6 id="buy" onClick={() => handlePurchase(title, cost)}>BUY</h6>}
            </div>
          </div>
        );
      });
    }

    return (
      <div
        className={`search-with-highlight-movie-list ${
          dropdownVisible ? "" : "collapsed"
        }`}
      >
        {content}
      </div>
    );
  };

  return (
    <div className="search-with-highlight-container tab-content" ref={suggestionBox}>
      <input
        placeholder="Search"
        value={searchString}
        onChange={onTextChange}
        onFocus={() => setDropdownVisible(true)}
      />
      {renderPurchaseStatus()}
      {renderMovieList()}
    </div>
  );
};

export default PurchaseMovie;
