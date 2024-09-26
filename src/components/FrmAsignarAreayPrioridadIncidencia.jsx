import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import SimpleTable from './SimpleTable';
import { ElementoCampo } from './ElementoCampo';
import { AlertaEmergente } from './AlertaEmergente';
import { SideBarHeader } from './SideBarHeader';
import config from '../config'; // archivo configs globales del proy
import { ElementoBotones } from './ElementoBotones'
import { responsivePropType } from 'react-bootstrap/esm/createUtilityClasses';
//import Close from '../svg/icon-close.svg?react'
//import Save  from '../svg/icon-save.svg?react'
import { ElementoImagen } from './ElementoImagen'
import { alignPropType } from 'react-bootstrap/esm/types';
import { ElementoToastNotification } from './ElementoToastNotification';
import { PerfilContext } from './PerfilContext'; // Importa el contexto
import { useLocation, useNavigate } from "react-router-dom";


const FrmAsignarAreayPrioridadIncidencia = () => {
    const { perfil, esConLicencia } = useContext(PerfilContext);
    const location = useLocation();
    const data = location.state;
    const navigate = useNavigate();
    //Filtros

    //combo
    const [datosArea, setDatosArea] = useState([]);
    const [datosPrioridad, setDatosPrioridad] = useState([]);

    const [esEditar, setEsEditar] = useState(false);
    const [esFin, setEsFin] = useState(false);


    //datos de registro
    const [idAlcaldia, setIdAlcaldia] = useState(0); //temporalmente se asignan valores para probar el guardado
    const [idIncidencia, setIdIncidencia] = useState(0);  //temporalmente se asignan valores para probar el guardado
    const [idArea, setIdArea] = useState(0);
    const [idPrioridad, setIdPrioridad] = useState(0);
    const [idUsuario, setIdUsuario] = useState(1);  //asigna temporalmente 1 hasta que tengamos una variable global de usuario para pasar este dato al SP
    const [alertaMensaje, setAlertaMensaje] = useState('');

    const [esMuestraCamposReq, setEsMuestraCamposReq] = useState(false);

    const onAceptar = () => {
        setEsMuestraCamposReq(false)
        setEsFin(false)
    };
    const onAceptarC = () => {
        setAlertaMensaje('')
    };


    useEffect(() => {
        var apiUrl = config.apiUrl + '/ConsultarCombo?psSpSel=%22ConsultarAreaCmb%22';
        axios.get(apiUrl)
            .then(response => {
                setDatosArea(response.data)
            }
            )
            .catch(error => console.error('Error al obtener las áreas', error));


        apiUrl = config.apiUrl + '/ConsultarCombo?psSpSel=%22ConsultarPrioridadCmb%22';
        axios.get(apiUrl)
            .then(response => {
                setDatosPrioridad(response.data)
            }
            )
            .catch(error => console.error('Error al obtener el catálogo de prioridades', error));

        setIdAlcaldia(data.idAlcaldia)
        setIdIncidencia(data.idIncidencia)
        setIdArea(data.idArea)
        setIdPrioridad(data.idPrioridadIncidencia)

    }, []);



    const cancelar = () => {
        inicializaCampos()
        setEsEditar(false)
        navigate(-1)
        //console.log("foto:" + foto)
    }

    const inicializaCampos = () => {

        //Campos 
        setIdAlcaldia(1)  //temporalmente se asignan valores para probar el guardado
        setIdIncidencia(2)  //temporalmente se asignan valores para probar el guardado
        setIdArea(0)
        setIdPrioridad(0)
        setIdUsuario(10)  //asigna temporalmente 1 hasta que tengamos una variable global de usuario para pasar este dato al SP
        setEsFin(false)
    }


    const guardarAreayPrioridadIncidencia = async (e) => {
        e.preventDefault();

        const data = {
            pnIdAlcaldia: idAlcaldia,
            pnIdIncidencia: idIncidencia,
            pnIdArea: idArea,
            pnIdPrioridad: idPrioridad,
            pnIdUsuario: idUsuario,
        };



        const apiReq = config.apiUrl + '/GuardarAreayPrioridadIncidencia';

        try {

            if (idAlcaldia == 0) { setEsMuestraCamposReq(true); return }
            if (idIncidencia == 0) { setEsMuestraCamposReq(true); return }
            if (idArea == 0) { setEsMuestraCamposReq(true); return }
            if (idPrioridad == 0) { setEsMuestraCamposReq(true); return }
            if (idUsuario == 0) { setEsMuestraCamposReq(true); return }

            await axios.post(apiReq, { data }, { 'Access-Control-Allow-Origin': '*', "Content-Type": "multipart/form-data" })
                .then(response => {
                    if (response.data && Object.keys(response.data).length !== 0) {
                        console.log('REGRESA ERROR:')
                        console.log('response.data:', response.data);
                        // Asegúrate de que response.data sea una cadena antes de asignarla
                        setAlertaMensaje(JSON.stringify(response.data));
                    } else {
                        console.log('guardo correctamente')
                        setEsFin(true);
                        //inicializaCampos();
                        //setEsEditar(false); // regresa al grid
                    }
                })
                .catch(error => {
                    console.error('Error al enviar la solicitud:', error);
                    setAlertaMensaje('Error al enviar la solicitud');
                });



        } catch (error) {
            console.error('Error al guardar el usuario', error);
        }
    };

    return (
        <>
            <SideBarHeader titulo={'Asignar área y prioridad de la Incidencia'}></SideBarHeader>
            <br /><br /><br /><br />

            <>
                <p>IdAlcaldia : {idAlcaldia}</p><br />
                <p>IdIncicencia : {idIncidencia}</p><br />

                <form onSubmit={guardarAreayPrioridadIncidencia} autoComplete="off">
                    <br />
                    <ElementoBotones cancelar={cancelar}></ElementoBotones>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ flexGrow: 1 }}>
                            {<ElementoCampo type="select" lblCampo="Área*: " claCampo="campo" nomCampo={idArea} options={datosArea} onInputChange={setIdArea} />}
                            {<ElementoCampo type="select" lblCampo="Prioridad*: " claCampo="campo" nomCampo={idPrioridad} options={datosPrioridad} onInputChange={setIdPrioridad} />}

                        </span>
                    </div>


                </form>
            </>
            {
                esMuestraCamposReq &&
                <AlertaEmergente
                    titulo={'Alerta'}
                    mensaje={'Los datos con * son requeridos, favor de validar.'}
                    mostrarBotonAceptar={true}
                    mostrarBotonCancelar={false}
                    onAceptar={onAceptar}
                ></AlertaEmergente>
            }
            {esFin &&
                <ElementoToastNotification
                    mensaje={'Los datos fueron guardados correctamente.'}
                    onAceptar={onAceptar}
                ></ElementoToastNotification>
            }
            {alertaMensaje &&
                <ElementoToastNotification
                    mensaje={alertaMensaje}
                    onAceptar={onAceptarC}
                ></ElementoToastNotification>
            }
        </>


    )
}

export default FrmAsignarAreayPrioridadIncidencia
