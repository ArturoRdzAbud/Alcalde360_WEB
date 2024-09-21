import React, { useRef, useState, useContext } from 'react';
import { slide as Menu } from 'react-burger-menu';
import '../css/Sidebar.css';

import { BrowserRouter, Link, NavLink, Route, Routes, useNavigate } from 'react-router-dom'
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


import { PerfilContext } from './PerfilContext'; // Importa el contexto

//pantallas
import Home from './Home';
import Login from './Login';

import FrmArbitro from './FrmArbitro';
import FrmUsuario from './FrmUsuario';
import FrmConsultaIncidencia from './FrmConsultaIncidencia';
import FrmPrueba from './FrmPrueba';
import FrmEncuesta from './FrmEncuesta';

import ProtectedRoute from './ProtectedRoute';
import AccessDeniedPage from './AccessDeniedPage';



//Iconos
import HomeSvg from '../svg/icon-home.svg?react'
import Arbitrosvg from '../svg/arbitro.svg?react'
import Arbitros2vg from '../svg/arbitro.svg?react'
import UsuarioSvg from '../svg/usuario.svg?react'
import IconFlagvg from '../svg/icon-flag.svg?react'



// export default props => {
export const SideBar = () => {
    const { perfil, esConLicencia } = useContext(PerfilContext);

    // const menuRef = useRef(null); // Create a ref

    const [isOpen, setOpen] = useState(false)
    const handleIsOpen = () => {
        setOpen(!isOpen)
    }
    const closeMenu = () => {
        // Close the menu programmatically
        // You can access the menu instance using ref
        // For example, if you have a ref like `menuRef`
        // menuRef.current.closeMenu();
        setOpen(false)
    };



    const [isAdminOpen, setIsAdminOpen] = useState(false);
    const toggleAdmin = () => {
        setIsAdminOpen(!isAdminOpen);
    };
    const [isAccesosOpen, setIsAccesosOpen] = useState(false);
    const [isEncuestaOpen, setIsEncuestaOpen] = useState(false);
    const toggleAccesos = () => {
        setIsAccesosOpen(!isAccesosOpen);
    };
    const toggleEncuesta = () => {
        setIsEncuestaOpen(!isEncuestaOpen);
    };
    // const toggleMenu = (setState,stateValue) => {
    //     setState(!stateValue);
    // };
    const fontsize = {
        fontSize: '14px' // Puedes ajustar este valor al tamaño que desees
    };
    const fontsizeH = {
        fontSize: '18px', // Puedes ajustar este valor al tamaño que desees
        cursor: 'pointer',
    };
    // Estilos para la línea separadora
    const separatorStyles = {
        width: '100%',
        height: '1px',
        backgroundColor: '#ccc', // Color de la línea
        margin: '10px 0' // Espaciado alrededor de la línea
    };


    return (

        <>


            {/*  


        //npm install react-burger-menu@2.7.1 --force
        //npm install axios
        //npm install react-router-dom
        //npm install @tanstack/react-table
        //npm install --save-dev vite-plugin-svgr
        //20240312 npm install react-beautiful-dnd //https://medium.com/@wbern/getting-react-18s-strict-mode-to-work-with-react-beautiful-dnd-47bc909348e4
            //para que funcione en desarrollo comentar el strictmode en el archivo main.jsx
        //20240408 npm install react-bootstrap bootstrap
            // para que funcionene los modales bootstrap en react

        https://app.netlify.com/
        https://www.digitalocean.com/community/tutorials/react-react-burger-menu-sidebar  
        https://www.npmjs.com/package/react-burger-menu   
        https://tanstack.com/table/latest/docs/introduction
        https://iconsvg.xyz/
        https://www.svgviewer.dev/
        https://picsvg.com/


                https://github.com/azouaoui-med/react-pro-sidebar/blob/master/storybook/Playground.tsx
                https://azouaoui-med.github.io/react-pro-sidebar/iframe.html?id=playground--playground&args=&viewMode=story
                https://www.geeksforgeeks.org/how-to-create-a-responsive-sidebar-with-dropdown-menu-in-reactjs/

        SVG:
        https://www.freeconvert.com/es/svg-converter

        Iconos:
        https://favicon.io/favicon-converter/

        Login:
        https://mdbootstrap.com/docs/standard/extended/login/


      <a className="menu-item" href="/">
        Home
      </a>
      <a className="menu-item" href="/salads">
        Salads
      </a>
      <a className="menu-item" href="/pizzas">
        Pizzas
      </a>
      <a className="menu-item" href="/desserts">
        Desserts
      </a> */}

            <BrowserRouter>

                <Menu isOpen={isOpen}
                    onOpen={handleIsOpen}
                    onClose={handleIsOpen}>
                    <ul className='navbar-nav'>
                        <li className="nav-item">
                            {/*Configuración inicial*/}
                            <NavLink onClick={closeMenu} to='/' className='nav-link' > <HomeSvg />{''} </NavLink>
                            {/* <NavLink onClick={closeMenu} to='/Login' className='nav-link' > <HomeSvg />{' Login '} </NavLink> */}
                            <div style={separatorStyles}></div> {/* Línea de separación */}

                            <div className="menu-section">
                                {perfil >= 2 && (<><div className="menu-section-title" onClick={toggleAdmin} style={fontsizeH}>
                                    {isAdminOpen ? '▾' : '▸'} Configuración</div><div style={separatorStyles}></div></>)}
                                {isAdminOpen && (
                                    <div style={fontsize}>
                                        {perfil >= 4 && <NavLink onClick={closeMenu} to='/Arbitros' className='nav-link' > <Arbitros2vg />{'Catálogo de Árbitros'} </NavLink>}
                                        {perfil >= 4 && <NavLink onClick={closeMenu} to='/ConsultarIncidencia' className='nav-link' > <IconFlagvg />{'Consulta de Incidencias'} </NavLink>}
                                        {perfil >= 4 && <NavLink onClick={closeMenu} to='/Prueba' className='nav-link' > <IconFlagvg />{'Prueba'} </NavLink>}
                                    </div>
                                )}
                            </div>


                            {esConLicencia == -1 &&
                                <>
                                    <NavLink onClick={closeMenu} to='/CatUsuario' className='nav-link' > <JugadoresSvg />{' Usuarios'} </NavLink>
                                </>
                            }

                            {perfil >= 1 &&
                                <>


                                    <div className="menu-section" >
                                        <div className="menu-section-title" onClick={toggleAccesos} style={fontsizeH}>
                                            {isAccesosOpen ? '▾' : '▸'} Control de Accesos</div><div style={separatorStyles}></div>
                                        {isAccesosOpen && (
                                            <div style={fontsize}>
                                                <NavLink onClick={closeMenu} to='/FrmUsuario' className='nav-link' >{' Registro de Usuarios'} </NavLink>
                                            </div>
                                        )}
                                    </div>
                                    <div className="menu-section" >
                                        <div className="menu-section-title" onClick={toggleEncuesta} style={fontsizeH}>
                                            {isEncuestaOpen ? '▾' : '▸'} Encuestas</div><div style={separatorStyles}></div>
                                        {isEncuestaOpen && (
                                            <div style={fontsize}>
                                                <NavLink onClick={closeMenu} to='/FrmEncuesta' className='nav-link' >{' Captura Resultado'} </NavLink>
                                            </div>
                                        )}
                                    </div>

                                </>
                            }
                        </li>
                    </ul>
                </Menu>


                <div className='container'>

                    <Routes>
                        {/*Genericos*/}
                        <Route element={<ProtectedRoute profile={perfil} requiredProfile={1} />}><Route path='/' element={<Home />} /></Route>
                        <Route element={<ProtectedRoute profile={perfil} requiredProfile={1} />}><Route path='/Login' element={<Login />} /></Route>
                        <Route element={<ProtectedRoute profile={perfil} requiredProfile={1} />}><Route path="/access-denied" element={<AccessDeniedPage />} /></Route>

                        <Route element={<ProtectedRoute profile={perfil} requiredProfile={4} />}><Route path='/Arbitros' element={<FrmArbitro />} /></Route>
                        <Route element={<ProtectedRoute profile={perfil} requiredProfile={4} />}><Route path='/ConsultarIncidencia' element={<FrmConsultaIncidencia />} /></Route>
                        <Route element={<ProtectedRoute profile={perfil} requiredProfile={4} />}><Route path='/Prueba' element={<FrmPrueba />} /></Route>

                        <Route element={<ProtectedRoute profile={perfil} requiredProfile={1} />}><Route path='/FrmUsuario' element={<FrmUsuario />} /></Route>
                        <Route element={<ProtectedRoute profile={perfil} requiredProfile={1} />}><Route path='/FrmEncuesta' element={<FrmEncuesta />} /></Route>
                        {/* <ProtectedRoute path="/Liga" element={<CatLiga />} profile={perfil} requiredProfile={2}/> */}
                        {/* <Route path="/Liga" element={<ProtectedRoute profile={perfil} requiredProfile={2} />}/> */}



                    </Routes>
                </div>


            </BrowserRouter>

        </>

    );
};