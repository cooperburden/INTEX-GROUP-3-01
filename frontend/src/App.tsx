
import './App.css'
import MovieList from './components/MovieList'
import AdminPage from './pages/AdminPage'
import {BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {

  return (
    <>
    <Router>
      <Routes>
        <Route path='/' element={<MovieList />} />
        <Route path='/admin' element={<AdminPage />} />
      </Routes>
    </Router>
    </>
  )
}

export default App
