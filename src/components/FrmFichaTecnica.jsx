import React, { useEffect, useState, useContext, useRef } from 'react';
import axios from 'axios';
import SimpleTable from './SimpleTable';
import { ElementoCampo } from './ElementoCampo';
// import { AlertaEmergente } from './AlertaEmergente';
import { SideBarHeader } from './SideBarHeader';
import config from '../config'; // archivo configs globales del proy
import { PerfilContext } from './PerfilContext'; // Importa el contexto
import { ElementoBotones } from './ElementoBotones'
import { FrmFichaTecnicaAcuerdo } from './FrmFichaTecnicaAcuerdo'
import Frame from './ElementoFrame';
// import '../css/Marco.css'; // Importa tu archivo de estilos
import { ElementoToastNotification } from './ElementoToastNotification';
// import Pagenew from '../svg/icon-save.svg?react'
import { useSearchParams } from 'react-router-dom';

//npm install html2pdf.js
// import html2pdf from 'html2pdf.js'; 

//npm install jspdf html2canvas
// import { jsPDF } from 'jspdf';
// import html2canvas from 'html2canvas';

//npm install react-to-print
import { useReactToPrint } from 'react-to-print';

export const FrmFichaTecnica = () => {
    const { perfil, esConLicencia, idAlcaldia } = useContext(PerfilContext);

    const [searchParams] = useSearchParams();
    const ficha = parseInt(searchParams.get('ficha'));
    const solicitud = searchParams.get('solicitud');
    // console.log(ficha)
    // console.log(solicitud)
    // const [ficha, setFicha] = useState(0);
    // const [titulo, setTitulo] = useState('RL_TITUTLO');
    const [titulo, setTitulo] = useState('');
    const [fecha, setFecha] = useState(() => {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    });
    const [hora, setHora] = useState(() => {
        const now = new Date();
        const hh = String(now.getHours()).padStart(2, '0');
        const mm = String(now.getMinutes()).padStart(2, '0');
        return `${hh}:${mm}`;
    });
    const [horaFin, setHoraFin] = useState(() => {
        const now = new Date();
        now.setHours(now.getHours() + 2);  //+2 hora
        const hh = String(now.getHours()).padStart(2, '0');
        const mm = String(now.getMinutes()).padStart(2, '0');
        return `${hh}:${mm}`;
    });
    // const [tema, setTema] = useState('RL_TEMA');
    // const [lugar, setLugar] = useState('RL_LUGAR');
    const [tema, setTema] = useState('');
    const [lugar, setLugar] = useState('');
    const [participanteId, setParticipanteId] = useState(-1);
    const [participanteIdCombo, setParticipanteIdCombo] = useState(-1);
    // const [participanteNombre, setParticipanteNombre] = useState('');
    const [participantePuesto, setParticipantePuesto] = useState('');
    const [acuerdoId, setAcuerdoId] = useState(-1);
    const [acuerdoNombre, setAcuerdoNombre] = useState('');
    const [archivoId, setArchivoId] = useState(-1);
    const [archivoNombre, setArchivoNombre] = useState('');
    const [archivo, setArchivo] = useState(null);
    const [archivoDownload, setArchivoDownload] = useState(null);
    const [acuerdoNum, setAcuerdoNum] = useState(0);
    const [esMuestraCamposReq, setEsMuestraCamposReq] = useState(false);

    const [acuerdoIdAct, setAcuerdoIdAct] = useState(-1);
    const [acuerdoNombreAct, setAcuerdoNombreAct] = useState('');
    const [esModoActividad, setEsModoActividad] = useState(false);

    const [esEditar, setEsEditar] = useState(false);
    const [esNuevo, setEsNuevo] = useState(false);
    const [alertaMensaje, setAlertaMensaje] = useState('');
    // const onAceptar = () => {
    //     setEsMuestraCamposReq(false)
    // setEsMuestraConfirmacion(false)
    // setEsFin(false)
    // inicializaCampos()
    // };
    const onAceptarB = () => {
        setEsMuestraCamposReq(false)
        setAlertaMensaje('')
        // console.log('limpia')
        // setEsMuestraConfirmacion(false)
        // setEsFin(false)
    };

    const [datosActividad, setDatosActividad] = useState([]);

    const [datosParticipantes, setDatosParticipantes] = useState([]);
    const [datosAcuerdos, setDatosAcuerdos] = useState([]);
    const [datosArchivos, setDatosArchivos] = useState([]);
    const [datosUsuario, setDatosUsuario] = useState([]);
    const [datosParticipante, setDatosParticipante] = useState([]);
    const [datosFuncionario, setDatosFuncionario] = useState([]);
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
            header: ('ParticipanteIdCombo'),
            accessorKey: 'ParticipanteIdCombo',
            visible: false,
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
            accessorKey: 'handleDet',
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
            header: ('ArchivoFile'),
            accessorKey: 'ArchivoFile',
            visible: false,
        },
        {
            header: ('ArchivoBin'),
            accessorKey: 'ArchivoBin',
            visible: false,
        },
        {
            header: (''),
            accessorKey: 'handleDelete',
            visible: true,
        },
    ];

    const handleEditParticipantes = (rowData, cellId) => {
        setParticipanteId(parseInt(rowData.original.IdParticipante))
        setParticipanteIdCombo(parseInt(rowData.original.ParticipanteIdCombo))
        setParticipantePuesto(rowData.original.Puesto)
    }
    const handleEditAcuerdos = (rowData, cellId) => {
        setAcuerdoId(rowData.original.IdAcuerdo)
        setAcuerdoNombre(rowData.original.Descripcion)
        setAcuerdoNum(rowData.original.Num)
    }

    const handleSave = (tipo) => {
        // console.log(tipo)
        if (tipo == 1) {
            if (participanteIdCombo <= 0 || participantePuesto.trim() === '') { setEsMuestraCamposReq(true); return }
            if (participanteId < 0) {
                const participante = datosParticipante.find(dato => dato.IdUsuario === participanteIdCombo);
                const nombre = participante ? participante.Nombre : '';
                agregarParticipante({ IdParticipante: (datosParticipantes.length + 1), Nombre: nombre, ParticipanteIdCombo: participanteIdCombo, Puesto: participantePuesto })
            } else {
                editarParticipante()
            }
        }
        if (tipo == 2) {
            if (acuerdoNombre.trim() === '' || acuerdoNum <= 0) { setEsMuestraCamposReq(true); return }
            const idRepetido = datosAcuerdos.find(dato => dato.Descripcion === acuerdoNombre.trim());
            if (idRepetido) {
                setAlertaMensaje('Descripción ya existe, favor de validar')
                return
            }
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
    const handleDetAcuerdo = (rowData, cellId) => {
        setEsModoActividad(true)
        setAcuerdoIdAct(rowData.original.IdAcuerdo)
        setAcuerdoNombreAct(rowData.original.Descripcion)
        // setAcuerdoNum(rowData.original.Num)
    };

    const agregarParticipante = (nuevoParticipante) => {
        setDatosParticipantes(prevDatos => [...prevDatos, nuevoParticipante]);
        // console.log(datosParticipantes)
        inicializaParticipante()
    };
    const agregarAcuerdo = (nuevo) => {
        setDatosAcuerdos(prevDatos => [...prevDatos, nuevo]);
        inicializaAcuerdo()
    };
    const agregarArchivo = (nuevo) => {
        setDatosArchivos(prevDatos => [...prevDatos, nuevo]);
        // console.log(datosArchivos)
        inicializaArchivo()
    };
    const editarParticipante = () => {
        // console.log('edit')
        const nuevosParticipantes = datosParticipantes.map((participante) => {
            if (participante.IdParticipante === participanteId) {
                const participante = datosParticipante.find(dato => dato.IdUsuario === participanteIdCombo);
                const nombre = participante ? participante.Nombre : '';
                return {
                    ...participante, // Mantiene los datos existentes
                    participanteIdCombo: participanteIdCombo,
                    // Nombre: participanteNombre, // Sobrescribe el campo de nombre
                    Nombre: nombre, // Sobrescribe el campo de nombre
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
        // setParticipanteNombre('')
        setParticipanteIdCombo(-1)
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
        console.log('guardar file')
        // e.preventDefault();

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
                if (archivoNombre.trim() === '') { setEsMuestraCamposReq(true); console.log('return'); return }

                const nuevoArchivo = {
                    IdArchivo: datosArchivos.length + 1,
                    Nombre: archivoNombre,
                    Archivo: file.name,
                    ArchivoFile: file,
                    ArchivoBin: null // Inicialmente vacío
                };

                // Usamos FileReader para leer el archivo como base64
                const reader = new FileReader();
                reader.onload = function (event) {
                    nuevoArchivo.ArchivoBin = event.target.result.split(',')[1]; // Obtiene solo la cadena base64
                    // Aquí puedes agregar `nuevoArchivo` al XML o enviarlo a la base de datos
                    agregarArchivo(nuevoArchivo);
                    // console.log(nuevoArchivo)
                };
                // Iniciar la lectura del archivo
                reader.readAsDataURL(file);
            } catch (error) {
                if (error.message) {
                    console.error('Error al guardar archivo:', error.message);
                }
            }
        }
    };
    const descargarArchivo = (idArchivo) => {
        //En este no funcionaba ya que no veia el valor actualizado de idArchivo
    };
    const handleDownloadFile = (rowData, cellId) => {
        // console.log(datosArchivos)
        // const archivo = datosArchivos.find((archivo) => archivo.IdArchivo === archivoId);
        const archivo = datosArchivos.find((archivo) => archivo.IdArchivo === rowData.original.IdArchivo);
        setArchivoDownload(archivo)
        // console.log(datosArchivos)
    };

    function base64ToUint8Array(base64) {
        const binaryString = window.atob(base64);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes;
    }
    useEffect(() => {
        if (!archivoDownload) return;

        // console.log(archivoDownload)
        // return

        let binario = typeof archivoDownload.ArchivoBin === 'string'
            ? base64ToUint8Array(archivoDownload.ArchivoBin)
            : archivoDownload.ArchivoBin;

        // console.log(binario.data)
        // if (binario.data) {
        //     binario = binario.data
        //     binario = typeof binario === 'string'
        //         ? base64ToUint8Array(binario)
        //         : binario;
        //     }

        // console.log (binario)
        // return

        const blob = new Blob([binario], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = archivoDownload.Nombre;
        document.body.appendChild(link);
        link.click();

        URL.revokeObjectURL(url);
        document.body.removeChild(link);

        setArchivoDownload(null);
    }, [archivoDownload]);
    useEffect(() => {
        setEsNuevo(1)
        cargarDatos()
    }, []);
    const cargarDatos = async () => {
        try {
            var arreglo = []
            let apiUrl = config.apiUrl + '/ConsultarUsuarios';
            // const response = await axios.get(apiUrl);
            let response = await axios.get(apiUrl);
            // setDatosUsuario(response.data);
            arreglo = response.data
            arreglo = arreglo.map(item => { return { ...item, value: item.IdUsuario }; });
            arreglo = arreglo.map(item => { return { ...item, label: item.Nombre }; });
            setDatosUsuario(arreglo);

            if (ficha > 0) {
                // console.log('Carga desde BD...');
                apiUrl = config.apiUrl + '/ConsultarGrid?psSpSel=%22ConsultarFicha%22';
                response = await axios.get(apiUrl);
                console.log(ficha)
                arreglo = response.data.find(dato => dato.IdFichaTecnica === ficha && dato.IdAlcaldia === idAlcaldia);
                if (arreglo) {
                    setTitulo(arreglo.Titulo)
                    setFecha(arreglo.FechaVarchar)
                    setHora(arreglo.HoraIni)
                    setHoraFin(arreglo.HoraFin)
                    setTema(arreglo.Tema)
                    setLugar(arreglo.Lugar)
                    apiUrl = config.apiUrl + '/ConsultarGrid?psSpSel=%22ConsultarFichaParticipantes%22';
                    response = await axios.get(apiUrl);
                    arreglo = response.data.filter(dato => dato.IdFichaTecnica === ficha && dato.IdAlcaldia === idAlcaldia);
                    setDatosParticipantes(arreglo)
                    apiUrl = config.apiUrl + '/ConsultarGrid?psSpSel=%22ConsultarFichaAcuerdos%22';
                    response = await axios.get(apiUrl);
                    arreglo = response.data.filter(dato => dato.IdFichaTecnica === ficha && dato.IdAlcaldia === idAlcaldia);
                    setDatosAcuerdos(arreglo)
                    apiUrl = config.apiUrl + '/ConsultarGrid?psSpSel=%22ConsultarFichaAcuerdosActividades%22';
                    response = await axios.get(apiUrl);
                    arreglo = response.data.filter(dato => dato.IdFichaTecnica === ficha && dato.IdAlcaldia === idAlcaldia);
                    setDatosActividad(arreglo)
                    apiUrl = config.apiUrl + '/ConsultarGrid?psSpSel=%22ConsultarFichaArchivos%22';
                    response = await axios.get(apiUrl);
                    arreglo = response.data.filter(dato => dato.IdFichaTecnica === ficha && dato.IdAlcaldia === idAlcaldia);
                    setDatosArchivos(arreglo)
                    //console.log(arreglo)
                } else {
                    console.error('Sin cargo de arreglo');
                }
            }

        } catch (error) {
            console.error('Error al obtener datos:', error);
        }
    };
    useEffect(() => {
        filtraLocal()
        // console.log(datosUsuario)
    }, [datosUsuario]);

    const filtraLocal = () => {
        // console.log('filtra local')
        var datosFiltrados = datosUsuario
        datosFiltrados = datosFiltrados.filter(item => item.IdPerfil == 7)
        setDatosParticipante(datosFiltrados)

        datosFiltrados = datosUsuario
        datosFiltrados = datosFiltrados.filter(item => item.IdPerfil == 8)
        setDatosFuncionario(datosFiltrados)

        // console.log(datosParticipante)
        // setDatosParticipantes(datosParticipantes)
    }
    function convertirAxml(datos, rootName) {
        const xmlDoc = document.implementation.createDocument(null, rootName);
        const rootElement = xmlDoc.documentElement;

        datos.forEach(item => {
            const itemElement = xmlDoc.createElement("item");
            for (const key in item) {
                if (item.hasOwnProperty(key)) {
                    const propElement = xmlDoc.createElement(key);
                    propElement.textContent = item[key];
                    itemElement.appendChild(propElement);
                }
            }
            rootElement.appendChild(itemElement);
        });

        return new XMLSerializer().serializeToString(xmlDoc);
    }

    const guardaIU = (async () => {
        // console.log('ini guardado ')
        // setAlertaMensaje('Al')
        // return
        const xmlParticipante = convertirAxml(datosParticipantes, "data");
        const xmlAcuerdos = convertirAxml(datosAcuerdos, "data");
        const xmlActividades = convertirAxml(datosActividad, "data");
        const xmlArchivos = convertirAxml(datosArchivos, "data");

        const data = {
            pnIdAlcaldia: idAlcaldia,
            pnFicha: ficha,
            pnIdSolicitudAgenda: solicitud,
            psTitulo: titulo,
            psFecha: fecha,
            psHora: hora,
            psHoraFin: horaFin,
            psTema: tema,
            psLugar: lugar,
            // pnAccion: accion,
            psXmlParticipante: xmlParticipante,
            psXmlAcuerdo: xmlAcuerdos,
            psXmlActividades: xmlActividades,
            psXmlArchivos: xmlArchivos
        };
        const apiReq = config.apiUrl + '/GuardarFicha';
        try {
            // console.log(titulo)
            // return
            if (titulo.trim == '') { setEsMuestraCamposReq(true); return }
            if (fecha.trim == '') { setEsMuestraCamposReq(true); return }
            if (hora.trim == '') { setEsMuestraCamposReq(true); return }
            if (horaFin.trim == '') { setEsMuestraCamposReq(true); return }
            if (tema.trim == '') { setEsMuestraCamposReq(true); return }
            if (lugar.trim == '') { setEsMuestraCamposReq(true); return }
            if (datosParticipantes.length < 2) {
                // console.log('a')
                setAlertaMensaje('Al menos 2 participantes son requeridos, favor de validar')
                return
            }


            // console.log('Guardando Jugadores x Equipo', data);
            // return

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
                        console.log('guardo correctamente')
                        // setEsEditar(false)
                        // setEsFin(true)
                        setAlertaMensaje('Operación Exitosa')
                    }
                })
        } catch (error) {
            console.error('Error al guardar la Ficha', error);
        }
    })

    const contentRef = useRef(null);

    const reactToPrintFn2 = useReactToPrint({
        // content: () => contentRef.current,
        // documentTitle: 'pagina-exportada',
        // onAfterPrint: () => console.log('Exportación completada')
        // window.print()
    });

    const reactToPrintFn = () => {
        window.print()
    };

    return (

        // <div>
        //     <button onClick={reactToPrintFn}>Exportar a PDF</button>

        //     {/* Contenido a exportar */}
        //     <div ref={contentRef} style={{ padding: '20px', border: '1px solid #000' }}>
        //         <h2>Contenido para exportar</h2>
        //         <p>Este es el contenido que se incluirá en el PDF.</p>
        //         {/* Otros componentes o contenido */}
        //     </div>
        // </div>
        <>
            <div ref={contentRef}>
                <SideBarHeader titulo={esNuevo ? ('Ficha Técnica Reunión') : esEditar ? 'Editar Ficha Técnica Reunión' : 'Consulta'}></SideBarHeader>
                <br /><br /><br /><br />

                {esModoActividad ? <FrmFichaTecnicaAcuerdo acuerdoNombreAct={acuerdoNombreAct} acuerdoIdAct={acuerdoIdAct}
                    setEsModoActividad={setEsModoActividad}
                    datosActividad={datosActividad}
                    setDatosActividad={setDatosActividad}
                    datosFuncionario={datosFuncionario}
                ></FrmFichaTecnicaAcuerdo > :
                    <>

                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <button type="button" title="Exportar" className="btn btn-primary" onClick={reactToPrintFn}>Imprimir</button>
                            <ElementoBotones esOcultaCancelar={true} guardar={guardaIU}></ElementoBotones>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ flexBasis: '49%', flexGrow: 0 }}>
                                <ElementoCampo type='text' lblCampo="Título* :" claCampo="Nombre" nomCampo={titulo} onInputChange={setTitulo} tamanioString={100} />
                            </span>
                            <span style={{ flexBasis: '49%', flexShrink: 1, marginTop: '0px' }}>
                                <ElementoCampo type='date' lblCampo="Fecha*:" claCampo="fecha" nomCampo={fecha} onInputChange={setFecha} />
                            </span>

                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ flexBasis: '49%', flexShrink: 1, marginTop: '0px' }}>
                                <ElementoCampo type='time' lblCampo="Hora Inicio*:" claCampo="hora" nomCampo={hora} onInputChange={setHora} />
                            </span>
                            <span style={{ flexBasis: '49%', flexShrink: 1, marginTop: '0px' }}>
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
                        <span style={{ flexBasis: '49%', flexGrow: 0 }}>
                            <Frame title="Participantes">

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ flexBasis: '44%', flexGrow: 0 }}>
                                        <ElementoCampo type="selectBusqueda" lblCampo="Nombre*:" claCampo="Nombre" nomCampo={participanteIdCombo} options={datosParticipante} onInputChange={setParticipanteIdCombo} />
                                    </span>
                                    <span style={{ flexBasis: '44%', flexShrink: 1, marginTop: '0px' }}>
                                        <ElementoCampo type='text' lblCampo="Puesto*:" claCampo="" nomCampo={participantePuesto} onInputChange={setParticipantePuesto} />
                                    </span>
                                    <span style={{ flexBasis: '4%', flexShrink: 1, marginTop: '0px' }}>
                                        <i className="bi bi-table fs-2" onClick={() => handleSave(1)}></i>
                                    </span>
                                </div>
                                <SimpleTable data={datosParticipantes} columns={columnsParticipantes} handleEdit={handleEditParticipantes}
                                    esOcultaFooter={true} esOcultaBotonNuevo={true} esOcultaFiltro={true} esOcultaBotonArriba={true}
                                    handleDelete={handleDeleteParticipante} />
                            </Frame >
                        </span>

                        <span style={{ flexBasis: '49%', flexShrink: 1, marginTop: '0px' }}>
                            <Frame title="Acuerdos">

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ flexBasis: '44%', flexGrow: 0 }}>
                                        <ElementoCampo type='text' lblCampo="Descripción*:" claCampo="" nomCampo={acuerdoNombre} onInputChange={setAcuerdoNombre} />
                                    </span>
                                    <span style={{ flexBasis: '44%', flexShrink: 1, marginTop: '0px' }}>
                                        <ElementoCampo type='number' lblCampo="Num*:" claCampo="" nomCampo={acuerdoNum} onInputChange={setAcuerdoNum} />
                                    </span>
                                    <span style={{ flexBasis: '4%', flexShrink: 1, marginTop: '0px' }}>
                                        <i className="bi bi-table fs-2" onClick={() => handleSave(2)}></i>
                                    </span>
                                </div>
                                <SimpleTable data={datosAcuerdos} columns={columnsAcuerdos} handleEdit={handleEditAcuerdos}
                                    esOcultaFooter={true} esOcultaBotonNuevo={true} esOcultaFiltro={true} esOcultaBotonArriba={true}
                                    handleDelete={handleDeleteAcuerdo} handleDet={handleDetAcuerdo} />
                            </Frame >
                        </span>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ flexBasis: '100%', flexGrow: 0 }}>

                                <Frame title="Archivos Adjuntos">
                                    <ElementoCampo type='text' lblCampo="Nombre Archivo*:" claCampo="" nomCampo={archivoNombre} onInputChange={setArchivoNombre} />
                                    <label style={{ textAlign: "left" }}>extensión válida : pdf </label>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ flexBasis: '79%', flexGrow: 0 }}>
                                            <input type='file' className='form-control' name="profile_pic" onChange={selectedFileHandler} accept=".pdf" />
                                        </span>
                                        <span style={{ flexBasis: '19%', flexShrink: 1, marginTop: '0px' }}>
                                            <i className="bi bi-cloud-upload fs-2" onClick={() => guardarFile()}></i>
                                        </span>
                                    </div>

                                    <SimpleTable data={datosArchivos} columns={columnsArchivos}
                                        esOcultaFooter={true} esOcultaBotonNuevo={true} esOcultaFiltro={true} esOcultaBotonArriba={true}
                                        handleDelete={handleDeleteArchivo}
                                        handleEdit={handleDownloadFile}
                                    />
                                </Frame >
                            </span>
                        </div>
                    </>
                }
            </div>
            {
                esMuestraCamposReq &&
                <ElementoToastNotification
                    mensaje={'Los datos con * son requeridos, favor de validar.'}
                    onAceptar={onAceptarB}
                ></ElementoToastNotification>
            }
            {alertaMensaje &&
                <ElementoToastNotification
                    mensaje={alertaMensaje}
                    onAceptar={onAceptarB}
                ></ElementoToastNotification>
            }
        </>
    )
}
export default FrmFichaTecnica