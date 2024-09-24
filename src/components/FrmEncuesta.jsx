
import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import SimpleTable from './SimpleTable';
import { ElementoCampo } from './ElementoCampo';
import { ElementoBotones } from './ElementoBotones';
import { SideBarHeader } from './SideBarHeader';
import config from '../config'; // archivo configs globales del proy
import { useNavigate } from 'react-router-dom';
import { ElementoToastNotification } from './ElementoToastNotification';
import { PerfilContext } from './PerfilContext'; // Importa el contexto

//TIP: TENER SIEMPRE PRENDIDO EL INSPECTOR WEB (CONSOLA) EN EL NAVEGADOR PARA VER TODOS LOS ERRORES EN VIVO 
const FrmEncuesta = () => {
  const { perfil, esConLicencia, idAlcaldia } = useContext(PerfilContext);
  const [datosEncuestaBD, setDatosEncuestaBD] = useState([]);
  const [datosEncuesta, setDatosEncuesta] = useState([]);
  const [datosEncuestaPreguntaBD, setDatosEncuestaPreguntaBD] = useState([]);
  const [datosEncuestaPregunta, setDatosEncuestaPregunta] = useState([]);
  //Filtros
  const [esVerBaja, setEsVerBaja] = useState(false);
  const [esVerCamposFiltro, setEsVerCamposFiltro] = useState(false);

  //pais estado municipo
  const [datosP1, setDatosP1] = useState([]);
  const [datosP2, setDatosP2] = useState([]);
  const [datosP3, setDatosP3] = useState([]);
  const [datosP4, setDatosP4] = useState([]);
  // const [datosPais, setDatosPais] = useState([]);
  // const [datosPaisBD, setDatosPaisBD] = useState([]);//se guarda en otro arreglo para filtrarlo localmente
  // const [datosEstado, setDatosEstado] = useState([]);
  // const [datosEstadoBD, setDatosEstadoBD] = useState([]);//se guarda en otro arreglo para filtrarlo localmente
  // const [datosMunicipio, setDatosMunicipio] = useState([]);
  // const [datosMunicipioBD, setDatosMunicipioBD] = useState([]);//se guarda en otro arreglo para filtrarlo localmente
  //>
  const [esEditar, setEsEditar] = useState(false);
  const [esNuevo, setEsNuevo] = useState(false);
  const [esFin, setEsFin] = useState(false);


  //datos de registro
  const [accion, setAccion] = useState(0);

  //DatosPantalla
  const [activo, setActivo] = useState(false);
  const [claEncuesta, setClaEncuesta] = useState(-1);
  const [claTipoEncuesta, setClaTipoEncuesta] = useState(1);
  const [idIncidencia, setIdIncidencia] = useState(1);
  const [v1, setV1] = useState(-1);
  const [v2, setV2] = useState(-1);
  const [v3, setV3] = useState(-1);
  const [v4, setV4] = useState(-1);
  // const [ligaRepresentante, setLigaRepresentante] = useState('');
  // const [ligaTelefono, setLigaTelefono] = useState('');
  // const [ligaCorreo, setLigaCorreo] = useState('');
  // const [ligaPais, setLigaPais] = useState(-1);
  // const [ligaEstado, setLigaEstado] = useState(-1);
  // const [ligaMunicipio, setLigaMunicipio] = useState(-1);
  // const [ligaPaisF, setLigaPaisF] = useState(1);
  // const [ligaEstadoF, setLigaEstadoF] = useState(-1);
  // const [ligaMunicipioF, setLigaMunicipioF] = useState(-1);

  const [esMuestraCamposReq, setEsMuestraCamposReq] = useState(false);
  const [esMuestraConfirmacion, setEsMuestraConfirmacion] = useState(false);
  const [alertaMensaje, setAlertaMensaje] = useState('');

  // const history = useHistory();
  // const navigate = useNavigate();

  const onAceptar = () => {
    setEsMuestraCamposReq(false)
    setEsMuestraConfirmacion(false)
    setEsFin(false)

    inicializaCampos()
    setEsEditar(false)
    setEsNuevo(false)

  };
  const onAceptarB = () => {
    setEsMuestraCamposReq(false)
    setEsMuestraConfirmacion(false)
    setEsFin(false)
  };

  const onAceptarC = () => {
    setAlertaMensaje('')
  };


  const guardarEncuesta = async (e) => {
    e.preventDefault();

    const data = {
      pnIdAlcaldia: idAlcaldia,
      pnIdIncidencia: idIncidencia,
      pnClaEncuesta: claEncuesta,
      pnClaTipoEncuesta: 1,
      psv1: v1,
      psv2: v2,
      psv3: v3,
      psv4: v4,
      pnActivo: activo,
      pnAccion: accion,
    };
    const apiReq = config.apiUrl + '/GuardarEncuesta';
    try {

      // if (ligaNombre.trim() === '') { setEsMuestraCamposReq(true); return }
      if (!v1 > 0) { setEsMuestraCamposReq(true); return }
      if (!v2 > 0) { setEsMuestraCamposReq(true); return }
      if (!v3 > 0) { setEsMuestraCamposReq(true); return }
      if (!v4 > 0) { setEsMuestraCamposReq(true); return }

      console.log('Guardando Encuesta', data);
      await axios.post(apiReq, { data }, { 'Access-Control-Allow-Origin': '*' })
        .then(response => {
          if (!response.data == '') {
            console.log('REGRESA ERROR:')
            if (response.data.originalError === undefined) {
              console.log(response.data)
              setAlertaMensaje(response.data)
            }
            else {
              console.log(response.data.originalError.info.message)
              setAlertaMensaje(response.data.originalError.info.message)
            }
          } else {
            console.log('guardo correctamente')
            setEsFin(true)
          }
        })


    } catch (error) {
      console.error('Error al guardar Encuesta', error);
    }

  };


  const inicializaCampos = () => {
    // console.log('Inicializa')
    setEsVerBaja(true)
    //Campos 
    setClaEncuesta(1)
    setV1(-1)
    setV2(-1)
    setV3(-1)
    setV4(-1)
    //DatosPantalla
    setIdIncidencia(-1)

    setActivo(true)
    setAccion(0)
    setEsFin(false)
  };
  const cancelar = () => {
    inicializaCampos()
    setEsEditar(false)
    setEsNuevo(false)
  };
  const nuevo = () => {
    // console.log('nuevo')
    inicializaCampos()
    setEsEditar(true)
    setEsNuevo(true)
    setAccion(1)//0 para MODIF 1 para nuevo
  };

  //DEPENDENCIA DE COMBOS
  // const handlePais = (value, claPais) => {//limpia combos hijo 
  //   setLigaPaisF(value)
  //   setLigaEstado(-1)
  //   setLigaMunicipio(-1)
  // };
  // const handleEstado = (value, claEstado) => {//limpia combos hijo 
  //   setLigaEstadoF(value)
  //   setLigaMunicipio(-1)
  // };
  // const handleMunicipio = (value, claMunicipio) => {//limpia combos hijo 
  //   setLigaMunicipioF(value)
  // };


  // const filtraLocalCombo = (pais, estado) => {
  //   // console.log(pais)

  //   var datosFiltrados = datosEstadoBD
  //   datosFiltrados = pais > 0 ? datosFiltrados.filter(item => item.IdPais == pais) : [];
  //   // console.log(datosFiltrados)
  //   setDatosEstado(datosFiltrados);

  //   datosFiltrados = datosMunicipioBD
  //   datosFiltrados = estado > 0 ? datosFiltrados.filter(item => item.IdPais == pais && item.IdEstados == estado) : [];
  //   // console.log(datosFiltrados)
  //   setDatosMunicipio(datosFiltrados);
  // }
  const filtraLocal = () => {
    console.log('Filtra Local...')
    // filtraLocalCombo(ligaPaisF, ligaEstadoF)//Asigna la Dependencia de combos 
    var datosFiltrados = datosEncuestaBD
    datosFiltrados = !esVerBaja ? datosEncuestaBD.filter(item => item.ActivoChk) : datosEncuestaBD;
    datosFiltrados = idAlcaldia > 0 ? datosFiltrados.filter(item => item.idAlcaldia == idAlcaldia) : datosFiltrados;
    // datosFiltrados = ligaPaisF > 0 ? datosFiltrados.filter(item => item.IdPais == ligaPaisF) : datosFiltrados;
    // datosFiltrados = ligaEstadoF > 0 ? datosFiltrados.filter(item => item.IdEstado == ligaEstadoF) : datosFiltrados;
    // datosFiltrados = ligaMunicipioF > 0 ? datosFiltrados.filter(item => item.IdMunicipio == ligaMunicipioF) : datosFiltrados;
    setDatosEncuesta(datosFiltrados);

    datosFiltrados = datosEncuestaPreguntaBD
    datosFiltrados = !esVerBaja ? datosEncuestaPreguntaBD.filter(item => item.ActivoChk) : datosFiltrados;
    datosFiltrados = claTipoEncuesta > 0 ? datosEncuestaPreguntaBD.filter(item => item.claTipoEncuesta == 1) : datosFiltrados;
    setDatosEncuestaPregunta(datosEncuestaPreguntaBD);

    // console.log(datosEncuestaPreguntaBD)
  };

  //-------------------------------------------------------------------SECCION USE EFFFECT
  // llena arreglos de combos
  useEffect(() => {
    var apiUrl = config.apiUrl + '/ConsultarCombo?psSpSel=%22ConsultarPregunta1Cmb%22';
    axios.get(apiUrl)
      .then(response => {
        setDatosP1(response.data)
      }
      )
      .catch(error => console.error('Error al obtener P1', error));

    apiUrl = config.apiUrl + '/ConsultarCombo?psSpSel=%22ConsultarPregunta2Cmb%22';
    axios.get(apiUrl)
      .then(response => {
        setDatosP2(response.data)
      }
      )
      .catch(error => console.error('Error al obtener P2', error));

    apiUrl = config.apiUrl + '/ConsultarCombo?psSpSel=%22ConsultarPregunta3Cmb%22';
    axios.get(apiUrl)
      .then(response => {
        setDatosP3(response.data)
      }
      )
      .catch(error => console.error('Error al obtener P3', error));

    apiUrl = config.apiUrl + '/ConsultarCombo?psSpSel=%22ConsultarPregunta4Cmb%22';
    axios.get(apiUrl)
      .then(response => {
        setDatosP4(response.data)
      }
      )
      .catch(error => console.error('Error al obtener P4', error));


  }, []);// se ejecuta 1 vez al inicio solamente

  //Carga desde BD
  useEffect(() => {
    if (esEditar) return//sale si es modo edicion
    // console.log('Carga desde BD...')


    const cargarDatos = async () => {
      try {
        console.log('Carga desde BD...');
        let apiUrl = config.apiUrl + '/ConsultarGrid?psSpSel=%22BuscarEncuesta%22';
        const responseEncuesta = await axios.get(apiUrl);
        setDatosEncuestaBD(responseEncuesta.data);

        apiUrl = config.apiUrl + '/ConsultarGrid?psSpSel=%22BuscarEncuestaPregunta%22';
        const responsePregunta = await axios.get(apiUrl);
        setDatosEncuestaPreguntaBD(responsePregunta.data);

        inicializaCampos();
      } catch (error) {
        console.error('Error al obtener datos:', error);
      }
    };


    // var apiUrl = config.apiUrl + '/ConsultarGrid?psSpSel=%22BuscarEncuesta%22';
    // axios.get(apiUrl)
    //   .then(response => {
    //     setDatosEncuestaBD(response.data);
    //   })
    //   .catch(error => console.error('Error al obtener datos:', error))
    //   .finally(() => {
    //     inicializaCampos()
    //   });
    // apiUrl = config.apiUrl + '/ConsultarGrid?psSpSel=%22BuscarEncuestaPregunta%22';
    // axios.get(apiUrl)
    //   .then(response => {
    //     setDatosEncuestaPreguntaBD(response.data);
    //   })
    //   .catch(error => console.error('Error al obtener datos:', error))
    //   .finally(() => {
    //     inicializaCampos()
    //   });

      cargarDatos();
  }, [esEditar]); // Se EJECUTA CUANDO CAMBIA la bandera esEditar

  useEffect(() => {
    if (datosEncuestaPregunta.length > 0) {
      // console.log('Datos de Encuesta Pregunta:', datosEncuestaPreguntaBD[0].NomPregunta);
      console.log(datosEncuestaPregunta)
    }
  }, [datosEncuestaPregunta]);

  // useEffect(() => {
  //   filtraLocalCombo(ligaPaisF, ligaEstadoF)
  // }, [ligaPaisF, ligaEstadoF, ligaMunicipioF]);//Se llama al modificar el combo liga modo edicion/nuevo
  // useEffect(() => {
  //   filtraLocalCombo(ligaPais, ligaEstado)
  // }, [ligaPais, ligaEstado, ligaMunicipio]);//Se llama al modificar el combo liga modo edicion/nuevo


  useEffect(() => {
    filtraLocal()
  }, [esVerBaja]); //Se invoca al interactuar con los filtros arriba del grid
  // }, [esVerBaja, ligaPaisF, ligaEstadoF, ligaMunicipioF, datosLigaBD]); //Se invoca al interactuar con los filtros arriba del grid



  const columns = [
    {
      header: 'IdAlcaldia',
      accessorKey: 'IdAlcaldia',
      footer: 'IdAlcaldia'
      , visible: false
    },
    {
      header: 'Nombre',
      accessorKey: 'IdIncidencia',
      footer: ''
      , visible: true
    },
    {
      header: 'Id Encuesta',
      accessorKey: 'ClaEncuesta',
      footer: ''
      , visible: true
    },
    {
      header: 'Tipo Encuesta',
      accessorKey: 'ClaTipoEncuesta',
      footer: ''
      , visible: true
    },
    {
      header: 'valor1',
      accessorKey: 'valor1',
      footer: ''
      , visible: true
    },
    {
      header: 'valor2',
      accessorKey: 'valor2',
      footer: ''
      , visible: true
    },
    {
      header: 'valor3',
      accessorKey: 'valor3',
      footer: ''
      , visible: true
    },
    {
      header: 'valor4',
      accessorKey: 'valor4',
      footer: ''
      , visible: true
    }
  ];



  const handleEdit = (rowData, cellId) => {
    // console.log(cellId)
    setEsEditar(true)

    setIdIncidencia(rowData.original.idIncidencia)
    setClaEncuesta(rowData.original.claEncuesta)
    setClaTipoEncuesta(rowData.original.claTipoEncuesta)
    setV1(rowData.original.v1)
    setV2(rowData.original.v2)
    setV3(rowData.original.v3)
    setV4(rowData.original.v4)
    if (rowData.original.ActivoChk == false) { setActivo(false) } else { setActivo(true) }
    setAccion(0)//0 para MODIF 1 para nuevo
  }

  return (
    <>
      <SideBarHeader titulo={esNuevo ? ('Nueva Encuesta') : esEditar ? 'Edita Encuesta' : 'Encuesta de Satisfacción Ciudadana'}></SideBarHeader>
      <br /><br /><br /><br />

      <div>
        {!esEditar ?//----------------------------MODO GRID pinta filtros al inicio
          <>
            <ElementoCampo type='checkbox' lblCampo="Ver filtros en Tabla:" claCampo="activo" nomCampo={esVerCamposFiltro} onInputChange={setEsVerCamposFiltro} />
            <ElementoCampo type='checkbox' lblCampo="Ver Inactivos :" claCampo="activo" nomCampo={esVerBaja} onInputChange={setEsVerBaja} />

            {/* <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ flexGrow: 1 }}>
                <ElementoCampo type="select" lblCampo="País: " claCampo="campo" nomCampo={ligaPaisF} options={datosPais} onInputChange={(value) => handlePais(value, ligaPaisF)} />
              </span>
              <span style={{ flexGrow: 1 }}>
                <h2></h2>
              </span>
              <span style={{ flexGrow: 1 }}>
                <ElementoCampo type="select" lblCampo="Estado: " claCampo="campo" nomCampo={ligaEstadoF} options={datosEstado} onInputChange={(value) => handleEstado(value, ligaEstadoF)} />
              </span>
            </div> 
            <ElementoCampo type="select" lblCampo="Municipio: " claCampo="campo" nomCampo={ligaMunicipioF} options={datosMunicipio} onInputChange={(value) => handleMunicipio(value, ligaMunicipioF)} />
            */}
            <SimpleTable data={datosEncuesta} columns={columns} handleEdit={handleEdit} handleNuevo={nuevo} />
          </>
          ://----------------------------MODO EDICION/NUEVO REGISTRO
          <div>
            <form onSubmit={guardarEncuesta}>
              <br />
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <ElementoBotones cancelar={cancelar}></ElementoBotones>
              </div>
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  {/* <span style={{ flexGrow: 1 }}>
                    <ElementoCampo type='text' lblCampo="Nombre* :" claCampo="nombre" onInputChange={setLigaNombre} nomCampo={ligaNombre} tamanioString="100" />
                    <ElementoCampo type='text' lblCampo="Representante :" claCampo="nombre" onInputChange={setLigaRepresentante} nomCampo={ligaRepresentante} tamanioString="100" />
                    <ElementoCampo type='tel' lblCampo="Telefono :" claCampo="nombre" onInputChange={setLigaTelefono} nomCampo={ligaTelefono} tamanioString="100" />
                    <ElementoCampo type='mail' lblCampo="Correo :" claCampo="nombre" onInputChange={setLigaCorreo} nomCampo={ligaCorreo} tamanioString="100" />
                  </span>
                  <span style={{ flexGrow: 1 }}>
                    <h2></h2>
                  </span>
                  <span style={{ flexGrow: 1 }}>
                    <ElementoCampo type="select" lblCampo="País*: " claCampo="campo" nomCampo={ligaPais} options={datosPais} onInputChange={setLigaPais} />
                    <ElementoCampo type="select" lblCampo="Estado*: " claCampo="campo" nomCampo={ligaEstado} options={datosEstado} onInputChange={setLigaEstado} />
                    <ElementoCampo type="select" lblCampo="Municipio*: " claCampo="campo" nomCampo={ligaMunicipio} options={datosMunicipio} onInputChange={setLigaMunicipio} />
                  </span> */}

                  {/* <ElementoCampo type="select" lblCampo={""+datosEncuestaPreguntaBD[0].NomPregunta+"*:"} claCampo="campo" nomCampo={v1} options={datosP1} onInputChange={setV1} /> */}
                  <ElementoCampo type="select" lblCampo={`${datosEncuestaPregunta[0].NomPregunta}*:`} claCampo="campo" nomCampo={v1} options={datosP1} onInputChange={setV1} />
                  <ElementoCampo type="select" lblCampo={`${datosEncuestaPregunta[1].NomPregunta}*:`} claCampo="campo" nomCampo={v2} options={datosP2} onInputChange={setV2} />
                  <ElementoCampo type="select" lblCampo={`${datosEncuestaPregunta[2].NomPregunta}*:`} claCampo="campo" nomCampo={v3} options={datosP3} onInputChange={setV3} />
                  <ElementoCampo type="select" lblCampo={`${datosEncuestaPregunta[3].NomPregunta}*:`} claCampo="campo" nomCampo={v4} options={datosP4} onInputChange={setV4} />

                </div>

                <ElementoCampo type='checkbox' lblCampo="Activo :" claCampo="activo" nomCampo={activo} onInputChange={setActivo} />
              </>


            </form>
          </div>
        }

        {esMuestraCamposReq &&
          // <AlertaEmergente
          //     titulo={'Alerta'}
          //     mensaje={'Los datos con * son requeridos, favor de validar.'}
          //     mostrarBotonAceptar={true}
          //     mostrarBotonCancelar={false}
          //     onAceptar={onAceptar}
          // ></AlertaEmergente>
          <ElementoToastNotification
            mensaje={'Los datos con * son requeridos, favor de validar.'}
            onAceptar={onAceptarB}
          ></ElementoToastNotification>
          // : <p></p>
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



      </div>
    </>
  );
};

export default FrmEncuesta;
