import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { differenceInDays } from 'date-fns';
import SimpleTable from './SimpleTable';
import { ElementoCampo } from './ElementoCampo';
import { SideBarHeader } from './SideBarHeader';
import config from '../config'; // archivo configs globales del proy
import { PerfilContext } from './PerfilContext'; // Importa el contexto
import { ElementoBotones } from './ElementoBotones'
import Frame from './ElementoFrame';
import { ElementoToastNotification } from './ElementoToastNotification';
import Pagenew from '../svg/icon-save.svg?react'
import useFrmFichaTecnicaAcuerdoArchivo from './FrmFichaTecnicaAcuerdoArchivo';
// import useColumnsActividad from './FrmFichaTecnicaAcuerdoCol';
import useColumnsActividad from './FrmFichaTecnicaAcuerdoCol.jsx';


export const FrmFichaTecnicaAcuerdo = ({ acuerdoIdAct, acuerdoNombreAct, setEsModoActividad, datosActividad, setDatosActividad, datosFuncionario }) => {
    const columnsActividad = useColumnsActividad();
    // const { perfil, esConLicencia } = useContext(PerfilContext);
    // const { titulo, setTitulo } = useState('');
    // const [fecha, setFecha] = useState('');
    const [ActividadId, setActividadId] = useState(-1);
    const [ActividadNombre, setActividadNombre] = useState('');
    // const [ActividadId2, setActividadId2] = useState(-1);
    const [actividadId2, setActividadId2] = useState(-1);
    const [ActividadNombre2, setActividadNombre2] = useState('');
    // const [responsable, setResponsable] = useState('');
    const [responsableIdCombo, setResponsableIdCombo] = useState(-1);
    // const [fechaIni, setFechaIni] = useState('');
    const [fechaIni, setFechaIni] = useState(() => {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    });
    const [fechaFin, setFechaFin] = useState(fechaIni);
    const [estatus, setEstatus] = useState(1);
    // const [estatusColor, setEstatusColor] = useState(1);

    const [esMuestraCamposReq, setEsMuestraCamposReq] = useState(false);
    const [alertaMensaje, setAlertaMensaje] = useState('');

    const [esEditar, setEsEditar] = useState(false);
    const [esNuevo, setEsNuevo] = useState(false);
    const onAceptarB = () => {
        setEsMuestraCamposReq(false)
    };
    const [datosEstatus, setDatosEstatus] = useState([
        // [0, 'Pendiente'],
        // [1, 'Completado'],
        // [2, 'Vencido']
        { value: 1, label: 'Pendiente' },
        { value: 2, label: 'Completado' },
        { value: 3, label: 'Vencido' }
    ]);


    const handleEditActividad = (rowData, cellId) => {
        setActividadId(rowData.original.IdActividad)
        setActividadNombre(rowData.original.Descripcion)
        // setResponsable(rowData.original.Responsable)
        setResponsableIdCombo(parseInt(rowData.original.responsableIdCombo))
        setFechaIni(rowData.original.FechaIni)
        setFechaFin(rowData.original.FechaFin)
        setEstatus(rowData.original.Estatus)
        // setActividadNum(rowData.original.Num)
    }
    const handleSaveActividad = (tipo) => {
        if (tipo == 11) {
            if (ActividadNombre.trim() === '' || responsableIdCombo <= 0
                || fechaIni.trim() === '' || fechaFin.trim() === ''
                //|| estatus === 0
            ) { setEsMuestraCamposReq(true); return }
            if (ActividadId < 0) {

                const idRepetido = datosActividad.find(dato => dato.Descripcion === ActividadNombre.trim());
                if (idRepetido) {
                    setAlertaMensaje('Descripción ya existe, favor de validar')
                    return
                }

                const responsable = datosFuncionario.find(dato => dato.IdUsuario === responsableIdCombo);
                const nombre = responsable ? responsable.Nombre : '';
                agregarActividad({
                    IdAcuerdo: acuerdoIdAct, IdActividad: (datosActividad.length + 1), Descripcion: ActividadNombre, Responsable: nombre, responsableIdCombo: responsableIdCombo
                    , FechaIni: fechaIni, FechaFin: fechaFin, Estatus: estatus,
                    Dias: calcularDiferenciaDias(fechaIni, fechaFin),
                    ListoEditChk: false
                })
            } else {
                editarActividad()
            }
        }
        filtraLocal()
    };
    const handleDeleteActividad = (row, cellId) => {
        const nuevosDatos = datosActividad.filter(dato => dato.IdActividad !== row.original.IdActividad);
        setDatosActividad(nuevosDatos);
        filtraLocal()
    };
    const agregarActividad = (nuevo) => {
        setDatosActividad(prevDatos => [...prevDatos, nuevo]);
        inicializaActividad()
    };
    const editarActividad = () => {
        const nuevos = datosActividad.map((elemento) => {
            if (elemento.IdActividad === ActividadId) {
                const responsable = datosFuncionario.find(dato => dato.IdUsuario === responsableIdCombo);
                const nombre = responsable ? responsable.Nombre : '';
                return {
                    ...elemento,
                    Descripcion: ActividadNombre,
                    responsableIdCombo: parseInt(responsableIdCombo),
                    Responsable: nombre, FechaIni: fechaIni, FechaFin: fechaFin, Estatus: estatus,
                    Dias: calcularDiferenciaDias(fechaIni, fechaFin)
                };
            }
            return elemento; // Devolver el participante sin cambios si no coincide el ID
        });
        setDatosActividad(nuevos);
        inicializaActividad()
    };
    const calcularDiferenciaDias = (fechaIni, fechaFin) => {
        const inicio = new Date(fechaIni);
        const fin = new Date(fechaFin);

        // Calcular la diferencia en milisegundos
        const diferenciaMilisegundos = fin - inicio;

        // Convertir de milisegundos a días y redondear hacia abajo
        return Math.floor(diferenciaMilisegundos / (1000 * 60 * 60 * 24));
    };
    const inicializaActividad = () => {
        setActividadNombre('')
        // setActividadNum('')
        setActividadId(-1)
        // setResponsable('')
        setResponsableIdCombo(-1)
        setFechaIni(() => {
            const today = new Date();
            const yyyy = today.getFullYear();
            const mm = String(today.getMonth() + 1).padStart(2, '0');
            const dd = String(today.getDate()).padStart(2, '0');
            return `${yyyy}-${mm}-${dd}`;
        })
        setFechaFin(fechaIni)
        setEstatus(1)
    }
    const acuerdoGuarda = () => {
        // console.log('xd')
        setEsModoActividad(false)
    }
    // const acuerdoCancela = () => {

    // }
    const filtraLocal = () => {
        console.log('filtra local')

        // var datosFiltrados = datosActividad
        // datosFiltrados = acuerdoIdAct > 0 ? datosFiltrados.filter(item => item.IdAcuerdo == acuerdoIdAct) : [];
        // setDatosActividadLocal(datosFiltrados)


    }
    useEffect(() => {
        setEsNuevo(1)
        filtraLocal()
    }, []);
    useEffect(() => {
        filtraLocal()
    }, [datosActividad]);

    useEffect(() => {
        const actualizarEstatusColor = () => {
            console.log('actualiza color')
            const nuevosDatos = datosActividad.map((actividad) => {
                const { FechaIni, FechaFin, ListoEditChk } = actividad;
                let EstatusColor;
                if (ListoEditChk === 'true') {
                    EstatusColor = 3; // Completada
                } else {
                    const diasRestantes = differenceInDays(new Date(FechaFin), new Date());
                    if (diasRestantes <= 1) {
                        EstatusColor = 2; // Casi vencida
                    } else {
                        EstatusColor = 1; // Pendiente
                    }
                }
                // console.log(EstatusColor)
                return { ...actividad, EstatusColor };
            });
            setDatosActividad(nuevosDatos);
            console.log(datosActividad)
        };
        actualizarEstatusColor();
        //   }, [datosActividad]);
    }, [JSON.stringify(datosActividad)]);

    const {
        archivoNombre,
        setArchivoNombre,
        archivo,
        setArchivo,
        file,
        setFile,
        selectedFileHandler,
        guardarFile,
        handleDownloadFile,
    } = useFrmFichaTecnicaAcuerdoArchivo(datosActividad, acuerdoIdAct, actividadId2, setDatosActividad, setActividadNombre2, setAlertaMensaje);
    const handleDet = (rowData, cellId) => {
        // setEsModoActividadAdjuntar(true)
        setActividadId2(rowData.original.IdAcuerdo)
        setActividadNombre2(rowData.original.Descripcion)
        // setAcuerdoNum(rowData.original.Num)
    };


    return (
        <>
            {/* <SideBarHeader titulo={esNuevo ? ('Actividad') : esEditar ? 'Editar Actividad' : 'Actividad'}></SideBarHeader>
            <br /><br /><br /><br /> */}

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <ElementoBotones esOcultaCancelar={true}
                    // cancelar={acuerdoCancela} 
                    guardar={acuerdoGuarda}></ElementoBotones>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ flexBasis: '100%', flexGrow: 0 }}>
                    <ElementoCampo type='text' lblCampo="Acuerdo :" claCampo="Acuerdo" nomCampo={acuerdoNombreAct} editable={false} />
                </span>
                {/* <span style={{ flexBasis: '49%', flexShrink: 1, marginTop: '0px' }}>
                    <ElementoCampo type='date' lblCampo="Fecha*:" claCampo="fecha" nomCampo={fecha} onInputChange={setFecha} />
                </span> */}

            </div>

            <span style={{ flexBasis: '100%', flexShrink: 1, marginTop: '0px' }}>
                <Frame title="Actividad">

                    {/* <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}> */}

                    <span style={{ flexBasis: '100%', flexGrow: 0 }}>
                        <ElementoCampo type='text' lblCampo="Descripción*:" claCampo="" nomCampo={ActividadNombre} onInputChange={setActividadNombre} />
                    </span>
                    <span style={{ flexBasis: '100%', flexShrink: 1, marginTop: '0px' }}>
                        {/* <ElementoCampo type='text' lblCampo="Responsable*:" claCampo="" nomCampo={responsable} onInputChange={setResponsable} /> */}
                        <ElementoCampo type="selectBusqueda" lblCampo="Responsable*:" claCampo="Nombre" nomCampo={responsableIdCombo} options={datosFuncionario} onInputChange={setResponsableIdCombo} />
                    </span>


                    {/* </div> */}

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ flexBasis: '48%', flexGrow: 0 }}>
                            <ElementoCampo type='date' lblCampo="Fecha ini*:" claCampo="" nomCampo={fechaIni} onInputChange={setFechaIni} />
                        </span>
                        <span style={{ flexBasis: '48%', flexShrink: 1, marginTop: '0px' }}>
                            <ElementoCampo type='date' lblCampo="Fecha fin*:" claCampo="" nomCampo={fechaFin} onInputChange={setFechaFin} />
                        </span>
                    </div>

                    {/* <span style={{ flexBasis: '48%', flexShrink: 1, marginTop: '0px' }}>
                        <ElementoCampo type="select" lblCampo="Estatus*:" claCampo="campo" nomCampo={estatus} options={datosEstatus} onInputChange={setEstatus} />
                    </span> */}

                    {!ActividadNombre2 &&
                        <span style={{ flexBasis: '4%', flexShrink: 1, marginTop: '0px' }}>
                            <i className="bi bi-table fs-2" onClick={() => handleSaveActividad(11)}></i>
                        </span>}

                </Frame >

                <SimpleTable
                    // data={datosActividadLocal} 
                    data={datosActividad.filter(item => item.IdAcuerdo == acuerdoIdAct)}
                    columns={columnsActividad} handleEdit={handleEditActividad}
                    esOcultaFooter={true} esOcultaBotonNuevo={true} esOcultaFiltro={true}
                    handleDelete={handleDeleteActividad} esOcultaBotonArriba={true}
                    handleDet={handleDet}
                    handleDownload={handleDownloadFile}
                    setData={setDatosActividad}
                />

                {ActividadNombre2 &&
                    <Frame title={`Subir Archivo en tabla de Actividad: ${ActividadNombre2}`}>
                        {/* <ElementoCampo type='text' lblCampo="Nombre Archivo*:" claCampo="" nomCampo={archivoNombre} onInputChange={setArchivoNombre} /> */}
                        {/* <label style={{ textAlign: "left" }}>extensión : pdf | imagen</label> */}
                        <label style={{ textAlign: "left" }}>extensión válida : pdf </label>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ flexBasis: '79%', flexGrow: 0 }}>
                                {/* <input type='file' className='form-control' name="profile_pic" onChange={selectedFileHandler} accept=".pdf, .png, .jpg, .jpeg" /> */}
                                <input type='file' className='form-control' name="profile_pic" onChange={selectedFileHandler} accept=".pdf" />
                            </span>
                            <span style={{ flexBasis: '19%', flexShrink: 1, marginTop: '0px' }}>
                                {/* <button type='button' onClick={guardarFile} className='btn btn-primary col-12'>Cargar</button> */}
                                <i className="bi bi-cloud-upload fs-2" onClick={() => guardarFile()}></i>
                            </span>
                            <span style={{ flexBasis: '19%', flexShrink: 1, marginTop: '0px' }}>
                                {/* <button type='button' onClick={guardarFile} className='btn btn-primary col-12'>Cargar</button> */}
                                <i className="bi bi-x fs-2" onClick={() => setActividadNombre2('')}></i>
                            </span>
                        </div>
                    </Frame >
                }

            </span >


            {esMuestraCamposReq &&
                <ElementoToastNotification
                    mensaje={'Los datos con * son requeridos, favor de validar.'}
                    onAceptar={onAceptarB}
                ></ElementoToastNotification>
            }
            {alertaMensaje &&
                <ElementoToastNotification
                    mensaje={alertaMensaje}
                // onAceptar={onAceptarC}
                ></ElementoToastNotification>
            }
        </>
    )
}
// export default FrmFichaTecnicaAcuerdoActividad