import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Header from './components/Header';
import Home from './components/Home';
import Login from './components/Login';
import MainScreen from './components/MainScreen.jsx';
import Error from './components/Error';
import { Routes, Route } from 'react-router-dom'
function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/dashboard' element={<MainScreen />} />
        <Route path='*' element={<Error />} />
      </Routes>
    </>
  );
}

export default App;