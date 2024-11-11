import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import SimpleTable from './SimpleTable';
import { ElementoCampo } from './ElementoCampo';
import { AlertaEmergente } from './AlertaEmergente';
import { SideBarHeader } from './SideBarHeader';
import config from '../config'; // archivo configs globales del proy
import { ElementoImagen } from './ElementoImagen'
import { ElementoToastNotification } from './ElementoToastNotification';
import { ElementoBotones } from './ElementoBotones'
import { useNavigate } from "react-router-dom";
import { PerfilContext } from './PerfilContext'; // Importa el contexto
import { addYears, differenceInYears, format } from 'date-fns';
import '../css/General.css';

export const FrmConsultarEventos = () => {

  const { idAlcaldia } = useContext(PerfilContext); // variable global

  // lista de eventos para el Grid
  const [datosEvento, setDatosEvento] = useState([]);
  const [datosEventoBd, setDatosEventoBd] = useState([]);

  // variables de control
  const navigate = useNavigate();
  const today = format(new Date(), 'yyyy-MM-dd');
  const [esEditar, setEsEditar] = useState(false);
  const [esNuevo, setEsNuevo] = useState(false);
  const [esFin, setEsFin] = useState(false);

  const [esMuestraCamposReq, setEsMuestraCamposReq] = useState(false);
  const [alertaMensaje, setAlertaMensaje] = useState('');
  
  // datos del filtro
  const [porCumplir, setPorCumplir] = useState(false);
  const [FechaEventoIni, setFechaEventoIni] = useState(today);
  const [FechaEventoFin, setFechaEventoFin] = useState(today);

  // Para guardar la Fecha inicio y fin
  const [FechaHoraInicioEvento, setFechaHoraInicioEvento] = useState(null)
  const [FechaHoraFinalEvento, setFechaHoraFinalEvento] = useState(null)

  const onAceptar = () => {
    setEsMuestraCamposReq(false)
    setEsFin(false)
  };

  const onAceptarC = () => {
    setAlertaMensaje('')
  };


  const inicializaCampos = () => {
    //TODO LIMPIAR CADA FILTRO A SU VALOR INICIAL

    setFechaEventoIni(today)
    setFechaEventoFin(today)
 
    setFechaHoraInicioEvento(null)
    setFechaHoraFinalEvento(null)

  };

  useEffect(() => {

    if (esEditar) return //sale si es modo edicion

    const apiUrl = config.apiUrl + '/ConsultarEventos';

    axios.get(apiUrl, { params: { pnIdAlcaldia: idAlcaldia } })
      .then(response => { setDatosEvento(response.data); setDatosEventoBd(response.data) })
      .catch(error => console.error('Error al obtener datos:', error))
      .finally(() => {
        inicializaCampos()
        //console.log('Datos Incidencia:', datosEventos)
      });

  },[]);  // useEffect se ejecuta cuando se modifica la propiedad esEditar


  useEffect(() => {

    if (esEditar) return//sale si es modo edicion

    const apiUrl = config.apiUrl + '/ConsultarEventos';

    axios.get(apiUrl, { params: { pnIdAlcaldia: idAlcaldia } })
      .then(response => { setDatosEvento(response.data); setDatosEventoBd(response.data) })
      .catch(error => console.error('Error al obtener datos:', error))
      .finally(() => {
        inicializaCampos()
        //console.log('Datos Incidencia:', datosEventos)
      });

  }, [esEditar]);  // useEffect se ejecuta cuando se modifica la propiedad esEditar

  const filtraLocal = () => {

    if (datosEventoBd == null) return

    // TODO IR FILTRANDO LOCALMENTE CAMPO POR CAMPO SIN IR A BASE DE DATOS
    var datosFiltrados = datosEventoBd;
    
    console.log('1 ', porCumplir, today, FechaEventoIni, FechaEventoFin, datosFiltrados)

    //Al seleccionar borrar la fecha el valor es de dos espacios
    if (FechaEventoIni == null || FechaEventoFin == null || FechaEventoIni == '' || FechaEventoFin == '' || FechaEventoIni == '  ' || FechaEventoFin == '  ') {
        setDatosEvento(datosFiltrados);
        console.log('1.1 ', porCumplir, today, FechaEventoIni, FechaEventoFin, datosFiltrados)
        return
    }
    console.log('2 ', FechaEventoIni, FechaHoraInicioEvento, '-', FechaEventoFin, FechaHoraFinalEvento);
    
    let fechaNueva1 = new Date(FechaEventoIni);
    fechaNueva1.setDate(fechaNueva1.getUTCDate());

    let fechaNueva2 = new Date(FechaEventoFin);
    fechaNueva2.setDate(fechaNueva2.getUTCDate());

    //!isNaN(Date.parse("22/05/2001"))  // true
    console.log('2.1 ', fechaNueva1.getUTCDate(), fechaNueva1.getFullYear(), fechaNueva2.getUTCDate(), fechaNueva2.getFullYear(), FechaEventoIni, FechaEventoFin);

    let nuevafecha = new Date(fechaNueva1.getFullYear(),fechaNueva1.getMonth(), fechaNueva1.getDate());
    setFechaHoraInicioEvento(nuevafecha);
    
    nuevafecha = new Date(fechaNueva2.getFullYear(),fechaNueva2.getMonth(), fechaNueva2.getDate());
    setFechaHoraFinalEvento(nuevafecha);

    console.log('2.2 ', FechaEventoIni, FechaHoraInicioEvento, '-', FechaEventoFin, FechaHoraFinalEvento);

    //Al seleccionar borrar la fecha el valor es de dos espacios
    if (FechaHoraInicioEvento == null || FechaHoraFinalEvento == null || FechaHoraInicioEvento == '' || FechaHoraFinalEvento == '' || FechaHoraInicioEvento == '  ' || FechaHoraFinalEvento == '  ') {
        setDatosEvento(datosFiltrados);
        return
    } else if (FechaHoraFinalEvento < FechaHoraInicioEvento) {
        setAlertaMensaje('El periodo final no debe ser menor al periodo inicial ');
        setDatosEvento(datosFiltrados);
        //setFechaHoraFinalEvento(FechaHoraInicioEvento)
        return 
    } 
    /*else if (isNaN(result)) {
        setDatosEvento(datosFiltrados);
        return
    }*/

    //console.log('3 fechas filtro: ' + FechaHoraInicioEvento, '-', FechaHoraFinalEvento);
    console.log('3 fechas filtro: ' + FechaEventoIni, FechaHoraInicioEvento, '-', FechaEventoFin, FechaHoraFinalEvento);

    if (porCumplir) {
      datosFiltrados = porCumplir ? datosFiltrados.filter(item => item.FechaHoraInicioEvento2 >= today) : datosFiltrados;
    }else {
      datosFiltrados = FechaEventoIni != null || FechaEventoIni != '' ? datosFiltrados.filter(item => item.FechaHoraInicioEvento2 >= FechaEventoIni) : datosFiltrados;
      datosFiltrados = FechaEventoFin != null || FechaEventoFin != '' ? datosFiltrados.filter(item => item.FechaHoraFinalEvento2 < FechaEventoFin + 1) : datosFiltrados;
    }

    setDatosEvento(datosFiltrados);

  };

  useEffect(() => {
    filtraLocal()
  }, [idAlcaldia, FechaEventoIni, FechaEventoFin, porCumplir]); //Se invoca al interactuar con los filtros arriba del grid

/*
  // Función para obtener la clase CSS según el valor
  const obtenerClaseColor = (valorColor) => {
    switch (valorColor) {
      case 1:
        return 'red';
      case 2:
        return 'orange';
      case 3:
        return 'green';
      default:
        return '';
    }
  };

    {
      accessorKey: 'Color',
      header: '',
      //footer: 'C',
      visible: true,
      cell: ({ cell }) => {
        const valorColor = cell.getValue();
        // Y dentro de la columna personalizada:
        return (
          <div className={obtenerClaseColor(valorColor)}>
            {''}
          </div>
        );
      },
    },
*/

  const columns = [
    {
      header: 'IdAlcaldia',
      accessorKey: 'IdAlcaldia',
      footer: 'IdAlcaldia'
      , visible: false
    },
    {
      header: 'Id Solicitud',
      accessorKey: 'Id',//'IdSolicitudAgenda',
      footer: 'Id Solicitud'
      , visible: true
    },
    {
      header: 'Título',
      accessorKey: 'TituloEvento',
      footer: 'Título'
      , visible: true
    },
    {
      header: 'Fecha Inicio',
      accessorKey: 'FechaHoraInicioEvento',
      footer: 'Fecha Inicio'
      , visible: true
    },
    {
      header: 'Fecha Final',
      accessorKey: 'FechaHoraFinalEvento',
      footer: 'Fecha Final'
      , visible: true
    },
    {
      header: 'Fecha Inicio',
      accessorKey: 'FechaHoraInicioEvento2',
      footer: 'Fecha Inicio'
      , visible: false
    },
    {
      header: 'Fecha Final',
      accessorKey: 'FechaHoraFinalEvento2',
      footer: 'Fecha Final'
      , visible: false
    },
    {
      header: 'IdOrigenAgenda',
      accessorKey: 'IdOrigenAgenda',
      footer: 'IdOrigenAgenda'
      , visible: false
    },
    {
      header: 'Origen',
      accessorKey: 'Origen',
      footer: 'Origen'
      , visible: true
    },
    {
      header: 'Lugar',
      accessorKey: 'Lugar',
      footer: 'Lugar'
      , visible: true
    },
    {
      header: 'Logística',
      accessorKey: 'Logistica',
      footer: 'Logística'
      , visible: true
    },
    {
      header: 'Asunto',
      accessorKey: 'Asunto',
      footer: 'Asunto'
      , visible: true
    },
    {
      header: 'Nombre del Solicitante',
      accessorKey: 'NombreSolicitante',
      footer: 'Nombre del Solicitante'
      , visible: true
    },
    {
      header: 'Cargo',
      accessorKey: 'Cargo',
      footer: 'Cargo'
      , visible: true
    },
    {
      header: 'Clasificación',
      accessorKey: 'Clasificacion',
      footer: 'Clasificación'
      , visible: true
    },
    {
      header: 'Tipo',
      accessorKey: 'Tipo',
      footer: 'Tipo'
      , visible: true
    },
    {
      header: 'Estatus',
      accessorKey: 'Estatus',
      footer: 'Estatus'
      , visible: true
    }    
  ];

  const nuevoEvento = () => {
    inicializaCampos()
    setEsEditar(true)
    setEsNuevo(true)

    const data = {
      esNuevo: true      
    };

    navigate("/FichaTecnicaEvento", { state: data });

  };

  const handleEditEvento = (rowData) => {

    setEsEditar(true)
    //setAccion(0)//0 para MODIF 1 para nuevo

    const data = {

      esNuevo: false,
      esEditar: true,
      idAlcaldia: rowData.original.IdAlcaldia,
      IdSolicitudAgenda: rowData.original.Id,
      TituloEvento: rowData.original.TituloEvento,
      FechaHoraInicioEvento : rowData.original.FechaHoraInicioEvento,
      FechaHoraFinalEvento : rowData.original.FechaHoraFinalEvento,
      IdOrigenAgenda: rowData.original.IdOrigenAgenda,
      Lugar: rowData.original.Lugar,
      Logistica: rowData.original.Logistica,
      Asunto: rowData.original.Asunto,
      NombreSolicitante: rowData.original.NombreSolicitante,
      Cargo: rowData.original.Cargo,
      Clasificacion: rowData.original.Clasificacion,
      Tipo: rowData.original.Tipo,
      Estatus: rowData.original.Estatus
    };

    navigate("/FichaTecnicaEvento", { state: data });
 
  };

  const handleCheckChange =(event) => {
    console.log('checked : ', event.target.checked)
    /*
    if (event.target.checked == true)
    {
      setFechaEventoIni(today);
      setFechaEventoFin(today);
      setFechaHoraInicioEvento(today)
      setFechaHoraFinalEvento(today)
    } else {
      setFechaEventoIni(null);
      setFechaEventoFin(null);
      setFechaHoraInicioEvento(null)
      setFechaHoraFinalEvento(null)
    }
*/
  }

  return (
    <div>
      <SideBarHeader titulo={esNuevo ? 'Nuevo Evento' : esEditar ? 'Editar Evento' : 'Consulta de Eventos'}></SideBarHeader>
      <br /><br /><br /><br />
      {/* {!esEditar ? checked={porCumplir}*/}
      <>
        
        <h2>Alcalde 360 - !Cercanía con la gente a través de un click!</h2>
        {<ElementoCampo type='checkbox' lblCampo="Por cumplir:" claCampo="porcumplir" nomCampo={porCumplir} onInputChange={setPorCumplir}  onChange={handleCheckChange}  />}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          
          <span style={{ flexBasis: '45%', flexShrink: 1, marginTop: '0px' }}>
            <ElementoCampo type='date' lblCampo="Fecha Inicio* :" claCampo="FechaEventoIni" nomCampo={FechaEventoIni} onInputChange={setFechaEventoIni} />
          </span>
          <span style={{ flexGrow: 0.5 }}>
            <h2></h2>
          </span>
          <span style={{ flexBasis: '45%', flexShrink: 1, marginTop: '0px' }}>
            <ElementoCampo type='date' lblCampo="Fecha fin* :" claCampo="FechaEventoFin" nomCampo={FechaEventoFin} onInputChange={setFechaEventoFin} />
          </span>

        </div>

        {/*<p>Parrafo temporal para ver parametros|@Alcaldia={idAlcaldia}|@Incidencia={IdFechaTecEvento}|@Tipo={tipoF}|@Area={areaF}|@Inicio={FechaHoraInicioEvento}|@Fin={FechaHoraFinalEvento}|@Colonia={coloniaF}</p>*/}
        <SimpleTable data={datosEvento} columns={columns} handleEdit={handleEditEvento} handleNuevo={nuevoEvento} esOcultaBotonNuevo />


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
      {
        esFin &&
        <AlertaEmergente
          titulo={'Alerta'}
          mensaje={'Los datos fueron guardados correctamente.'}
          mostrarBotonAceptar={true}
          mostrarBotonCancelar={false}
          onAceptar={onAceptar}
        ></AlertaEmergente>
        // : <p></p>
      }
      {
        alertaMensaje &&
        <ElementoToastNotification
          mensaje={alertaMensaje}
          onAceptar={onAceptarC}
        ></ElementoToastNotification>
      }
    </div >
  );
}

export default FrmConsultarEventos;
