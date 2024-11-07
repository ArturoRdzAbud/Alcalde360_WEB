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
import { useLocation, useNavigate } from "react-router-dom";
import { PerfilContext } from './PerfilContext'; // Importa el contexto

export const FrmSolicitudAgenda = () => {

  const [datosTipoAgenda, setDatosTipoAgenda] = useState([]);
  const [datosEstatusAgenda, setDatosEstatusAgenda] = useState([]);
  const [datosClasificacionAgenda, setDatosClasificacionAgenda] = useState([]);
  const [datosOrigenAgenda, setDatosOrigenAgenda] = useState([]);
  const [datosColonia, setDatosColonia] = useState([]);

  const [esEditar, setEsEditar] = useState(false);
  const [esNuevo, setEsNuevo] = useState(false);
  const [esFin, setEsFin] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state;

  //datos de registro
  const { idAlcaldia } = useContext(PerfilContext); // variable global
  const [idSolicitudAgenda, setIdSolicitudAgenda] = useState(data.idSolicitudAgenda);

  const [descripcion, setDescripcion] = useState(''); //asunto
  const [idTipoAgenda, setIdTipoAgenda] = useState(0);
  const [idEstatusAgenda, setIdEstatusAgenda] = useState(0);
  const [idClasificacionAgenda, setIdClasificacionAgenda] = useState(0);
  const [idOrigenAgenda, setIdOrigenAgenda] = useState(0);

  const [nombre, setNombre] = useState('');
  const [cargo, setCargo] = useState('');
  const [telefono, setTelefono] = useState('');
  const [correo, setCorreo] = useState('');

  const [idColonia, setIdColonia] = useState(0);
  const [calle, setCalle] = useState('');
  const [numero, setNumero] = useState('');
  const [codigoPostal, setCodigoPostal] = useState('');

  const [fechaInicial, setFechaInicial] = useState('');
  const [fechaFinal, setFechaFinal] = useState('');

  const [idUsuario, setIdUsuario] = useState(1);  //asigna temporalmente 1 hasta que tengamos una variable global de usuario para pasar este dato al SP

  const [accion, setAccion] = useState(1);

  const [esMuestraCamposReq, setEsMuestraCamposReq] = useState(false);
  const [alertaMensaje, setAlertaMensaje] = useState('');

  const regresar = () => {
    navigate(-1);
  };

  const onAceptar = () => {
    setEsMuestraCamposReq(false)
    setEsFin(false)
  };

  const onAceptarC = () => {
    setAlertaMensaje('')
  };

  const onAceptarFinal = () => {
    setEsMuestraCamposReq(false)
    setEsFin(false)
    navigate(-1)
  };

  const guardarSolicitudAgenda = async (e) => {
    e.preventDefault();
    console.log(telefono, descripcion, idOrigenAgenda, { fechaInicial }, { fechaFinal })
    //== null, ya que en JavaScript esta comparación cubre tanto null como undefined
    if (idAlcaldia == null || idAlcaldia == 0) { setEsMuestraCamposReq(true); return }
    if (idOrigenAgenda == null || idOrigenAgenda == 0) { setEsMuestraCamposReq(true); return }
    if (idClasificacionAgenda == null || idClasificacionAgenda == 0) { setEsMuestraCamposReq(true); return }
    if (idEstatusAgenda == null || idEstatusAgenda == 0) { setEsMuestraCamposReq(true); return }
    if (idTipoAgenda == null || idTipoAgenda == 0) { setEsMuestraCamposReq(true); return }

    if (nombre == null || nombre.trim() === '') { setEsMuestraCamposReq(true); return }
    if (cargo == null || cargo.trim() === '') { setEsMuestraCamposReq(true); return }
    if (telefono == null || telefono.trim() === '') { setEsMuestraCamposReq(true); return }
    //if (correo == null || correo.trim() == '') { setEsMuestraCamposReq(true); return }
    //if (idColonia == 0) { setEsMuestraCamposReq(true); return }
    //if (calle == null || calle.trim() == '') { setEsMuestraCamposReq(true); return }
    //if (numero == null || numero.trim() == '') { setEsMuestraCamposReq(true); return }
    //if (codigoPostal == null || codigoPostal.trim() == '') { setEsMuestraCamposReq(true); return }
    //las fechas deben tener este formato: 'yyyy-mm-ddThh:mi'
    if (fechaInicial == null || fechaInicial.trim() === '') { setEsMuestraCamposReq(true); return }
    if (fechaFinal == null || fechaFinal.trim() === '') { setEsMuestraCamposReq(true); return }
    if (fechaInicial >= fechaFinal) { setAlertaMensaje('La fecha final debe ser mayor a la fecha inicial'); return }

    if (descripcion == null || descripcion.trim() === '') { setEsMuestraCamposReq(true); return }
    if (idUsuario == null || idUsuario == 0) { setEsMuestraCamposReq(true); return }

    const data = {
      pnIdAlcaldia: idAlcaldia,
      pnIdSolicitudAgenda: idSolicitudAgenda,
      psAsunto: descripcion,
      pnIdTipoAgenda: idTipoAgenda,
      pnIdEstatusAgenda: idEstatusAgenda,
      pnIdOrigenAgenda: idOrigenAgenda,
      pnIdClasificacionAgenda: idClasificacionAgenda,
      psNombre: nombre,
      psTelefono: telefono,
      psCorreo: correo,
      psCargo: cargo,
      pnIdColonia: idColonia,
      psCalle: calle,
      psNumero: numero,
      psCodigoPostal: codigoPostal,
      pdFechaIni: fechaInicial,
      pdFechaFin: fechaFinal,
      pnIdUsuario: idUsuario,

    };

    const apiReq = 'http://localhost:3000/GuardarSolicitudAgenda';

    console.log('Guardando los datos.', data);

    try {

      const response = await axios.post(apiReq, { data }, { 'Access-Control-Allow-Origin': '*' })
      console.log("Response Data:", response.data);
      //response.data[0].IdAgenda //se debe especificar el registro 0 ya que el response es un arreglo
      const id = response.data;  //Solo regresa IdAgenda
      console.log("Id:", id);
      if (id == 0) { setAlertaMensaje('Ya existen registros que se cruzan en el mismo horario'); return }

      setEsFin(true);

    } catch (error) {
      console.error('Error al guardar la Agenda.', error);
    }


  };


  const inicializaCampos = () => {

    //Campos 
    setIdSolicitudAgenda(0)
    setDescripcion('')
    setIdTipoAgenda(0)
    setIdEstatusAgenda(0)
    setIdClasificacionAgenda(0)
    setIdOrigenAgenda(0)
    setNombre('')
    setCargo('')
    setTelefono('')
    setCorreo('')
    setFechaInicial('')
    setFechaFinal('')

    setIdColonia(0)
    setCalle('')
    setNumero('')
    setCodigoPostal('')

    setAccion(0)//0 para MODIF 1 para nuevo
    setEsFin(false)

  };

  const cancelar = () => {
    inicializaCampos()
    setEsEditar(false)
    setEsNuevo(false)
    regresar();  //regresa a la pantalla anterior
  };
  const nuevo = () => {
    inicializaCampos()
    setEsEditar(true)
    setEsNuevo(true)
    setAccion(1)
  };

  useEffect(() => {
    var apiUrl = 'http://localhost:3000/ConsultarCombo?psSpSel=%22ConsultarTipoAgendaCmb%22';
    axios.get(apiUrl)
      .then(response => {
        setDatosTipoAgenda(response.data)
      }
      )
      .catch(error => console.error('Error al obtener Tipo', error));

    apiUrl = 'http://localhost:3000/ConsultarCombo?psSpSel=%22ConsultarEstatusAgendaCmb%22';
    axios.get(apiUrl)
      .then(response => {
        setDatosEstatusAgenda(response.data)
      }
      )
      .catch(error => console.error('Error al obtener Estatus', error));

    apiUrl = 'http://localhost:3000/ConsultarCombo?psSpSel=%22ConsultarClasificacionAgendaCmb%22';
    axios.get(apiUrl)
      .then(response => {
        setDatosClasificacionAgenda(response.data)
      }
      )
      .catch(error => console.error('Error al obtener Clasificacion', error));

    apiUrl = 'http://localhost:3000/ConsultarCombo?psSpSel=%22ConsultarOrigenAgendaCmb%22';
    axios.get(apiUrl)
      .then(response => {
        setDatosOrigenAgenda(response.data)
      }
      )
      .catch(error => console.error('Error al obtener Origen', error));


    apiUrl = config.apiUrl + '/ConsultarColonias';
    axios.get(apiUrl, { params: { pnIdAlcaldia: idAlcaldia } })
      .then(response => {
        setDatosColonia(response.data)
      }
      )
      .catch(error => console.error('Error al obtener colonia', error));

    console.log("IdAlcaldia", idAlcaldia, "IdSolicitudAgenda:", idSolicitudAgenda);

    setEsNuevo(data.esNuevo);

    setDescripcion(data.descripcion);
    setIdTipoAgenda(data.idTipoAgenda);
    setIdEstatusAgenda(data.idEstatusAgenda);
    setIdClasificacionAgenda(data.idClasificacionAgenda);
    setIdOrigenAgenda(data.idOrigenAgenda);
    setFechaInicial(data.fechaInicial);
    setFechaFinal(data.fechaFinal);

    setNombre(data.nombre);
    setCargo(data.cargo);
    setTelefono(data.telefono);
    setCorreo(data.correo);

    setIdColonia(data.idColonia);
    setCalle(data.calle);
    setNumero(data.numero);
    setCodigoPostal(data.codigoPostal);

  }, []);

  const handleChangeTelefono = (e) => {
    // Filtra solo los caracteres numéricos del valor ingresado
    const valor = e.target.value.replace(/\D/g, ''); // Elimina cualquier carácter que no sea dígito
    console.log({ valor })
    setTelefono(valor);
  };

  return (
    <div>
      <SideBarHeader titulo={esNuevo ? 'Solicitud de Agenda' : 'Editar Solicitud de Agenda'}></SideBarHeader>
      <br /><br /><br /><br />

      <form onSubmit={guardarSolicitudAgenda}>
        <br />
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <ElementoBotones cancelar={cancelar}></ElementoBotones>
        </div>

        <br />

        <div className='container mt-2'>
          <div className='card p-2'>
            <div className='row'>

              <div className='col-6'>
                <ElementoCampo type="select" lblCampo="Origen*: " claCampo="campo" nomCampo={idOrigenAgenda} options={datosOrigenAgenda} onInputChange={setIdOrigenAgenda} />
                <ElementoCampo type="select" lblCampo="Clasificacion*: " claCampo="campo" nomCampo={idClasificacionAgenda} options={datosClasificacionAgenda} onInputChange={setIdClasificacionAgenda} />

                <ElementoCampo type='text' lblCampo="Nombre* :" claCampo="Nombre" onInputChange={setNombre} nomCampo={nombre} tamanioString={100} />
                <ElementoCampo type='text' lblCampo="Cargo* :" claCampo="Cargo" onInputChange={setCargo} nomCampo={cargo} />
                <ElementoCampo type='tel' lblCampo="Telefono* :" claCampo="Telefono" onInputChange={setTelefono} nomCampo={telefono} tamanioString={10} pattern="^\d{10}$" />
                <ElementoCampo type='email' lblCampo="Correo :" claCampo="Correo" onInputChange={setCorreo} nomCampo={correo} tamanioString={50} />
                <ElementoCampo type='datetime-local' lblCampo="Fecha Hora Inicial*:" claCampo="fechaInicial" nomCampo={fechaInicial} onInputChange={setFechaInicial} />
                <ElementoCampo type='text' lblCampo="Asunto* :" claCampo="Descripcion" onInputChange={setDescripcion} nomCampo={descripcion} />

              </div>

              <div className='col-6'>
                <ElementoCampo type="select" lblCampo="Estatus*: " claCampo="campo" nomCampo={idEstatusAgenda} options={datosEstatusAgenda} onInputChange={setIdEstatusAgenda} />
                <ElementoCampo type="select" lblCampo="Tipo*: " claCampo="campo" nomCampo={idTipoAgenda} options={datosTipoAgenda} onInputChange={setIdTipoAgenda} />

                <ElementoCampo type='text' lblCampo="Calle :" claCampo="Calle" onInputChange={setCalle} nomCampo={calle} />
                <ElementoCampo type='text' lblCampo="Número :" claCampo="Numero" onInputChange={setNumero} nomCampo={numero} />
                <ElementoCampo type='text' lblCampo="Código Postal :" claCampo="CodigoPostal" onInputChange={setCodigoPostal} nomCampo={codigoPostal} />
                <ElementoCampo type="select" lblCampo="Colonia: " claCampo="campo" nomCampo={idColonia} options={datosColonia} onInputChange={setIdColonia} />
                <ElementoCampo type='datetime-local' lblCampo="Fecha Hora Final*:" claCampo="fechaFinal" nomCampo={fechaFinal} onInputChange={setFechaFinal} />

              </div>

            </div>
          </div>
        </div>
        <br />

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
          onAceptar={onAceptarFinal}
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

export default FrmSolicitudAgenda;
