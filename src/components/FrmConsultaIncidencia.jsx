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

export const FrmConsultaIncidencia = () => {
  const [datosIncidencia, setDatosIncidencia] = useState([]);
  const [datosIncidenciaBd, setDatosIncidenciaBd] = useState([]);

  //Filtros
  //const [esVerBaja, setEsVerBaja] = useState(false);
  const [tipoF, setTipoF] = useState(-1);
  const [datosTipo, setDatosTipo] = useState([]);
  const [areaF, setAreaF] = useState(-1);
  const [datosArea, setDatosArea] = useState([]);
  const [estatusF, setEstatusF] = useState(-1);
  const [datosEstatus, setDatosEstatus] = useState([]);
  const [nombreF, setNombreF] = useState('');
  const [coloniaF, setColoniaF] = useState(-1);
  const [datosColonia, setDatosColonia] = useState([]);
  const [inicioF, setInicioF] = useState(null);
  const [finF, setFinF] = useState(null);
  const navigate = useNavigate();
  const today = format(new Date(), 'yyyy-MM-dd');
  const [esEditar, setEsEditar] = useState(false);
  const [esNuevo, setEsNuevo] = useState(false);
  const [esFin, setEsFin] = useState(false);

  //datos de registro
  const { idAlcaldia } = useContext(PerfilContext); // variable global
  //const [idAlcaldia, setIdAlcaldia] = useState(1);
  const [idIncidencia, setIdIncidencia] = useState(0);
  const [idArea, setIdArea] = useState(0);
  const [idPrioridad, setIdPrioridad] = useState(0);

  const [esMuestraCamposReq, setEsMuestraCamposReq] = useState(false);
  const [alertaMensaje, setAlertaMensaje] = useState('');
  const [porVencer, setPorVencer] = useState(false);


  const onAceptar = () => {
    setEsMuestraCamposReq(false)
    setEsFin(false)
  };

  const onAceptarC = () => {
    setAlertaMensaje('')
  };


  const inicializaCampos = () => {
    //TODO LIMPIAR CADA FILTRO A SU VALOR INICIAL
    //setEsVerBaja(true)
    //setActivo(true)
    setTipoF(-1)
    setAreaF(-1)
    setEstatusF(-1)
    setColoniaF(-1)
    //setIdAlcaldia(1)
    setInicioF(null)
    setFinF(null)


  };



  /* useEffect(() => {
    var apiUrl = 'http://localhost:3000/ConsultarCombo?psSpSel=%22ConsultarTipoIncidenciaCmb%22';
    axios.get(apiUrl)
      .then(response => {
        setDatosTipo(response.data)
      }
      )
      .catch(error => console.error('Error al obtener Tipo Incidencia', error));

    apiUrl = config.apiUrl + '/ConsultarCombo?psSpSel=%22ConsultarAreaCmb%22';
    axios.get(apiUrl)
      .then(response => {
        setDatosArea(response.data)
      }
      )
      .catch(error => console.error('Error al obtener área de incidencia', error));

    apiUrl = config.apiUrl + '/ConsultarCombo?psSpSel=%22ConsultarEstatusIncidenciaCmb%22';
    axios.get(apiUrl)
      .then(response => {
        setDatosEstatus(response.data)
      }
      )
      .catch(error => console.error('Error al obtener Estatus de incidencia', error));

    apiUrl = config.apiUrl + '/ConsultarCombo?psSpSel=%22ConsultarColoniaCmb%22';
    axios.get(apiUrl)
      .then(response => {
        setDatosColonia(response.data)
      }
      )
      .catch(error => console.error('Error al obtener colonia', error));

  }, []); */

  useEffect(() => {
    // Cambia la URL a la de tu API
    //console.log({ idAlcaldia })
    const apiUrl = config.apiUrl + '/ConsultarIncidencia';
    if (esEditar) return//sale si es modo edicion
    axios.get(apiUrl, { params: { pnIdAlcaldia: idAlcaldia } })
      .then(response => { setDatosIncidencia(response.data); setDatosIncidenciaBd(response.data) })
      .catch(error => console.error('Error al obtener datos:', error))
      .finally(() => {
        inicializaCampos()
        //console.log('Datos Incidencia:', datosIncidencia)
      });
  }, [esEditar]);  // useEffect se ejecuta cuando se modifica la propiedad esEditar



  const filtraLocal = () => {

    // TODO IR FILTRANDO LOCALMENTE CAMPO POR CAMPO SIN IR A BASE DE DATOS
    var datosFiltrados = datosIncidenciaBd;
    /*datosFiltrados = idAlcaldia > 0 ? datosFiltrados.filter(item => item.IdAlcaldia == idAlcaldia) : datosFiltrados;
    datosFiltrados = tipoF > 0 ? datosFiltrados.filter(item => item.IdTipoIncidencia == tipoF) : datosFiltrados;
    datosFiltrados = coloniaF > 0 ? datosFiltrados.filter(item => item.IdColonia == coloniaF) : datosFiltrados;
    datosFiltrados = areaF > 0 ? datosFiltrados.filter(item => item.IdArea == areaF) : datosFiltrados;
    datosFiltrados = estatusF > 0 ? datosFiltrados.filter(item => item.IdEstatusIncidencia == estatusF) : datosFiltrados;
    datosFiltrados = nombreF != '' ? datosFiltrados.filter(item => item.Nombre == nombreF) : datosFiltrados;*/
    //datosFiltrados = nombreF != '' ? datosFiltrados.filter(item => item.Nombre.slice(0, nombreF.length).toLowerCase() === nombreF.toLowerCase()) : datosFiltrados;
    //datosFiltrados = nombreF != '' ? datosFiltrados.filter(item => item.Nombre.toLowerCase().includes(nombreF.toLowerCase())) : datosFiltrados;
    datosFiltrados = porVencer ? datosFiltrados.filter(item => item.FechaEstimada == today) : datosFiltrados;
    console.log(porVencer, today)
    const result = differenceInYears(new Date(finF), new Date(inicioF));
    //console.log(inicioF, '-', finF, '-', result);
    //Al seleccionar borrar la fecha el valor es de dos espacios
    if (inicioF == null || finF == null || inicioF == '' || finF == '' || inicioF == '  ' || finF == '  ') {
      setDatosIncidencia(datosFiltrados);
      return
    } else if (finF < inicioF) {
      setAlertaMensaje('El periodo final no debe ser menor al periodo inicial ');
      setDatosIncidencia(datosFiltrados);
      //setFinF(inicioF)
      return
    } else if (result >= 1) {
      setAlertaMensaje('El periodo no debe ser mayor a un año');
      setDatosIncidencia(datosFiltrados);
      return
    } else if (isNaN(result)) {
      setDatosIncidencia(datosFiltrados);
      return
    }

    datosFiltrados = inicioF != null || inicioF != '' ? datosFiltrados.filter(item => item.FechaReporte >= inicioF) : datosFiltrados;
    datosFiltrados = finF != null || finF != '' ? datosFiltrados.filter(item => item.FechaReporte < finF + 1) : datosFiltrados;

    setDatosIncidencia(datosFiltrados);

  };

  useEffect(() => {
    filtraLocal()
  }, [idAlcaldia, inicioF, finF, porVencer/*,tipoF,  estatusF, nombreF, areaF, coloniaF*/]); //Se invoca al interactuar con los filtros arriba del grid

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

  const columns = [
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
    {
      header: 'IdAlcaldia',
      accessorKey: 'IdAlcaldia',
      footer: 'IdAlcaldia'
      , visible: false
    },
    {
      header: 'Folio',
      accessorKey: 'IdIncidencia',
      footer: 'Folio'
      , visible: true
    },
    {
      header: 'Tipo',
      accessorKey: 'IdTipoIncidencia',
      footer: 'Tipo'
      , visible: false
    },
    {
      header: 'Tipo',
      accessorKey: 'TipoIncidencia',
      footer: 'Tipo'
      , visible: true
    },
    {
      header: 'Descripción',
      accessorKey: 'Descripcion',
      footer: 'Descripción'
      , visible: true
    },
    {
      header: 'Nombre',
      accessorKey: 'Nombre1',
      footer: 'Nombre'
      , visible: true
    },
    {
      header: 'Teléfono',
      accessorKey: 'Telefono',
      footer: 'Teléfono'
      , visible: true
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
      , visible: true
    },
    {
      header: 'Area',
      accessorKey: 'IdArea',
      footer: 'Area'
      , visible: false
    },
    {
      header: 'Area',
      accessorKey: 'Area',
      footer: 'Area'
      , visible: true
    },
    {
      header: 'Estatus',
      accessorKey: 'IdEstatusIncidencia',
      footer: 'Estatus'
      , visible: false
    },
    {
      header: 'Estatus',
      accessorKey: 'EstatusIncidencia',
      footer: 'Estatus'
      , visible: true
    },
    {
      header: 'Prioridad',
      accessorKey: 'IdPrioridadIncidencia',
      footer: 'Prioridad'
      , visible: false
    },
    {
      header: 'Prioridad',
      accessorKey: 'PrioridadIncidencia',
      footer: 'Prioridad'
      , visible: true
    },
    {
      header: 'Fecha de Reporte',
      accessorKey: 'FechaReporte',
      footer: 'Fecha de Reporte'
      , cell: ({ getValue }) => (isNaN(getValue()) ? getValue() : '')
      , visible: true
    },
    {
      header: 'Fecha Estimada',
      accessorKey: 'FechaEstimada',
      footer: 'Fecha Estimada'
      , cell: ({ getValue }) => (isNaN(getValue()) ? getValue() : '')
      , visible: true
    },
    {
      header: 'Nombre',
      accessorKey: 'Nombre2',
      footer: 'Nombre'
      , visible: false
    },
    {
      header: 'ApellidoPaterno',
      accessorKey: 'ApellidoPaterno',
      footer: 'ApellidoPaterno'
      , visible: false
    },
    {
      header: 'ApellidoMaterno',
      accessorKey: 'ApellidoMaterno',
      footer: 'ApellidoMaterno'
      , visible: false
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
    setEsEditar(true)
    setEsNuevo(true)

    const data = {
      esNuevo: true
      //idAlcaldia: idAlcaldia,

    };

    navigate("/ReporteIncidencia", { state: data });

  };

  const handleEdit = (rowData) => {
    setEsEditar(true)
    //setAccion(0)//0 para MODIF 1 para nuevo

    const data = {
      esNuevo: false,
      idAlcaldia: rowData.original.IdAlcaldia,
      idIncidencia: rowData.original.IdIncidencia,
      idArea: rowData.original.IdArea,
      idPrioridadIncidencia: rowData.original.IdPrioridadIncidencia,
      descripcion: rowData.original.Descripcion,
      idTipoIncidencia: rowData.original.IdTipoIncidencia,

      idEstatusIncidencia: rowData.original.IdEstatusIncidencia,
      fechaEstimada: rowData.original.FechaEstimada,
      fechaReporte: rowData.original.FechaReporte,

      telefono: rowData.original.Telefono,
      correo: rowData.original.Correo,
      idColonia: rowData.original.IdColonia,

      nombre: rowData.original.Nombre2,
      apellidoPaterno: rowData.original.ApellidoPaterno,
      apellidoMaterno: rowData.original.ApellidoMaterno,

      calle: rowData.original.Calle,
      numero: rowData.original.Numero,
      codigoPostal: rowData.original.CodigoPostal,

    };
    navigate("/ReporteIncidencia", { state: data });
    //navigate("/AsignarAreayPrioridadIncidencia", { state: data });


  };

  return (
    <div>
      <SideBarHeader titulo={esNuevo ? 'Nueva Incidencia' : esEditar ? 'Editar Incidencia' : 'Consulta de Incidencias'}></SideBarHeader>
      <br /><br /><br /><br />
      {/* {!esEditar ? */}
      <>
        {/*<button type="button" className="btn btn-primary" onClick={nuevo}>Nuevo</button>*/}
        <h2>Alcalde 360 - !Cercanía con la gente a través de un click!</h2>
        {<ElementoCampo type='checkbox' lblCampo="Por vencer:" claCampo="porVencer" nomCampo={porVencer} onInputChange={setPorVencer} />}

        {/*
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ flexGrow: 1 }}>
            <ElementoCampo type="select" lblCampo="Tipo: " claCampo="campo" nomCampo={tipoF} options={datosTipo} onInputChange={setTipoF} />

          </span>
          <span style={{ flexGrow: 0.5 }}>
            <h2></h2>
          </span>
          <span style={{ flexGrow: 1 }}>
            <ElementoCampo type="select" lblCampo="Área: " claCampo="campo" nomCampo={areaF} options={datosArea} onInputChange={setAreaF} />

          </span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ flexGrow: 1 }}>

            <ElementoCampo type="select" lblCampo="Colonia: " claCampo="campo" nomCampo={coloniaF} options={datosColonia} onInputChange={setColoniaF} />

          </span>
          <span style={{ flexGrow: .5 }}>
            <h2></h2>
          </span>
          <span style={{ flexGrow: 1 }}>
            <ElementoCampo type="select" lblCampo="Estatus: " claCampo="campo" nomCampo={estatusF} options={datosEstatus} onInputChange={setEstatusF} />
            

          </span>
        </div>
        */}
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
        </div>

        {/*<p>Parrafo temporal para ver parametros|@Alcaldia={idAlcaldia}|@Incidencia={idIncidencia}|@Tipo={tipoF}|@Area={areaF}|@Inicio={inicioF}|@Fin={finF}|@Colonia={coloniaF}</p>*/}
        <SimpleTable data={datosIncidencia} columns={columns} handleEdit={handleEdit} handleNuevo={nuevo} />


      </>
      {/*}:
        <>
          <form onSubmit={guardarArbitro}>
            <br />
            <ElementoBotones cancelar={cancelar}></ElementoBotones>
            <div>
              {userProfileImage ? (
                // Mostrar la imagen si los datos están disponibles
                <ElementoImagen hexData={userProfileImage}></ElementoImagen>
              ) : (
                // Mostrar un mensaje de carga mientras se obtienen los datos
                <p>Cargando imagen...</p>
              )}
            </div>

            <div className='container mt-2'>
              <div className='card p-3'>
                <div className='row'>
                  <div className='col-7'>
                    <input type='file' className='form-control' name="profile_pic" onChange={selectedFotoHandler} accept=".png, .jpg, .jpeg" />
                  </div>

                  <div className='col-3'>
                    <button type='button' onClick={guardarFoto} className='btn btn-primary col-12'>Cargar imagen</button>
                  </div>
                </div>
              </div>
            </div>

            <br />
            
            <ElementoCampo type='text' lblCampo="Nombre* :" claCampo="Nombre" onInputChange={setNombre} nomCampo={nombre} />
            <ElementoCampo type='text' lblCampo="Telefono* :" claCampo="Telefono" onInputChange={setTelefono} nomCampo={telefono} />
            <ElementoCampo type='text' lblCampo="Curp* :" claCampo="Curp" onInputChange={setCurp} nomCampo={curp} />
            <ElementoCampo type='number' lblCampo="Juegos Arbitrados* :" claCampo="JuegosArbitrados" nomCampo={juegosArbitrados} onInputChange={setJuegosArbitrados} />
            <ElementoCampo type="select" lblCampo="País*: " claCampo="campo" nomCampo={idPais} options={datosPais} onInputChange={setIdPais} />
            <ElementoCampo type="select" lblCampo="Estado*: " claCampo="campo" nomCampo={idEstado} options={datosEstado} onInputChange={setIdEstado} />
            <ElementoCampo type="select" lblCampo="Municipio*: " claCampo="campo" nomCampo={idMunicipio} options={datosMunicipio} onInputChange={setIdMunicipio} />
            <ElementoCampo type='checkbox' lblCampo="Activo :" claCampo="activo" nomCampo={activo} onInputChange={setActivo} />

            
          </form>
        </>
      }*/}
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

export default FrmConsultaIncidencia;
