import React, { useEffect, useState } from 'react';
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

export const FrmConsultaIncidencia = (Route) => {
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
  const [inicioF, setInicioF] = useState();
  const [finF, setFinF] = useState();
  const navigate = useNavigate();

  const [esEditar, setEsEditar] = useState(false);
  const [esNuevo, setEsNuevo] = useState(false);
  const [esFin, setEsFin] = useState(false);


  //datos de registro
  const [idAlcaldia, setIdAlcaldia] = useState(1);
  const [idIncidencia, setIdIncidencia] = useState(0);

  const [esMuestraCamposReq, setEsMuestraCamposReq] = useState(false);
  const [alertaMensaje, setAlertaMensaje] = useState('');

  const onAceptar = () => {
    setEsMuestraCamposReq(false)
    setEsFin(false)
  };


  const inicializaCampos = () => {
    //TODO LIMPIAR CADA FILTRO A SU VALOR INICIAL
    //setEsVerBaja(true)
    setActivo(true)
    setTipoF(-1)
    setAreaF(-1)
    setEstatusF(-1)
    setColoniaF(-1)
    setIdAlcaldia(1)
    //console.log({ idAlcaldia })
    /*

    setAccion(0)//0 para MODIF 1 para nuevo
    setEsFin(false)
    /*setUserProfileImage('')
    setFotografia(null)*/

  };

  const cancelar = () => {
    inicializaCampos()
    setEsEditar(false)
    setEsNuevo(false)
  };
  const nuevo = () => {
    inicializaCampos()
    setEsEditar(true)
    setEsNuevo(true)
    setAccion(1)
  };

  useEffect(() => {
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


  }, []);

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
        console.log('Datos Incidencia:', datosIncidencia)
      });
  }, [esEditar]);  // useEffect se ejecuta cuando se modifica la propiedad esEditar



  const filtraLocal = () => {

    // TODO IR FILTRANDO LOCALMENTE CAMPO POR CAMPO SIN IR A BASE DE DATOS
    var datosFiltrados = datosIncidenciaBd
    //datosFiltrados = !esVerBaja ? datosIncidenciaBd.filter(item => item.ActivoChk) : datosIncidenciaBd;
    datosFiltrados = idAlcaldia > 0 ? datosFiltrados.filter(item => item.IdAlcaldia == idAlcaldia) : datosFiltrados;
    datosFiltrados = tipoF > 0 ? datosFiltrados.filter(item => item.IdTipoIncidencia == tipoF) : datosFiltrados;
    datosFiltrados = areaF > 0 ? datosFiltrados.filter(item => item.IdArea == areaF) : datosFiltrados;
    datosFiltrados = estatusF > 0 ? datosFiltrados.filter(item => item.IdEstatusIncidencia == estatusF) : datosFiltrados;
    datosFiltrados = nombreF != '' ? datosFiltrados.filter(item => item.Nombre == nombreF) : datosFiltrados;
    //datosFiltrados = nombreF != '' ? datosFiltrados.filter(item => item.Nombre.slice(0, nombreF.length).toLowerCase() === nombreF.toLowerCase()) : datosFiltrados;
    //datosFiltrados = nombreF != '' ? datosFiltrados.filter(item => item.Nombre.toLowerCase().includes(nombreF.toLowerCase())) : datosFiltrados;
    datosFiltrados = inicioF != null ? datosFiltrados.filter(item => item.FechaReporte >= inicioF) : datosFiltrados;
    datosFiltrados = finF != null ? datosFiltrados.filter(item => item.FechaReporte <= finF) : datosFiltrados;

    setDatosIncidencia(datosFiltrados);
  };

  useEffect(() => {
    filtraLocal()
  }, [tipoF, idAlcaldia, estatusF, nombreF, areaF, inicioF, finF]); //Se invoca al interactuar con los filtros arriba del grid


  const columns = [
    {
      header: 'IdAlcaldia',
      accessorKey: 'IdAlcaldia',
      footer: 'IdAlcaldia'
      , visible: true
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
      , visible: true
    },
    {
      header: 'Descripción',
      accessorKey: 'Descripcion1',
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
      , visible: true
    },
    {
      header: 'Fecha',
      accessorKey: 'FechaReporte',
      footer: 'Fecha'
      , cell: ({ getValue }) => (isNaN(getValue()) ? getValue() : '')
      , visible: true
    },
    {
      header: 'Asignar',
      accessorKey: 'Link',
      footer: 'Asignar'
      , visible: true
    },
    /*{
      header: 'IdMunicipio',
      accessorKey: 'IdMunicipio',
      footer: 'IdMunicipio'
      , visible: false
    },
    {
      header: 'Activo',
      accessorKey: 'ActivoChk',
      footer: 'Activo'
      , visible: true
    },*/
  ];


  const handleEdit = (rowData) => {
    setEsEditar(true)
    setAccion(0)//0 para MODIF 1 para nuevo
    setIdAlcaldia(rowData.original.IdAlcaldia)
    setIdIncidencia(rowData.original.IdIncidencia)
    //console.log(idIncidencia)
    //console.log('IdBuena:', rowData.original.IdIncidencia)

    const data = {
      idAlcaldia: rowData.original.IdAlcaldia,
      idIncidencia: rowData.original.IdIncidencia,
      descripcion: rowData.original.Descripcion1
    };

    navigate("/Prueba", { state: data });

  };

  return (
    <div>
      <SideBarHeader titulo={esNuevo ? 'Nueva Incidencia' : esEditar ? 'Editar Incidencia' : 'Consulta de Incidencias'}></SideBarHeader>
      <br /><br /><br /><br />
      {/* {!esEditar ? */}
      <>
        {/*<button type="button" className="btn btn-primary" onClick={nuevo}>Nuevo</button>*/}
        <h2>Alcalde 360 - !Cercanía con la gente a través de un click!</h2>
        {/*  <ElementoCampo type='checkbox' lblCampo="Ver Inactivos:" claCampo="activo" nomCampo={esVerBaja} onInputChange={setEsVerBaja} />*/}


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
          <span style={{ flexGrow: 2 }}>

            <ElementoCampo type="select" lblCampo="Colonia: " claCampo="campo" nomCampo={coloniaF} options={datosColonia} onInputChange={setColoniaF} />

          </span>
          <span style={{ flexGrow: .5 }}>
            <h2></h2>
          </span>
          <span style={{ flexGrow: 1 }}>
            <ElementoCampo type="select" lblCampo="Estatus: " claCampo="campo" nomCampo={estatusF} options={datosEstatus} onInputChange={setEstatusF} />
            {/*<ElementoCampo type="text" lblCampo="Nombre: " claCampo="campo" nomCampo={nombreF} onInputChange={setNombreF} />*/}

          </span>
        </div>

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


        <p>Parrafo temporal para ver parametros|@Alcaldia={idAlcaldia}|@Incidencia={idIncidencia}|@Tipo={tipoF}|@Area={areaF}|@Inicio={inicioF}|@Fin={finF}|</p>
        <SimpleTable data={datosIncidencia} columns={columns} esOcultaBotonNuevo={true} handleEdit={handleEdit} />
        {/* <SimpleTable data={datosIncidencia} columns={columns} handleEdit={handleEdit} handleNuevo={nuevo} /> */}

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
      {esMuestraCamposReq &&
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
    </div>
  );
}

export default FrmConsultaIncidencia;
