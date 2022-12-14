import './App.css';
import React, {useState, useEffect} from 'react';
import MovieList from './components/movie-list';
import MovieDetails from './components/movie-details';
import MovieForm from './components/movie-form';
import { useCookies } from 'react-cookie';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilm } from '@fortawesome/free-solid-svg-icons';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { useFetch } from './hooks/useFetch';

function App() {

  const [movies, setMovies] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [editedMovie, setEditedMovie] = useState(null);
  const [token, setToken, deleteToken] = useCookies(['mr-token']); // domain-name
  const [data, loading, error] = useFetch();

  useEffect( ()=> {
    console.log("useEffect 2 triggered");
    setMovies(data);
  }, [data]);

  useEffect( () => {
    console.log("useEffect 1 triggered");
    if(!token['mr-token']) window.location.href = "/";
  }, [token])

  const loadMovie = movie => {
    setSelectedMovie(movie);
    setEditedMovie(null);
  }

  const editClicked = movie => {
    setEditedMovie(movie);
    setSelectedMovie(null);
  }

  const removeClicked = movie => {
    const newMovies = movies.filter( mov => mov.id !== movie.id);
    setMovies(newMovies);
  }
  
  const updateMovie = movie => {
    const newMovies  = movies.map( mov => {
      if (mov.id === movie.id) {
        return movie;
      }
      return mov;
    })
    setMovies(newMovies);
  }

  const newMovie = () => {
    setEditedMovie(null);
    setEditedMovie({title: '', description: ''});
    setSelectedMovie(null);
  }

  const movieCreated = movie => {
    const newMovies = [...movies, movie];
    setMovies(newMovies);
  }

  const logoutUser = () => {
    deleteToken(['mr-token']);
  }

  if (loading) return <h1>Loading...</h1>
  if (error) return <h1>Error...</h1>
  return (
    <div className="App">
      <header className="App-header">
        <h1>
          <FontAwesomeIcon icon={faFilm}/>
          <span> Movie rater</span>
        </h1>
        <FontAwesomeIcon icon={faSignOutAlt} onClick={logoutUser}/>
      </header>
        <div className="layout">
          <div>
            <MovieList movies={movies} movieClicked={loadMovie} editClicked={editClicked} removeClicked={removeClicked}/>
            <button onClick={newMovie}>New Movie</button>
          </div>
          
          <MovieDetails movie={selectedMovie} updateMovie={loadMovie}/>
          { editedMovie ? 
            <MovieForm movie={editedMovie} updateMovie={updateMovie} createdMovie={movieCreated}/> : null}
        </div>
    </div>
  );
}

export default App;
