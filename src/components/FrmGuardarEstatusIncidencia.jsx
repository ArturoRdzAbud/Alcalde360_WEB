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

import { format, parseISO } from 'date-fns';

import { useLocation, useNavigate } from "react-router-dom";

const FrmGuardarEstatusIncidencia = () => {

    //Parametros recibidos desde form Consultar Incidencia
    const location = useLocation();
    const dataParams = location.state;
    const navigate = useNavigate();
    //---------------------------------------------------

    const { perfil, esConLicencia } = useContext(PerfilContext);

    //combo
    const [datosEstatus, setDatosEstatus] = useState([]);
    const [esFin, setEsFin] = useState(false);

    //asignación de valores enviados desde la consulta de incidencia para los datos de registro
    const [IdAlcaldia, setIdAlcaldia] = useState(1);
    const [IdIncidencia, setIdIncidencia] = useState(1);
    const [IdEstatus, setIdEstatus] = useState(0);
    const [FechaEstimada, setFechaEstimada] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [Comentarios, setComentarios] = useState('');
    const [FechaReporte, setFechaReporte] = useState(new Date().toISOString().split('T')[0]);
    const [idUsuario, setIdUsuario] = useState(0);
    const [Descripcion, setDescripcion] = useState('');


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

        setIdAlcaldia(dataParams.idAlcaldia);
        setIdIncidencia(dataParams.idIncidencia);
        setIdEstatus(dataParams.idEstatusIncidencia);
        setDescripcion(dataParams.descripcion);
        setFechaEstimada(dataParams.fechaEstimada);
        setFechaReporte(dataParams.fechaReporte);

    }, []);


    const cancelar = () => {
        //inicializaCampos()
        navigate(-2)
    }


    const diasAAgregar = 30; // Número de días a agregar

    const agregarDias = (Fecha) => {

        let fechaNueva = new Date(Fecha);
        fechaNueva.setDate(fechaNueva.getUTCDate() + diasAAgregar);

        return (fechaNueva);
    }

    const guardarEstatusIncidencia = async (e) => {
        e.preventDefault();

        const data = {
            pnIdAlcaldia: IdAlcaldia,
            pnIdIncidencia: IdIncidencia,
            pnIdEstatus: IdEstatus,
            pdFechaEstimada: FechaEstimada,
            psComentarios: Comentarios,
            pnIdUsuario: idUsuario,
        };

        const apiReq = config.apiUrl + '/GuardarEstatusIncidencia';

        try {

            if (IdAlcaldia == 0) { setEsMuestraCamposReq(true); return }
            if (IdIncidencia == 0) { setEsMuestraCamposReq(true); return }
            if (IdEstatus == 0) { setEsMuestraCamposReq(true); return }
            if (Comentarios === null || Comentarios.trim() == '') { setEsMuestraCamposReq(true); return }

            const fechaMensual = format(agregarDias(FechaReporte), 'yyyy-MM-dd');

            console.log('fecha reporte : ' + FechaReporte);
            console.log('fecha estimada : ' + FechaEstimada);
            console.log('fecha mensual : ' + fechaMensual);

            if (FechaEstimada <= FechaReporte) {
                setAlertaMensaje('La fecha estimada deber ser mayor a la fecha del reporte : ' + format(parseISO(FechaReporte), 'dd/MM/yyyy'));
                return
            } else if (FechaEstimada > fechaMensual) //<== probar validacion
            {
                setAlertaMensaje('La fecha estimada deber ser menor a un mes (' + format(parseISO(fechaMensual), 'dd/MM/yyyy') + '), después de la fecha del reporte');
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
                        console.log(IdAlcaldia, IdIncidencia, 'Guardo Correctamente Estatus');

                        setComentarios('');
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
                {/*<p>Folio Incidencia : {IdIncidencia}</p><br />
                <p>Descripción : {Descripcion}</p>
                <p>Fecha Reporte : {format(parseISO(FechaReporte), 'dd/MM/yyyy')}</p>
                <p>Fecha Reporte : {JSON.stringify(format(FechaReporte, 'dd/MM/yyyy'))}</p>
                <p>Fecha Reporte : {FechaReporte}</p>*/}

                <form onSubmit={guardarEstatusIncidencia} autoComplete="off">
                    <br />
                    <ElementoBotones cancelar={cancelar}></ElementoBotones>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ flexGrow: 1 }}>
                            {<ElementoCampo type="text" lblCampo="Folio*: " claCampo="campo" nomCampo={IdIncidencia} onInputChange={setIdIncidencia} editable={false} />}
                            {<ElementoCampo type="text" lblCampo="Descripción*: " claCampo="campo" nomCampo={Descripcion} onInputChange={setDescripcion} editable={false} />}
                            <ElementoCampo type='select' lblCampo="Estatus* :" claCampo="campo" nomCampo={IdEstatus} options={datosEstatus} onInputChange={setIdEstatus} />
                            <ElementoCampo type='date' lblCampo="Fecha Reporte :" claCampo="campo" nomCampo={FechaReporte} editable={false} />
                            <ElementoCampo type='date' lblCampo="Fecha Estimada* :" claCampo="campo" nomCampo={FechaEstimada} onInputChange={setFechaEstimada} />
                            <ElementoCampo type='text' lblCampo="Comentarios* :" claCampo="campo" nomCampo={Comentarios} onInputChange={setComentarios} tamanioString={200} />

                        </span>
                        <span style={{ flexGrow: 0.5 }}>
                            <h2></h2>
                        </span>
                    </div>

                    {/*<p>Parrafo temporal para ver parametros del SP a Base de datos|@IdLiga={idLiga}|@idUsuario={idUsuario}|@fN={fechaNacimiento}|@idPerfil={idPerfil}|@Activo={activo.toString()}|</p>*/}
                    {/*<button type="submit" className="btn btn-primary" title="Guardar">Guardar</button>*/}
                    {/*<button type="button" className="btn btn-primary" onClick={cancelar} title="Cancelar">Cancelar</button>*/}

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
