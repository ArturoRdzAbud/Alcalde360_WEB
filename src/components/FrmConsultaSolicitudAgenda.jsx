import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import SimpleTable from './SimpleTable';
import { ElementoCampo } from './ElementoCampo';
import { AlertaEmergente } from './AlertaEmergente';
import { SideBarHeader } from './SideBarHeader';
import config from '../config'; // archivo configs globales del proy
import { ElementoToastNotification } from './ElementoToastNotification';
import { useNavigate } from "react-router-dom";
import { PerfilContext } from './PerfilContext'; // Importa el contexto
import { differenceInYears, format } from 'date-fns';
import '../css/General.css';

export const FrmConsultaSolicitudAgenda = () => {
  const [DatosAgenda, setDatosAgenda] = useState([]);
  const [DatosAgendaBd, setDatosAgendaBd] = useState([]);

  //Filtros
  const [inicioF, setInicioF] = useState(''); //useState(format(new Date(), 'yyyy-MM-dd')); 
  const [finF, setFinF] = useState(''); //useState(format(new Date(), 'yyyy-MM-dd'));
  const [diaF, setDiaF] = useState('');
  const [mesF, setMesF] = useState('');
  const [semanaF, setSemanaF] = useState('');
  const navigate = useNavigate();
  const today = format(new Date(), 'yyyy-MM-dd');
  const currentDate = new Date();
  const [esEditar, setEsEditar] = useState(false);
  const [esNuevo, setEsNuevo] = useState(false);
  const [esFin, setEsFin] = useState(false);
  const [rango, setRango] = useState(0);

  //datos de registro
  const { idAlcaldia } = useContext(PerfilContext); // variable global
  const [esMuestraCamposReq, setEsMuestraCamposReq] = useState(false);
  const [alertaMensaje, setAlertaMensaje] = useState('');

  const onAceptar = () => {
    setEsMuestraCamposReq(false)
    setEsFin(false)
  };

  const onAceptarC = () => {
    setAlertaMensaje('')
  };


  const inicializaCampos = () => {
    //TODO LIMPIAR CADA FILTRO A SU VALOR INICIAL
    setInicioF('') //format(new Date(), 'yyyy-MM-dd')
    setFinF('') //format(new Date(), 'yyyy-MM-dd')
    setRango(0)

  };


  useEffect(() => {
    // Cambia la URL a la de tu API
    //console.log({ idAlcaldia })
    const apiUrl = config.apiUrl + '/ConsultarSolicitudAgenda';
    if (esEditar) return//sale si es modo edicion
    axios.get(apiUrl, { params: { pnIdAlcaldia: idAlcaldia } })
      .then(response => { setDatosAgenda(response.data); setDatosAgendaBd(response.data) })
      .catch(error => console.error('Error al obtener datos:', error))
      .finally(() => {
        inicializaCampos()
        //console.log('Datos Incidencia:', DatosAgenda)
      });
  }, [esEditar]);  // useEffect se ejecuta cuando se modifica la propiedad esEditar




  const filtraLocal = () => {
    //console.log("rango", rango)
    // TODO IR FILTRANDO LOCALMENTE CAMPO POR CAMPO SIN IR A BASE DE DATOS
    var datosFiltrados = DatosAgendaBd;
    /*datosFiltrados = idAlcaldia > 0 ? datosFiltrados.filter(item => item.IdAlcaldia == idAlcaldia) : datosFiltrados;
    datosFiltrados = tipoF > 0 ? datosFiltrados.filter(item => item.IdTipoIncidencia == tipoF) : datosFiltrados;
    */
    /*
        switch (rango) {
          case 1:
    
            break;
          case 2:
    
            break;
        }*/

    console.log({ inicioF }, { finF }, { rango }, { today })
    const result = differenceInYears(new Date(finF), new Date(inicioF));
    //console.log(inicioF, '-', finF, '-', result);
    //Al seleccionar borrar la fecha el valor es de dos espacios
    if (inicioF == null || finF == null || inicioF == '' || finF == '' || inicioF == '  ' || finF == '  ') {
      setDatosAgenda(datosFiltrados);
      return
    } else if (finF < inicioF) {
      setAlertaMensaje('El periodo final no debe ser menor al periodo inicial ');
      setDatosAgenda(datosFiltrados);
      //setFinF(inicioF)
      return
    } else if (result >= 1) {
      setAlertaMensaje('El periodo no debe ser mayor a un año');
      setDatosAgenda(datosFiltrados);
      return
    } else if (isNaN(result)) {
      setDatosAgenda(datosFiltrados);
      return
    }
    //datosFiltrados = rango === 1 ? datosFiltrados.filter(item => item.FechaHoraIni2 == today) : datosFiltrados;
    datosFiltrados = inicioF != null || inicioF != '' ? datosFiltrados.filter(item => item.FechaHoraIni2 >= inicioF) : datosFiltrados;
    datosFiltrados = finF != null || finF != '' ? datosFiltrados.filter(item => item.FechaHoraIni2 < finF + 1) : datosFiltrados;

    setDatosAgenda(datosFiltrados);

  };

  useEffect(() => {
    filtraLocal()
  }, [inicioF, finF]); //Se invoca al interactuar con los filtros arriba del grid

  useEffect(() => {
    filtraRango()
  }, [rango]);

  const startOfWeek = format(new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay())), 'yyyy-MM-dd');
  const endOfWeek = format(new Date(currentDate.setDate(currentDate.getDate() + (6 - currentDate.getDay()))), 'yyyy-MM-dd');

  const filtraRango = () => {
    console.log({ rango }, { endOfWeek })
    var datosFiltrados = DatosAgendaBd;
    datosFiltrados = rango == 1 ? datosFiltrados.filter(item => item.FechaHoraIni2 === today)
      :
      rango == 2 ? datosFiltrados.filter(item => item.FechaHoraIni2 >= startOfWeek && item.FechaHoraIni2 <= endOfWeek)
        :
        rango == 3 ? datosFiltrados.filter(item => item.Mes === currentDate.getMonth() && item.Anio === currentDate.getFullYear())
          : datosFiltrados

    setDatosAgenda(datosFiltrados);
  };


  const columns = [
    {
      header: 'Id',
      accessorKey: 'IdSolicitudAgenda',
      footer: 'Id'
      , visible: true
    },
    {
      header: 'FichaTecnica',
      accessorKey: 'IdSolicitudAgendaFichaTecnica',
      footer: 'FichaTecnica'
      , visible: false
    },
    {
      header: 'Origen',
      accessorKey: 'IdOrigenAgenda',
      footer: 'Origen'
      , visible: false
    },
    {
      header: 'Origen',
      accessorKey: 'Origen',
      footer: 'Origen'
      , visible: true
    },
    {
      header: 'Clasificacion',
      accessorKey: 'IdClasificacionAgenda',
      footer: 'Clasificacion'
      , visible: false
    },
    {
      header: 'Clasificacion',
      accessorKey: 'Clasificacion',
      footer: 'Clasificacion'
      , visible: true
    },
    {
      header: 'Tipo',
      accessorKey: 'IdTipoAgenda',
      footer: 'Tipo'
      , visible: false
    },
    {
      header: 'Tipo',
      accessorKey: 'Tipo',
      footer: 'Tipo'
      , visible: true
    },
    {
      header: 'Estatus',
      accessorKey: 'IdEstatusAgenda',
      footer: 'Estatus'
      , visible: false
    },
    {
      header: 'Estatus',
      accessorKey: 'Estatus',
      footer: 'Estatus'
      , visible: true
    },
    {
      header: 'Nombre',
      accessorKey: 'Nombre1',
      footer: 'Nombre'
      , visible: true
    },
    {
      header: 'Asunto',
      accessorKey: 'Descripcion',
      footer: 'Asunto'
      , visible: true
    },

    {
      header: 'Teléfono',
      accessorKey: 'Telefono',
      footer: 'Teléfono'
      , visible: false
    },
    {
      header: 'Correo',
      accessorKey: 'Correo',
      footer: 'Correo'
      , visible: false
    },
    {
      header: 'IdColonia',
      accessorKey: 'IdColonia',
      footer: 'IdColonia'
      , visible: false
    },
    {
      header: 'Colonia',
      accessorKey: 'Colonia',
      footer: 'Colonia'
      , visible: false
    },
    {
      header: 'Fecha y hora',
      accessorKey: 'FechaHoraIni3',
      footer: 'Fecha y hora'
      , cell: ({ getValue }) => (isNaN(getValue()) ? getValue() : '')
      , visible: true
    },

    {
      header: 'Calle',
      accessorKey: 'Calle',
      footer: 'Calle'
      , visible: false
    },
    {
      header: 'Numero',
      accessorKey: 'Numero',
      footer: 'Numero'
      , visible: false
    },
    {
      header: 'CodigoPostal',
      accessorKey: 'CodigoPostal',
      footer: 'CodigoPostal'
      , visible: false
    },

  ];

  const nuevo = () => {
    inicializaCampos()

    const data = {
      esNuevo: true,
      idSolicitudAgenda: 0,
      idEstatusAgenda: 2
    };

    navigate("/SolicitudAgenda", { state: data });

  };

  const handleEdit = (rowData) => {
    setEsEditar(true)

    const data = {
      esNuevo: false,
      idAlcaldia: rowData.original.IdAlcaldia,
      idSolicitudAgenda: rowData.original.IdSolicitudAgenda,
      idSolicitudAgendaFichaTecnica: rowData.original.IdSolicitudAgendaFichaTecnica,

      descripcion: rowData.original.Descripcion,
      idTipoAgenda: rowData.original.IdTipoAgenda,
      idEstatusAgenda: rowData.original.IdEstatusAgenda,
      idOrigenAgenda: rowData.original.IdOrigenAgenda,
      idClasificacionAgenda: rowData.original.IdClasificacionAgenda,

      fechaInicial: rowData.original.FechaHoraIni,
      fechaFinal: rowData.original.FechaHoraFin,

      nombre: rowData.original.Nombre1,
      cargo: rowData.original.Cargo,
      telefono: rowData.original.Telefono,
      correo: rowData.original.Correo,

      idColonia: rowData.original.IdColonia,
      calle: rowData.original.Calle,
      numero: rowData.original.Numero,
      codigoPostal: rowData.original.CodigoPostal,

    };
    navigate("/SolicitudAgenda", { state: data });

  };


  // Definir el arreglo con los tres registros para el radio
  const [valores, setValores] = useState([
    { value: 1, label: 'Día' },
    { value: 2, label: 'Semana' },
    { value: 3, label: 'Mes' }
  ]);

  return (
    <div>
      <SideBarHeader titulo={'Consulta de Solicitudes de Agenda'}></SideBarHeader>
      <br /><br /><br /><br />
      <>
        {/*<button type="button" className="btn btn-primary" onClick={nuevo}>Nuevo</button>*/}
        <h2>Alcalde 360 - !Cercanía con la gente a través de un click!</h2>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ flexGrow: 1 }}>

            <ElementoCampo type='date' lblCampo="Inicio Periodo* :" claCampo="Inicio" nomCampo={inicioF} onInputChange={setInicioF} />

          </span>
          <span style={{ flexGrow: 0.5 }}>
            <h2></h2>
          </span>
          <span style={{ flexGrow: 1 }}>

            <ElementoCampo type='date' lblCampo="Fin Periodo* :" claCampo="Fin" nomCampo={finF} onInputChange={setFinF} />

          </span>
          {/* flexBasis: '100%', marginRight: '10px', flexShrink: 0 */}
          <span style={{ flexGrow: 1, marginLeft: '20px' }}>
            <ElementoCampo type='radio' lblCampo="" claCampo="campo" options={valores} nomCampo={rango} onInputChange={setRango} />
          </span>
        </div>

        {/*<p>Parrafo temporal para ver parametros|@Alcaldia={idAlcaldia}|@Incidencia={idIncidencia}|@Tipo={tipoF}|@Area={areaF}|@Inicio={inicioF}|@Fin={finF}|@Colonia={coloniaF}</p>*/}
        <SimpleTable data={DatosAgenda} columns={columns} handleEdit={handleEdit} handleNuevo={nuevo} />


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

export default FrmConsultaSolicitudAgenda;
