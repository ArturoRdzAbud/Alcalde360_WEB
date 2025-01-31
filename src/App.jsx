import React from 'react';
import './App.css'

import { BrowserRouter, Link, NavLink, Route, Routes, useNavigate } from 'react-router-dom'

import { SideBar } from './components/SideBar';
import 'bootstrap-icons/font/bootstrap-icons.css';  // Asegúrate de importar el CSS

// import CatTiposDeSancion from './components/CatTiposDeSancion';

function App() {
  return (
    <>


      <div className="App" id="outer-container">
      
        <SideBar pageWrapId={'page-wrap'} outerContainerId={'outer-container'} />
        {/* <h1>&nbsp;</h1> */}
        
        
        <div id="page-wrap">
          {/* <h1>Cool Restaurant</h1>
        <h2>Check out our offerings in the sidebar!</h2> */}
        </div>
      </div>


    </>
  )
}

export default App
