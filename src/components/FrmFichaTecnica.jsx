import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import SimpleTable from './SimpleTable';
import { ElementoCampo } from './ElementoCampo';
// import { AlertaEmergente } from './AlertaEmergente';
import { SideBarHeader } from './SideBarHeader';
import config from '../config'; // archivo configs globales del proy
import { PerfilContext } from './PerfilContext'; // Importa el contexto
import { ElementoBotones } from './ElementoBotones'
import Frame from './ElementoFrame';
// import '../css/Marco.css'; // Importa tu archivo de estilos
import { ElementoToastNotification } from './ElementoToastNotification';
import Pagenew from '../svg/icon-save.svg?react'


export const FrmFichaTecnica = () => {
    const { perfil, esConLicencia } = useContext(PerfilContext);
    const { titulo, setTitulo } = useState('');
    const [fecha, setFecha] = useState('');
    const [hora, setHora] = useState('');
    const [horaFin, setHoraFin] = useState('');
    const [tema, setTema] = useState('');
    const [lugar, setLugar] = useState('');
    const [participanteId, setParticipanteId] = useState(-1);
    const [participanteNombre, setParticipanteNombre] = useState('');
    const [participantePuesto, setParticipantePuesto] = useState('');
    const [acuerdoId, setAcuerdoId] = useState(-1);
    const [acuerdoNombre, setAcuerdoNombre] = useState('');
    const [archivoId, setArchivoId] = useState(-1);
    const [archivoNombre, setArchivoNombre] = useState('');
    const [archivo, setArchivo] = useState(null);
    const [acuerdoNum, setAcuerdoNum] = useState('');
    const [esMuestraCamposReq, setEsMuestraCamposReq] = useState(false);

    const [esEditar, setEsEditar] = useState(false);
    const [esNuevo, setEsNuevo] = useState(false);
    // const onAceptar = () => {
    //     setEsMuestraCamposReq(false)
    // setEsMuestraConfirmacion(false)
    // setEsFin(false)
    // inicializaCampos()
    // };
    const onAceptarB = () => {
        setEsMuestraCamposReq(false)
        // setEsMuestraConfirmacion(false)
        // setEsFin(false)
    };

    const [datosParticipantes, setDatosParticipantes] = useState([]);
    const [datosAcuerdos, setDatosAcuerdos] = useState([]);
    const [datosArchivos, setDatosArchivos] = useState([]);
    const columnsParticipantes = [
        {
            header: 'IdParticipante',
            accessorKey: 'IdParticipante',
            visible: false,
        },
        {
            header: ('Nombre'),
            accessorKey: 'Nombre',
            visible: true,
        },
        {
            header: ('Puesto'),
            accessorKey: 'Puesto',
            visible: true,
        },
        {
            header: (''),
            accessorKey: 'handleDelete',
            visible: true,
        },
    ];
    const columnsAcuerdos = [
        {
            header: 'IdAcuerdo',
            accessorKey: 'IdAcuerdo',
            visible: false,
        },
        {
            header: ('Descripción'),
            accessorKey: 'Descripcion',
            visible: true,
        },
        {
            header: ('Num.'),
            accessorKey: 'Num',
            visible: true,
        },
        {
            header: (''),
            accessorKey: 'handleDelete',
            visible: true,
        },
    ];
    const columnsArchivos = [
        {
            header: 'IdArchivo',
            accessorKey: 'IdArchivo',
            visible: false,
        },
        {
            header: ('Nombre'),
            accessorKey: 'Nombre',
            visible: true,
        },
        {
            header: ('Archivo'),
            accessorKey: 'Archivo',
            visible: true,
        },
        {
            header: ('ArchivoBin'),
            accessorKey: 'ArchivoBin',
            visible: true,
        },
        {
            header: (''),
            accessorKey: 'handleDelete',
            visible: true,
        },
    ];
    const handleEditParticipantes = (rowData, cellId) => {
        setParticipanteId(rowData.original.IdParticipante)
        setParticipanteNombre(rowData.original.Nombre)
        setParticipantePuesto(rowData.original.Puesto)
    }
    const handleEditAcuerdos = (rowData, cellId) => {
        setAcuerdoId(rowData.original.IdAcuerdo)
        setAcuerdoNombre(rowData.original.Descripcion)
        setAcuerdoNum(rowData.original.Num)
    }
    const handleSave = (tipo) => {
        console.log(tipo)
        if (tipo == 1) {
            if (participanteNombre.trim() === '' || participantePuesto.trim() === '') { setEsMuestraCamposReq(true); return }
            if (participanteId < 0) {
                agregarParticipante({ IdParticipante: (datosParticipantes.length + 1), Nombre: participanteNombre, Puesto: participantePuesto })
            } else {
                editarParticipante()
            }
        }
        if (tipo == 2) {
            if (acuerdoNombre.trim() === '' || acuerdoNum.trim() === '') { setEsMuestraCamposReq(true); return }
            if (acuerdoId < 0) {
                agregarAcuerdo({ IdAcuerdo: (datosAcuerdos.length + 1), Descripcion: acuerdoNombre, Num: acuerdoNum })
            } else {
                editarAcuerdo()
            }
        }
    };
    const handleDeleteParticipante = (row, cellId) => {
        const nuevosDatos = datosParticipantes.filter(dato => dato.IdParticipante !== row.original.IdParticipante);
        setDatosParticipantes(nuevosDatos);
    };
    const handleDeleteAcuerdo = (row, cellId) => {
        const nuevosDatos = datosAcuerdos.filter(dato => dato.IdAcuerdo !== row.original.IdAcuerdo);
        setDatosAcuerdos(nuevosDatos);
    };
    const handleDeleteArchivo = (row, cellId) => {
        const nuevosDatos = datosArchivos.filter(dato => dato.IdArchivo !== row.original.IdArchivo);
        setDatosArchivos(nuevosDatos);
    };
    const agregarParticipante = (nuevoParticipante) => {
        setDatosParticipantes(prevDatos => [...prevDatos, nuevoParticipante]);
        inicializaParticipante()
    };
    const agregarAcuerdo = (nuevo) => {
        setDatosAcuerdos(prevDatos => [...prevDatos, nuevo]);
        inicializaAcuerdo()
    };
    const agregarArchivo = (nuevo) => {
        setDatosArchivos(prevDatos => [...prevDatos, nuevo]);
        inicializaArchivo()
    };
    const editarParticipante = () => {
        console.log('edit')
        const nuevosParticipantes = datosParticipantes.map((participante) => {
            if (participante.IdParticipante === participanteId) {
                return {
                    ...participante, // Mantiene los datos existentes
                    Nombre: participanteNombre, // Sobrescribe el campo de nombre
                    Puesto: participantePuesto, // Sobrescribe el campo de puesto
                };
            }
            return participante; // Devolver el participante sin cambios si no coincide el ID
        });
        setDatosParticipantes(nuevosParticipantes);
        inicializaParticipante()
    };
    const editarAcuerdo = () => {
        const nuevos = datosAcuerdos.map((elemento) => {
            if (elemento.IdAcuerdo === acuerdoId) {
                return {
                    ...elemento,
                    Descripcion: acuerdoNombre,
                    Num: acuerdoNum,
                };
            }
            return elemento; // Devolver el participante sin cambios si no coincide el ID
        });
        setDatosAcuerdos(nuevos);
        inicializaAcuerdo()
    };
    const inicializaParticipante = () => {
        setParticipanteNombre('')
        setParticipantePuesto('')
        setParticipanteId(-1)
    }
    const inicializaAcuerdo = () => {
        setAcuerdoNombre('')
        setAcuerdoNum('')
        setAcuerdoId(-1)
    }
    const inicializaArchivo = () => {
        setArchivoNombre('')
        setArchivo('')
        setArchivoId(-1)
    }



    const [file, setFile] = useState(null);
    // const [userProfileImage, setUserProfileImage] = useState('');
    const selectedFileHandler = e => {
        console.log('ARCHIVO SELECCIONADO:')
        setFile(null)
        // setUserProfileImage('')
        setFile(e.target.files[0])
    }
    const guardarFile = async (e) => {
        e.preventDefault();

        const apiReq = config.apiUrl + '/GuardarFile';
        const formData = new FormData()
        formData.append('foto', file)
        // formData.append('pnIdLiga', idLiga)
        // formData.append('pnIdJugador', idJugador)

        if (!file) {
            alert('Favor de seleccionar un Archivo')
            return
        }
        else if (file.size > 1000000) {
            alert('El límite máximo del archivo es 1 MB. Favor de validar ')
            return
        }
        else {
            try {

                setArchivo(file)
                // await axios.post(apiReq, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
                if (archivoNombre.trim() === '') { setEsMuestraCamposReq(true); return }
                if (acuerdoId < 0) {
                    agregarArchivo({ IdArchivo: (datosArchivos.length + 1), Nombre: archivoNombre, Archivo: file.name, ArchivoBin: file })
                } else {
                    // editarAcuerdo()
                }

                // console.log('guardo correctamente')
                // setEsFin(true)

            } catch (error) {
                if (!error.message == '') {
                    // setAlertaMensaje('Error al guardar archivo: ' + error.message)
                }
            }
        }
    };

    useEffect(() => {
        setEsNuevo(1)
    }, []);

    return (
        <>
            <SideBarHeader titulo={esNuevo ? ('Ficha Técnica Reunion') : esEditar ? 'Editar Ficha Técnica Reunion' : 'Consulta'}></SideBarHeader>
            <br /><br /><br /><br />
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <ElementoBotones esOcultaCancelar={true}></ElementoBotones>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ flexBasis: '50%', flexGrow: 0 }}>
                    <ElementoCampo type='text' lblCampo="Título* :" claCampo="Nombre" nomCampo={titulo} onInputChange={setTitulo} tamanioString={100} />
                </span>
                <span style={{ flexBasis: '15%', flexShrink: 1, marginTop: '0px' }}>
                    <ElementoCampo type='date' lblCampo="Fecha*:" claCampo="fecha" nomCampo={fecha} onInputChange={setFecha} />
                </span>
                <span style={{ flexBasis: '15%', flexShrink: 1, marginTop: '0px' }}>
                    <ElementoCampo type='time' lblCampo="Hora Inicio*:" claCampo="hora" nomCampo={hora} onInputChange={setHora} />
                </span>
                <span style={{ flexBasis: '15%', flexShrink: 1, marginTop: '0px' }}>
                    <ElementoCampo type='time' lblCampo="Hora Fin*:" claCampo="horaFin" nomCampo={horaFin} onInputChange={setHoraFin} />
                </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ flexBasis: '49%', flexGrow: 0 }}>
                    <ElementoCampo type='text' lblCampo="Tema*:" claCampo="" nomCampo={tema} onInputChange={setTema} />
                </span>
                <span style={{ flexBasis: '49%', flexShrink: 1, marginTop: '0px' }}>
                    <ElementoCampo type='text' lblCampo="Lugar*:" claCampo="" nomCampo={lugar} onInputChange={setLugar} />
                </span>
            </div>


            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ flexBasis: '49%', flexGrow: 0 }}>
                    <Frame title="Participantes">

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ flexBasis: '44%', flexGrow: 0 }}>
                                <ElementoCampo type='text' lblCampo="Nombre*:" claCampo="" nomCampo={participanteNombre} onInputChange={setParticipanteNombre} />
                            </span>
                            <span style={{ flexBasis: '44%', flexShrink: 1, marginTop: '0px' }}>
                                <ElementoCampo type='text' lblCampo="Puesto*:" claCampo="" nomCampo={participantePuesto} onInputChange={setParticipantePuesto} />
                            </span>
                            <span style={{ flexBasis: '4%', flexShrink: 1, marginTop: '0px' }}>
                                {/* <button type="button" className="btn btn-primary" onClick={() => handleSave(1)} ><Pagenew /></button> */}
                                <i className="bi bi-table fs-2" onClick={() => handleSave(1)}></i>
                            </span>
                        </div>
                        <SimpleTable data={datosParticipantes} columns={columnsParticipantes} handleEdit={handleEditParticipantes}
                            esOcultaFooter={true} esOcultaBotonNuevo={true} esOcultaFiltro={true} esOcultaBotonArriba={true}
                            // handleDelete={() => handleDelete(1,datosParticipantes,'idParticipante')} />
                            handleDelete={handleDeleteParticipante} />
                        {/* handleDelete={() => handleDelete('idParticipante')} /> */}
                    </Frame >
                </span>

                <span style={{ flexBasis: '49%', flexShrink: 1, marginTop: '0px' }}>
                    <Frame title="Acuerdos">

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ flexBasis: '44%', flexGrow: 0 }}>
                                <ElementoCampo type='text' lblCampo="Descripción*:" claCampo="" nomCampo={acuerdoNombre} onInputChange={setAcuerdoNombre} />
                            </span>
                            <span style={{ flexBasis: '44%', flexShrink: 1, marginTop: '0px' }}>
                                <ElementoCampo type='text' lblCampo="Num*:" claCampo="" nomCampo={acuerdoNum} onInputChange={setAcuerdoNum} />
                            </span>
                            <span style={{ flexBasis: '4%', flexShrink: 1, marginTop: '0px' }}>
                                <i className="bi bi-table fs-2" onClick={() => handleSave(2)}></i>
                            </span>
                        </div>
                        <SimpleTable data={datosAcuerdos} columns={columnsAcuerdos} handleEdit={handleEditAcuerdos}
                            esOcultaFooter={true} esOcultaBotonNuevo={true} esOcultaFiltro={true} esOcultaBotonArriba={true}
                            handleDelete={handleDeleteAcuerdo} />
                    </Frame >
                </span>




            </div>




            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ flexBasis: '49%', flexGrow: 0 }}>

                    <Frame title="Archivos Adjuntos">
                        <ElementoCampo type='text' lblCampo="Nombre Archivo*:" claCampo="" nomCampo={archivoNombre} onInputChange={setArchivoNombre} />
                        <label style={{ textAlign: "left" }}>extensión : pdf | imagen</label>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ flexBasis: '79%', flexGrow: 0 }}>
                                <input type='file' className='form-control' name="profile_pic" onChange={selectedFileHandler} accept=".pdf, .png, .jpg, .jpeg" />
                            </span>
                            <span style={{ flexBasis: '19%', flexShrink: 1, marginTop: '0px' }}>
                                {/* <button type='button' onClick={guardarFile} className='btn btn-primary col-12'>Cargar</button> */}
                                <i className="bi bi-cloud-upload fs-2" onClick={() => guardarFile}></i>
                            </span>
                        </div>

                        <SimpleTable data={datosArchivos} columns={columnsArchivos}
                            esOcultaFooter={true} esOcultaBotonNuevo={true} esOcultaFiltro={true} esOcultaBotonArriba={true}
                            handleDelete={handleDeleteArchivo} />

                    </Frame >
                </span>

            </div>


            {esMuestraCamposReq &&
                <ElementoToastNotification
                    mensaje={'Los datos con * son requeridos, favor de validar.'}
                    onAceptar={onAceptarB}
                ></ElementoToastNotification>
            }
        </>
    )
}
export default FrmFichaTecnica