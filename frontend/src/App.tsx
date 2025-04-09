
import './App.css'
import MovieList from './components/MovieList'
import AdminPage from './pages/AdminPage'
import Account from './pages/Account'
import CreateAccount from './pages/CreateAccount'
import Login from './pages/Login'
import Home from './pages/Home'
import MovieDetails from './pages/MovieDetails'
import Privacy from './pages/Privacy'
import Search from './pages/Search'
import {BrowserRouter as Router, Routes, Route } from 'react-router-dom';




function App() {

  return (
    <>
    <Router>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/movieList' element={<MovieList />} />
        <Route path='/admin' element={<AdminPage />} />
        <Route path='/account' element={<Account />} />
        <Route path='/createAccount' element={<CreateAccount />} />
        <Route path='/login' element={<Login />} />
        <Route path='/movieDetails' element={<MovieDetails />} />
        <Route path='/privacy' element={<Privacy />} />
        <Route path='/search' element={<Search />} />
        {<Route path='/login' element={<Login />} /> }
        
      </Routes>
    </Router>
    </>
  )
}

export default App;
