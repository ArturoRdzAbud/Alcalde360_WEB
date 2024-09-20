import React from 'react'
import { Login } from './Login';
import { SideBarHeader } from './SideBarHeader';
import { useLocation } from "react-router-dom";

export const FrmPrueba = () => {
    //const { id1, id2 } = Route.params
    const location = useLocation();
    const data = location.state;
    return (
        <>
            <SideBarHeader titulo=''></SideBarHeader>
            <br /><br /><br /><br />

            <h1>Prueba !</h1>
            <br />
            <p>IdAlcaldia : {data.idAlcaldia}</p><br />
            <p>IdIncicencia : {data.idIncidencia}</p>
            <p>Descripción : {data.descripcion}</p>


        </>
    )
}

export default FrmPrueba;