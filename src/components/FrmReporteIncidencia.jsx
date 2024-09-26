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
import { FcAlarmClock } from 'react-icons/fc';
import { FaBeer } from "react-icons/fa";
import { FaGrinAlt } from "react-icons/fa";
import { PerfilContext } from './PerfilContext'; // Importa el contexto

export const FrmReporteIncidencia = () => {
  
    const [datosTipoIncidencia, setDatosTipoIncidencia] = useState([]);
    const [datosColonia, setDatosColonia] = useState([]);

    const [esEditar, setEsEditar] = useState(false);
    const [esNuevo, setEsNuevo] = useState(false);
    const [esFin, setEsFin] = useState(false);
    const [showPwd, setShowPwd] = useState(false)
    
      //datos de registro
     const [idAlcaldia, setIdAlcaldia] = useState(1);
     const [idIncidencia, setIdIncidencia] = useState(5);
     const [descripcion, setDescripcion] = useState('');
     const [idTipoIncidencia, setIdTipoIncidencia] = useState(0);
     const [nombre, setNombre] = useState('');
     const [apellidoPaterno, setApellidoPaterno] = useState('');
     const [apellidoMaterno, setApellidoMaterno] = useState('');
     const [telefono, setTelefono] = useState('');
     const [correo, setCorreo] = useState('');
     const [ubicacion, setUbicacion] = useState('');
     const [idColonia, setIdColonia] = useState(0);
     const [calle, setCalle] = useState('');
     const [numero, setNumero] = useState('');
     const [codigoPostal, setCodigoPostal] = useState('');
     const [idEstatusIncidencia, setIdEstatusIncidencia] = useState(0);
     const [idPrioridadIncidencia, setIdPrioridadIncidencia] = useState(0);
     const [idArea, setIdArea] = useState(0);
     const [fechaReporte, setFechaReporte] = useState(null);
     const [fechaEstimada, setFechaEstimada] = useState(null);
     const [fechaSolucion, setFechaSolucion] = useState(null);
     const [idUsuario, setIdUsuario] = useState(1);  //asigna temporalmente 1 hasta que tengamos una variable global de usuario para pasar este dato al SP

     const [evidencia1, setEvidencia1] = useState(null);
     const [evidencia2, setEvidencia2] = useState(null);
     const [evidencia3, setEvidencia3] = useState(null);
     const [userProfileImage1, setUserProfileImage1] = useState('');
     const [userProfileImage2, setUserProfileImage2] = useState('');
     const [userProfileImage3, setUserProfileImage3] = useState('');

     const [accion, setAccion] = useState(1);

     const [esMuestraCamposReq, setEsMuestraCamposReq] = useState(false);
     const [alertaMensaje, setAlertaMensaje] = useState('');

     const selectedFotoHandler1 = e => {
      console.log('ARCHIVO SELECCIONADO:')
      setEvidencia1(null)
      setUserProfileImage1('')
      setEvidencia1(e.target.files[0])

     };

     const selectedFotoHandler2 = e => {
      console.log('ARCHIVO SELECCIONADO:')
      setEvidencia2(null)
      setUserProfileImage2('')
      setEvidencia2(e.target.files[0])

     };

     const selectedFotoHandler3 = e => {
      console.log('ARCHIVO SELECCIONADO:')
      setEvidencia3(null)
      setUserProfileImage3('')
      setEvidencia3(e.target.files[0])

     };

     const guardarIncidenciaEvidencia = async (e) => {
          e.preventDefault();

          const apiReq = config.apiUrl + '/GuardarIncidenciaEvidencia';
          const formData = new FormData()
          formData.append('piEvidencia1', evidencia1)
          formData.append('piEvidencia2', evidencia2)
          formData.append('piEvidencia3', evidencia3)
          formData.append('pnIdAlcaldia', idAlcaldia)
          formData.append('pnIdIncidencia', idIncidencia)
          formData.append('pnIdUsuario', idUsuario)
          console.log('GUARDAR FOTOGRAFIA')
          
          if (!evidencia) {
              alert('Debe seleccionar un archivo')
              return
          }
          else if (evidencia.size > 1000000) {
              alert('El límite máximo del archivo es 1 MB. Favor de validar ')
              return
          }
          else {
              try {
                  const response = await axios.post(apiReq, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
                  console.log(response.status); // Esto mostrará 200 (status HTTP) si fué exitoso
                  setAlertaMensaje(response.data)
                                                   
              } catch (error) {               
                  if (!error.message == '') {
                      console.log('Error al guardar la evidencia:')
                      console.error(error);
                      setAlertaMensaje('Error al guardar la evidencia: ' + error.message)
                      
                  }
                  
              }
          }

          consultarIncidenciaEvidencia(1);
          consultarIncidenciaEvidencia(2);
          consultarIncidenciaEvidencia(3);

      };

      const onAceptar = () => {
        setEsMuestraCamposReq(false)
        setEsFin(false)
      };

      const onAceptarC = () => {
        setAlertaMensaje('')
      };

     const guardarIncidencia = async (e) => {
      e.preventDefault();

      if (idAlcaldia == 0) { setEsMuestraCamposReq(true); return }
      if (descripcion === null || descripcion.trim() == '') { setEsMuestraCamposReq(true); return }
      if (idTipoIncidencia == 0) { setEsMuestraCamposReq(true); return }
      if (nombre === null || nombre.trim() == '') { setEsMuestraCamposReq(true); return }
      if (apellidoPaterno === null || apellidoPaterno.trim() == '') { setEsMuestraCamposReq(true); return }
      if (apellidoMaterno === null || apellidoMaterno.trim() == '') { setEsMuestraCamposReq(true); return }
      if (telefono === null || telefono.trim() == '') { setEsMuestraCamposReq(true); return }
      if (idColonia == 0) { setEsMuestraCamposReq(true); return }
      if (calle === null || calle.trim() == '') { setEsMuestraCamposReq(true); return }
      if (numero === null || numero.trim() == '') { setEsMuestraCamposReq(true); return }
      if (codigoPostal === null || codigoPostal.trim() == '') { setEsMuestraCamposReq(true); return }
      if (idUsuario == 0) { setEsMuestraCamposReq(true); return }
            
  
      const data = {

        pnIdAlcaldia: idAlcaldia,        
        pnIdIncidencia: idIncidencia,
        psDescripcion: descripcion,
        pnIdTipoIncidencia: idTipoIncidencia,
        psNombre: nombre,
        psApellidoPaterno: apellidoPaterno,
        psApellidoMaterno: apellidoMaterno,
        psTelefono: telefono,
        psCorreo: correo,
        psUbicacion: ubicacion,
        pnIdColonia: idColonia,
        psCalle: calle,
        psNumero: numero,
        psCodigoPostal: codigoPostal,
        pnIdUsuario: idUsuario,   
        pnAccion: accion
      };
  
      const apiReq = 'http://localhost:3000/GuardarIncidencia';
      console.log('Guardando los datos.', data);

      try {
        
        await axios.post(apiReq, { data }, { 'Access-Control-Allow-Origin': '*' })
        .then(response => {    
          if (!response.data == '') {
              console.log('REGRESA ERROR:')
              if (response.data.originalError === undefined) {
                  console.log('response.data: ' + response.data)
                  setAlertaMensaje(response.data)
              }
              else {
                  console.log('response.data.originalError.info.message: ' + response.data.originalError.info.message)
                  setAlertaMensaje(response.data.originalError.info.message)
              }
          } else {
            guardarIncidenciaEvidencia()
            console.log('guardo correctamente')  
            inicializaCampos()
            setEsEditar(false)//regresa al grid
            setEsNuevo(false)
          }
        })
        
      } catch (error) {
        console.error('Error al guardar la Incidencia.', error);
      }
      

    };


    const inicializaCampos = () => {
            
      //Campos 
      setIdIncidencia(0)
      setDescripcion('')
      setIdTipoIncidencia(0)
      setNombre('')
      setApellidoPaterno('')
      setApellidoMaterno('')
      setTelefono('')
      setCorreo('')
      setUbicacion('')
      setIdColonia(0)
      setCalle('')
      setNumero('')
      setCodigoPostal('')
                
      setAccion(0)//0 para MODIF 1 para nuevo
      setEsFin(false)
      setUserProfileImage1('')
      setUserProfileImage2('')
      setUserProfileImage3('')
      setEvidencia1(null)
      setEvidencia2(null)
      setEvidencia3(null)

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
          setDatosTipoIncidencia(response.data)
        }
        )
        .catch(error => console.error('Error al obtener Tipo Incidencia', error));

      
        apiUrl = config.apiUrl + '/ConsultarColonias';
        axios.get(apiUrl, { params: { pnIdAlcaldia: idAlcaldia } })
          .then(response => {
            setDatosColonia(response.data)
          }
          )
          .catch(error => console.error('Error al obtener colonia', error));

       //Código temporal para cargar los controles en modo edición   
       setEsEditar(false)   
       setEsNuevo(true)   

    }, []);

      
    useEffect(() => {
      //Código temporal para cargar los controles en modo edición
      setIdIncidencia(5)
      setDescripcion('problemas con una luz en mi calle')
      setIdTipoIncidencia(2)
      setNombre('Arturo')
      setApellidoPaterno('Rodriguez')
      setApellidoMaterno('Abud')
      setTelefono('8121003020')
      setCorreo('arturo.rodriguez.abud@gmail.com')
      setUbicacion('')
      setIdColonia(5)
      setCalle('san josé')
      setNumero('7946')
      setCodigoPostal('87670')
                
      setAccion(1)//0 para MODIF 1 para nuevo


      consultarIncidenciaEvidencia(1);
      consultarIncidenciaEvidencia(2);
      consultarIncidenciaEvidencia(3);
    }, [esEditar]);

    const consultarIncidenciaEvidencia = (idEvidencia) => {
       // Cambia la URL a la de tu API
       const apiUrl = config.apiUrl + '/ConsultarIncidenciaEvidencia';
       //axios.get(apiUrl)
       if (idAlcaldia > 0 && idIncidencia > 0 && idEvidencia > 0) {
           
           axios.get(apiUrl, { 
              params: { 
                  pnIdAlcaldia: idAlcaldia, 
                  pnIdIncidencia: idIncidencia,
                  pnIdEvidencia: idEvidencia 
                } }
               , {
                   responseType: 'blob' // Indicar que esperamos una respuesta binaria
               })
               .then(response => {
                   // Convertir la respuesta binaria a una URL de objeto
                   
                   switch(idEvidencia) {
                    case 1:
                      setUserProfileImage1(response.data[0].HexadecimalData);
                      break;
                    case 2:
                      setUserProfileImage2(response.data[0].HexadecimalData);
                      break;
                    case 3:
                      setUserProfileImage3(response.data[0].HexadecimalData);
                      break;
                    default:
                      console.log('idEvidencia no es válido');
                      break;
                  }              

               })
               .catch(error => console.error('Error al obtener datos:', error))
       }
    };
    
       
  
  
    return (
      <div>
        <SideBarHeader titulo={esNuevo ? 'Reporte de Incidencia' : 'Editar Reporte de Incidencia' }></SideBarHeader>
        <br /><br /><br /><br />
            <form onSubmit={guardarIncidencia}>
              <br />
              <ElementoBotones cancelar={cancelar}></ElementoBotones>
              
              <br />
              <ElementoCampo type="select" lblCampo="Tipo*: " claCampo="campo" nomCampo={idTipoIncidencia} options={datosTipoIncidencia} onInputChange={setIdTipoIncidencia} />
              <ElementoCampo type='text' lblCampo="Descripción* :" claCampo="Descripcion" onInputChange={setDescripcion} nomCampo={descripcion}  />
              <ElementoCampo type='text' lblCampo="Nombre* :" claCampo="Nombre" onInputChange={setNombre} nomCampo={nombre}  />
              <ElementoCampo type='text' lblCampo="ApellidoPaterno* :" claCampo="ApellidoPaterno" onInputChange={setApellidoPaterno} nomCampo={apellidoPaterno}  />
              <ElementoCampo type='text' lblCampo="ApellidoMaterno* :" claCampo="ApellidoMaterno" onInputChange={setApellidoMaterno} nomCampo={apellidoMaterno}  />
              <ElementoCampo type='text' lblCampo="Telefono* :" claCampo="Telefono" onInputChange={setTelefono} nomCampo={telefono} />
              <ElementoCampo type='text' lblCampo="Correo :" claCampo="Correo" onInputChange={setCorreo} nomCampo={correo} />
              
              {/*<button type='button' onClick={obtieneUbicacionActual} className='btn btn-primary col-12'>Utilizar Ubicación Actual</button>*/}

              <ElementoCampo type='text' lblCampo="Calle :" claCampo="Calle" onInputChange={setCalle} nomCampo={calle} />
              <ElementoCampo type='text' lblCampo="Número :" claCampo="Numero" onInputChange={setNumero} nomCampo={numero} />
              <ElementoCampo type='text' lblCampo="Código Postal :" claCampo="CodigoPostal" onInputChange={setCodigoPostal} nomCampo={codigoPostal} />
              <ElementoCampo type="select" lblCampo="Colonia*: " claCampo="campo" nomCampo={idColonia} options={datosColonia} onInputChange={setIdColonia}  />
              
              <div className='container mt-2'>
                <div className='card p-3'>
                  <div className='row'>

                    <div className='col-4'>                   
                      {/* Evidencia 1 */}
                        <input type='file' className='form-control' name="profile_pic" onChange={selectedFotoHandler1} accept=".png, .jpg, .jpeg" />
                        <hr />
                        {userProfileImage1 ? (
                            // Mostrar la imagen si los datos están disponibles
                            <ElementoImagen hexData={userProfileImage1}></ElementoImagen>
                        ) : (
                            // Mostrar un mensaje de carga mientras se obtienen los datos
                            <p>evidencia 1...</p>
                        )}
                        
                        
                    </div>

                    <div className='col-4'>

                      {/* Evidencia 2 */}
                      <input type='file' className='form-control' name="profile_pic" onChange={selectedFotoHandler2} accept=".png, .jpg, .jpeg" />
                      <hr />
                      {userProfileImage2 ? (
                          // Mostrar la imagen si los datos están disponibles
                          <ElementoImagen hexData={userProfileImage2}></ElementoImagen>
                      ) : (
                          // Mostrar un mensaje de carga mientras se obtienen los datos
                          <p>evidencia 2...</p>
                      )}
                                             
                    </div>

                    <div className='col-4'>
                            
                      {/* Evidencia 3 */}
                          <input type='file' className='form-control' name="profile_pic" onChange={selectedFotoHandler3} accept=".png, .jpg, .jpeg" />
                          <hr />
                          {userProfileImage3 ? (
                              // Mostrar la imagen si los datos están disponibles
                              <ElementoImagen hexData={userProfileImage3}></ElementoImagen>
                          ) : (
                              // Mostrar un mensaje de carga mientras se obtienen los datos
                              <p>evidencia 3...</p>
                          )}
                                              
                    </div>

                </div> 
              </div>
              </div>

            </form>
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

export default FrmReporteIncidencia;
