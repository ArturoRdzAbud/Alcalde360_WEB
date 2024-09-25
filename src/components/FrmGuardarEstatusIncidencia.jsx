import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import SimpleTable from './SimpleTable';
import { ElementoCampo } from './ElementoCampo';
import { AlertaEmergente } from './AlertaEmergente';
import { SideBarHeader } from './SideBarHeader';
import config from '../config'; // archivo configs globales del proy
import { ElementoBotones } from './ElementoBotones'
import { responsivePropType } from 'react-bootstrap/esm/createUtilityClasses';

import { ElementoImagen } from './ElementoImagen'
import { alignPropType } from 'react-bootstrap/esm/types';
import { ElementoToastNotification } from './ElementoToastNotification';
import { PerfilContext } from './PerfilContext'; // Importa el contexto

import { format } from 'date-fns';

import { useLocation } from "react-router-dom";

const FrmGuardarEstatusIncidencia = () => {

    //Parametros recibidos desde form Consultar Incidencia
    const location = useLocation();
    const dataParams = location.state;
    //------------------------------

    const { perfil, esConLicencia } = useContext(PerfilContext);

    //combo
    const [datosEstatus, setDatosEstatus] = useState([]);

    const [esNuevo, setEsNuevo] = useState(false);
    const [esEditar, setEsEditar] = useState(false);
    const [esFin, setEsFin] = useState(false);

    //asignación de valores enviados desde la consulta de incidencia para los datos de registro
    const [IdAlcaldia, setIdAlcaldia] =  useState(1);
    const [IdIncidencia, setIdIncidencia] = useState(1);
    const [IdEstatus, setIdEstatus] =  useState(0);
    const [FechaEstimada, setFechaEstimada] =  useState(new Date());
    const [Comentarios, setComentarios] =  useState('');
    const [FechaReporte, setFechaReporte] =  useState(new Date());
    const [idUsuario, setIdUsuario] = useState(0);

    //parametros enviados desde frmconsultaincidencia
    if (dataParams != null) {
        if (dataParams.idAlcaldia != null) {setIdAlcaldia(dataParams.idAlcaldia); }
        if (dataParams.idIncidencia != null) {setIdIncidencia(dataParams.idIncidencia); }
        if (dataParams.IdEstatus != null) {setIdEstatus(dataParams.IdEstatus); }
        if (dataParams.FechaEstimada != null) {setFechaEstimada(dataParams.FechaEstimada); }
        if (dataParams.Comentarios != null) {setComentarios(dataParams.Comentarios); }
        if (dataParams.FechaReporte != null) {setFechaReporte(dataParams.FechaReporte); }
        if (dataParams.idUsuario != null) {setIdUsuario(dataParams.idUsuario); }

        console.log(dataParams.FechaReporte);
    }

    const [activo, setActivo] = useState(false);
    const [accion, setAccion] = useState(0);
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
        var apiUrl = config.apiUrl + '/ConsultarCombo?psSpSel=%22ConsultarEstatusIncidenciaCmb%22';
        axios.get(apiUrl)
            .then(response => {
                setDatosEstatus(response.data)
            }
        )
      .catch(error => console.error('Error al obtener estatus', error));

    }, []);

    const nuevo = () => {
        inicializaCampos()
        setEsNuevo(true)
        setEsEditar(true)
        setAccion(1)

    }

    const cancelar = () => {
        inicializaCampos()
        setEsEditar(false)
        setEsNuevo(false)
        //console.log("foto:" + foto)
    }

    const inicializaCampos = () => {

        setActivo(true)

        //Campos 
        setIdAlcaldia(IdAlcaldia); //temporalmente se asignan valores para probar el guardado
        setIdIncidencia(IdIncidencia); //temporalmente se asignan valores para probar el guardado
        setIdEstatus(0);
        setFechaEstimada(new Date());
        
        //para que no la fecha no le reste un dia por problemas de zona horaria
        if (!FechaEstimada==null) {
             FechaEstimada.setMinutes(FechaEstimada.getMinutes() + FechaEstimada.getTimezoneOffset())
        }

        setComentarios('');
        setIdUsuario(idUsuario)//asigna temporalmente 1 hasta que tengamos una variable global de usuario para pasar este dato al SP

        // setIdPerfil(-1)
        setAccion(0)
        setEsFin(false)
    }
 
    const diasAAgregar = 30; // Número de días a agregar

    const agregarDias = (Fecha) => {
          
        let fechaActual = new Date();                 
        fechaActual.setDate(Fecha.getDate() + diasAAgregar);
          
        return (fechaActual);
    }   

    const guardarEstatusIncidencia = async (e) => {
        e.preventDefault();

        const data = {
            pnIdAlcaldia : IdAlcaldia,
            pnIdIncidencia : IdIncidencia,
            pnIdEstatus : IdEstatus,
            pdFechaEstimada : FechaEstimada,
            psComentarios : Comentarios,
            pnIdUsuario: idUsuario,            
        };

        const apiReq = config.apiUrl + '/GuardarEstatusIncidencia';

        try {

            if (IdAlcaldia == 0) {setEsMuestraCamposReq(true); return}
            if (IdIncidencia == 0) {setEsMuestraCamposReq(true); return}
            if (IdEstatus == 0) {setEsMuestraCamposReq(true); return}
            if (Comentarios === null || Comentarios.trim() == '') { setEsMuestraCamposReq(true); return }
            
            const fechaMensual = agregarDias(FechaReporte); 

            //console.log(IdAlcaldia);
            //console.log(IdIncidencia);
            //console.log(IdEstatus);
            //console.log(Comentarios);
            console.log('fecha reporte : ' + format(FechaReporte,'yyyy-MM-dd'));
            console.log('fecha estimada : ' + FechaEstimada);
            console.log('fecha mensual : ' + format(fechaMensual, 'yyyy-MM-dd'));

            if (FechaEstimada <= format(FechaReporte,'yyyy-MM-dd'))
            {
                setAlertaMensaje('La fecha estimada deber ser mayor a la fecha del reporte : ' + format(FechaReporte,'dd/MM/yyyy'));
                return
            } else if (FechaEstimada > format(fechaMensual, 'yyyy-MM-dd')) //<== probar validacion
            {
                setAlertaMensaje('La fecha estimada deber ser menor a un mes (' + format(fechaMensual, 'dd/MM/yyyy') + '), después de la fecha del reporte');
                return
            }

            await axios.post(apiReq, { data }, { 'Access-Control-Allow-Origin': '*', "Content-Type": "multipart/form-data" })
                .then(response => {
                    if (response.data && Object.keys(response.data).length !== 0) {
                        console.log('REGRESA ERROR:')
                        console.log('response.data:', response.data);
                        // Asegúrate de que response.data sea una cadena antes de asignarla
                        setAlertaMensaje(JSON.stringify(response.data));
                    } else {
                        console.log(IdAlcaldia , IdIncidencia, 'guardo correctamente');

                        inicializaCampos();

                        setIdEstatus(IdEstatus);
                        setFechaEstimada(FechaEstimada);
                        setComentarios(Comentarios);

                        setEsEditar(false); // regresa al grid
                        setEsNuevo(false);
                        setEsFin(true);
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
            <SideBarHeader titulo='Actualizar Estatus de Incidencia'></SideBarHeader>
            <br /><br /><br /><br />

                <>
                    <form onSubmit={guardarEstatusIncidencia} autoComplete="off">
                        <br />
                        <ElementoBotones cancelar={cancelar}></ElementoBotones>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ flexGrow: 1 }}>
                                <ElementoCampo type='select' lblCampo="Estatus* :" claCampo="campo" nomCampo={IdEstatus} options={datosEstatus} onInputChange={setIdEstatus} />
                                <ElementoCampo type='date' lblCampo="Fecha Estimada* :" claCampo="campo" nomCampo={FechaEstimada} onInputChange={setFechaEstimada} />
                                <ElementoCampo type='text' lblCampo="Comentarios* :" claCampo="campo" nomCampo={Comentarios} onInputChange={setComentarios} tamanioString={250} />
                                
                            </span>
                            <span style={{ flexGrow: 0.5 }}>
                                <h2></h2>
                            </span>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ flexGrow: 1 }}>

                            </span>
                            <span style={{ flexGrow: 1 }}>
                                <h2></h2>
                            </span>
                            <span style={{ flexGrow: 1 }}>

                            </span>
                        </div>

                        {/*<p>Parrafo temporal para ver parametros del SP a Base de datos|@IdLiga={idLiga}|@idUsuario={idUsuario}|@fN={fechaNacimiento}|@idPerfil={idPerfil}|@Activo={activo.toString()}|</p>*/}
                        {/*<button type="submit" className="btn btn-primary" title="Guardar">Guardar</button>*/}
                        {/*<button type="button" className="btn btn-primary" onClick={cancelar} title="Cancelar">Cancelar</button>*/}


                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ flexGrow: 1 }}>

                            </span>
                            <span style={{ flexGrow: 1 }}>
                                <h2></h2>
                            </span>
                            <span style={{ flexGrow: 1 }}>

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
                <AlertaEmergente
                    titulo={'Alerta'}
                    mensaje={'Los datos fueron guardados correctamente.'}
                    mostrarBotonAceptar={true}
                    mostrarBotonCancelar={false}
                    onAceptar={onAceptar}
                ></AlertaEmergente>
                // : <p></p>
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

export default FrmGuardarEstatusIncidencia
