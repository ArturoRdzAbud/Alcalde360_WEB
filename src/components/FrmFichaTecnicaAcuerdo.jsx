import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import SimpleTable from './SimpleTable';
import { ElementoCampo } from './ElementoCampo';
import { SideBarHeader } from './SideBarHeader';
import config from '../config'; // archivo configs globales del proy
import { PerfilContext } from './PerfilContext'; // Importa el contexto
import { ElementoBotones } from './ElementoBotones'
import Frame from './ElementoFrame';
import { ElementoToastNotification } from './ElementoToastNotification';
import Pagenew from '../svg/icon-save.svg?react'

export const FrmFichaTecnicaAcuerdo = ({ acuerdoIdAct, acuerdoNombreAct,setEsModoActividad,datosActividad,setDatosActividad }) => {
    // const { perfil, esConLicencia } = useContext(PerfilContext);
    // const { titulo, setTitulo } = useState('');
    // const [fecha, setFecha] = useState('');
    const [ActividadId, setActividadId] = useState(-1);
    const [ActividadNombre, setActividadNombre] = useState('');
    const [responsable, setResponsable] = useState('');
    const [fechaIni, setFechaIni] = useState('');
    const [fechaFin, setFechaFin] = useState('');
    const [estatus, setEstatus] = useState(0);
    const [esMuestraCamposReq, setEsMuestraCamposReq] = useState(false);

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
    // const [datosActividad, setDatosActividad] = useState([]);
    const columnsActividad = [
        {
            header: 'IdActividad',
            accessorKey: 'IdActividad',
            visible: false,
        },
        {
            header: ('Descripción'),
            accessorKey: 'Descripcion',
            visible: true,
        },
        {
            header: ('Responsable'),
            accessorKey: 'Responsable',
            visible: true,
        },
        {
            header: ('Inicio'),
            accessorKey: 'FechaIni',
            visible: true,
        },
        {
            header: ('Fin'),
            accessorKey: 'FechaFin',
            visible: true,
        },
        {
            header: ('Estatus'),
            accessorKey: 'Estatus',
            visible: false,
        },
        {
            header: ('Estatus'),
            accessorKey: 'NomEstatus',
            visible: true,
        },
        {
            header: ('Listo'),
            accessorKey: 'Completado',
            visible: true,
        },
        {
            header: ('Días'),
            accessorKey: 'Dias',
            visible: true,
        },
        {
            header: ('Lnk'),
            accessorKey: 'AdjuntarLnk',
            visible: true,
        },
        {
            header: (''),
            accessorKey: 'handleDelete',
            visible: true,
        },
    ];

    const handleEditActividad = (rowData, cellId) => {
        setActividadId(rowData.original.IdActividad)
        setActividadNombre(rowData.original.Descripcion)
        setResponsable(rowData.original.Responsable)
        setFechaIni(rowData.original.FechaIni)
        setFechaFin(rowData.original.FechaFin)
        setEstatus(rowData.original.Estatus)
        // setActividadNum(rowData.original.Num)
    }
    const handleSave = (tipo) => {
        if (tipo == 11) {
            if (ActividadNombre.trim() === '' || responsable.trim() === ''
                || fechaIni.trim() === '' || fechaFin.trim() === ''
                || estatus === 0
            ) { setEsMuestraCamposReq(true); return }
            if (ActividadId < 0) {
                agregarActividad({
                    IdActividad: (datosActividad.length + 1), Descripcion: ActividadNombre, Responsable: responsable
                    , FechaIni: fechaIni, FechaFin: fechaFin, Estatus: estatus,
                })
            } else {
                editarActividad()
            }
        }
    };
    const handleDeleteActividad = (row, cellId) => {
        const nuevosDatos = datosActividad.filter(dato => dato.IdActividad !== row.original.IdActividad);
        setDatosActividad(nuevosDatos);
    };
    const agregarActividad = (nuevo) => {
        setDatosActividad(prevDatos => [...prevDatos, nuevo]);
        inicializaActividad()
    };
    const editarActividad = () => {
        const nuevos = datosActividad.map((elemento) => {
            if (elemento.IdActividad === ActividadId) {
                return {
                    ...elemento,
                    Descripcion: ActividadNombre,
                    Responsable: responsable, FechaIni: fechaIni, FechaFin: fechaFin, Estatus: estatus,
                };
            }
            return elemento; // Devolver el participante sin cambios si no coincide el ID
        });
        setDatosActividad(nuevos);
        inicializaActividad()
    };
    const inicializaActividad = () => {
        setActividadNombre('')
        // setActividadNum('')
        setActividadId(-1)
        setResponsable('')
        setFechaIni('')
        setFechaFin('')
        setEstatus(-1)
    }
    const acuerdoGuarda = () => {
        // console.log('xd')
        setEsModoActividad(false)
    }
    // const acuerdoCancela = () => {

    // }

    useEffect(() => {
        setEsNuevo(1)
    }, []);

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
                        <ElementoCampo type='text' lblCampo="Responsable*:" claCampo="" nomCampo={responsable} onInputChange={setResponsable} />
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

                    <span style={{ flexBasis: '48%', flexShrink: 1, marginTop: '0px' }}>
                        {/* <ElementoCampo type='date' lblCampo="Estatus*:" claCampo="" nomCampo={estatus} onInputChange={setEstatus} /> */}
                        <ElementoCampo type="select" lblCampo="Estatus*:" claCampo="campo" nomCampo={estatus} options={datosEstatus} onInputChange={setEstatus} />
                    </span>

                    <span style={{ flexBasis: '4%', flexShrink: 1, marginTop: '0px' }}>
                        <i className="bi bi-table fs-2" onClick={() => handleSave(11)}></i>
                    </span>

                </Frame >
                <SimpleTable data={datosActividad} columns={columnsActividad} handleEdit={handleEditActividad}
                    esOcultaFooter={true} esOcultaBotonNuevo={true} esOcultaFiltro={true} esOcultaBotonArriba={false}
                    handleDelete={handleDeleteActividad} />
            </span >


            {esMuestraCamposReq &&
                <ElementoToastNotification
                    mensaje={'Los datos con * son requeridos, favor de validar.'}
                    onAceptar={onAceptarB}
                ></ElementoToastNotification>
            }
        </>
    )
}
// export default FrmFichaTecnicaAcuerdoActividad