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
  const [porCumplir, setPorCumplir] = useState(false);

  // datos del filtro
  const [FechaEvento, setFechaEvento] = useState(null);
  const [HoraInicio, setHoraInicio] = useState(null);
  const [HoraFin, setHoraFin] = useState(null);

  // Para guardar la Fecha inicio y fin
  const [FechaHoraInicioEvento, setFechaHoraInicioEvento] = useState(null)
  const [FechaHoraFinalEvento, setFechaHoraFinalEvento] = useState(null)

  /*
  //datos de registro
  const [IdFechaTecEvento, setIdFechaTecEvento] = useState(0);
  const [TituloEvento, setTituloEvento] = useState(0);
  const [FechaHoraInicioEvento, setFechaHoraInicioEvento] = useState(null)
  const [FechaHoraFinalEvento, setFechaHoraFinalEvento] = useState(null)
  const [ClaOrigen, setClaOrigen] = useState(0)
  const [LugarEvento, setLugarEvento]=useState('')
  const [Logistica, setLogistica]=useState('')
  const [FechaUltimaMod, setFechaUltimaMod]=useState(null)
  const [NombrePcMod, setNombrePcMod]=useState('')
  const [ClaUsuarioMod, setClaUsuarioMod]=useState(0)
  const [FechaEvento, setFechaEvento] = useState(null)
  */

  const onAceptar = () => {
    setEsMuestraCamposReq(false)
    setEsFin(false)
  };

  const onAceptarC = () => {
    setAlertaMensaje('')
  };


  const inicializaCampos = () => {
    //TODO LIMPIAR CADA FILTRO A SU VALOR INICIAL
/*
    setIdFechaTecEvento(0);
    setTituloEvento(0);
    setFechaHoraInicioEvento(null)
    setFechaHoraFinalEvento(null)
    setClaOrigen(0)
    setLugarEvento('')
    setLogistica('')
    setFechaUltimaMod(null)
    setNombrePcMod('')
    setClaUsuarioMod(0)
    setFechaEvento(null)
*/
    setFechaEvento(null)
    setHoraInicio(null)
    setHoraFin(null)

    setFechaHoraInicioEvento(null)
    setFechaHoraFinalEvento(null)

  };

  useEffect(() => {
    // Cambia la URL a la de tu API
    //console.log({ idAlcaldia })

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

    if (datosEventoBd != null  && datosEventoBd.length == 0) {return}

    // TODO IR FILTRANDO LOCALMENTE CAMPO POR CAMPO SIN IR A BASE DE DATOS
    var datosFiltrados = datosEventoBd;
     
    datosFiltrados = porCumplir ? datosFiltrados.filter(item => item.FechaHoraInicioEvento >= today) : datosFiltrados;
    console.log(porCumplir, today, datosFiltrados.length)
    
    let nuevafecha = new Date(FechaEvento.getFullYears(),FechaEvento.getMonth(), FechaEvento.getDate(), HoraInicio.gethours(), HoraInicio.getMinutes());
    setFechaHoraInicioEvento(nuevafecha)
    
    nuevafecha = new Date(FechaEvento.getFullYears(),FechaEvento.getMonth(), FechaEvento.getDate(), HoraFin.getHours(), HoraFin.getMinutes());
    setFechaHoraFinalEvento(nuevafecha)

    console.log(FechaHoraInicioEvento, '-', FechaHoraFinalEvento);

    //Al seleccionar borrar la fecha el valor es de dos espacios
    if (FechaHoraInicioEvento == null || FechaHoraFinalEvento == null || FechaHoraInicioEvento == '' || FechaHoraFinalEvento == '' || FechaHoraInicioEvento == '  ' || FechaHoraFinalEvento == '  ') {
        setDatosEvento(datosFiltrados);
        return
    } else if (FechaHoraFinalEvento < FechaHoraInicioEvento) {
        setAlertaMensaje('El periodo final no debe ser menor al periodo inicial ');
        setDatosEvento(datosFiltrados);
        //setFechaHoraFinalEvento(FechaHoraInicioEvento)
        return 
    } else if (isNaN(result)) {
        setDatosEvento(datosFiltrados);
        return
    }

    datosFiltrados = FechaHoraInicioEvento != null || FechaHoraInicioEvento != '' ? datosFiltrados.filter(item => item.FechaHoraInicioEvento >= today) : datosFiltrados;
    datosFiltrados = FechaHoraFinalEvento != null || FechaHoraFinalEvento != '' ? datosFiltrados.filter(item => item.FechaHoraFinalEvento < FechaHoraFinalEvento + 1) : datosFiltrados;

    setDatosEvento(datosFiltrados);

  };

  useEffect(() => {
    filtraLocal()
  }, [idAlcaldia, FechaEvento, HoraInicio, HoraFin, porCumplir]); //Se invoca al interactuar con los filtros arriba del grid

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

/* 
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
      header: 'Id Ficha',
      accessorKey: 'Id',//'IdFichaTecnicaEvento',
      footer: 'Id Ficha'
      , visible: true
    },
    {
      header: 'Titulo',
      accessorKey: 'TituloEvento',
      footer: 'Titulo'
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
      header: 'Logistica',
      accessorKey: 'Logistica',
      footer: 'Logistica'
      , visible: true
    },
    
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
      IdFichaTecEvento: rowData.original.Id,
      TituloEvento: rowData.original.TituloEvento,
      FechaHoraInicioEvento : rowData.original.FechaHoraInicioEvento,
      FechaHoraFinalEvento : rowData.original.FechaHoraFinalEvento,
      IdOrigenAgenda: rowData.original.IdOrigenAgenda,
      Lugar: rowData.original.Lugar,
      Logistica: rowData.original.Logistica

    };

    navigate("/FichaTecnicaEvento", { state: data });
 
  };

  return (
    <div>
      <SideBarHeader titulo={esNuevo ? 'Nuevo Evento' : esEditar ? 'Editar Evento' : 'Consulta de Eventos'}></SideBarHeader>
      <br /><br /><br /><br />
      {/* {!esEditar ? */}
      <>
        
        <h2>Alcalde 360 - !Cercanía con la gente a través de un click!</h2>
        {<ElementoCampo type='checkbox' lblCampo="Por cumplir:" claCampo="porcumplir" nomCampo={porCumplir} onInputChange={setPorCumplir} />}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          
          <span style={{ flexBasis: '15%', flexShrink: 1, marginTop: '0px' }}>
            <ElementoCampo type='date' lblCampo="Fecha Evento* :" claCampo="FechaEvento" nomCampo={FechaEvento} onInputChange={setFechaEvento} />

          </span>
          <span style={{ flexGrow: 0.5 }}>
            <h2></h2>
          </span>
          <span style={{ flexBasis: '15%', flexShrink: 1, marginTop: '0px' }}>

            <ElementoCampo type='time' lblCampo="Hora inicio* :" claCampo="HoraInicio" nomCampo={HoraInicio} onInputChange={setHoraInicio} />

          </span>
          <span style={{ flexBasis: '15%', flexShrink: 1, marginTop: '0px' }}>

            <ElementoCampo type='time' lblCampo="Hora Fin* :" claCampo="HoraFin" nomCampo={HoraFin} onInputChange={setHoraFin} />

          </span>
        </div>

        {/*<p>Parrafo temporal para ver parametros|@Alcaldia={idAlcaldia}|@Incidencia={IdFechaTecEvento}|@Tipo={tipoF}|@Area={areaF}|@Inicio={FechaHoraInicioEvento}|@Fin={FechaHoraFinalEvento}|@Colonia={coloniaF}</p>*/}
        <SimpleTable data={datosEvento} columns={columns} handleEdit={handleEditEvento} handleNuevo={nuevoEvento} />


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
