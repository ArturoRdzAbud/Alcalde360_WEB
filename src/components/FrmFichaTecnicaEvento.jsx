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

import { format, parseISO } from 'date-fns';

import { useLocation, useNavigate } from "react-router-dom";

export const FrmFichaTecnicaEvento = () => {

    //Parametros recibidos desde form Consultar Incidencia
    const location = useLocation();
    const navigate = useNavigate();
    //const data = location.state;
    const dataParams = location.state;
    //---------------------------------------------------
    
    const { perfil, esConLicencia } = useContext(PerfilContext);

    //variables de registro de la consulta para cargar los grids 
    const { idAlcaldia } = useContext(PerfilContext); // variable global
    const [IdFichaTecnicaEvento, setIdFichaTecnicaEvento] = useState(0)
    const [IdParticipante, setIdParticipante] = useState(0)
    const [IdTipoParticipanteEvento, setIdTipoParticipanteEvento]= useState(0)
    
    //variables de registro del evento
    const [titulo, setTitulo]  = useState('');
    const [FechaHoraInicioEvento, setFechaHoraInicioEvento] = useState(null)
    const [FechaHoraFinalEvento, setFechaHoraFinalEvento] = useState(null)
    const [fecha, setFecha] = useState(null);
    const [hora, setHora] = useState(null);
    const [horaFin, setHoraFin] = useState(null);
    const [lugar, setLugar] = useState('');
    const [IdOrigenAgenda, setIdOrigenAgenda] = useState(-1);
    //const [Origen, setOrigen] = useState('');
    const [Logistica, setLogistica] = useState('');

    // Variables de los invitados para la edicion del Grid

    const [InvitadoIdFichaTecnicaEvento, setInvitadoIdFichaTecnicaEvento]= useState(0);
    const [InvitadoIdParticipante, setInvitadoIdParticipante]= useState(0);
    const [InvitadoIdTipoParticipanteEvento, setInvitadoIdTipoParticipanteEvento]= useState(0);
    const [InvitadoNombreParticipante, setInvitadoNombreParticipante] = useState('');
    const [InvitadoTituloCargo, setInvitadoTituloCargo] = useState('');

    // Variables de los presidium para la edicion del Grid

    const [PresidiumIdFichaTecnicaEvento, setPresidiumIdFichaTecnicaEvento]= useState(0);
    const [PresidiumIdParticipante, setPresidiumIdParticipante]= useState(0);
    const [PresidiumIdTipoParticipanteEvento, setPresidiumIdTipoParticipanteEvento]= useState(0);
    const [PresidiumNombreParticipante, setPresidiumNombreParticipante] = useState('');
    const [PresidiumTituloCargo, setPresidiumTituloCargo] = useState('');

    // Variables de los Programas para la edicion del Grid

    const [ProgramaIdFichaTecnicaEvento, setProgramaIdFichaTecnicaEvento]= useState(0);
    const [ProgramaIdPrograma, setProgramaIdPrograma]= useState(0);
    const [ProgramaNum, setProgramaNum] = useState(0);
    const [ProgramaTema, setProgramaTema] = useState('');

    const [esMuestraCamposReq, setEsMuestraCamposReq] = useState(false);
    const [esEditar, setEsEditar] = useState(dataParams.esEditar);
    const [esFin, setEsFin] = useState(false);
    const [esNuevo, setEsNuevo] = useState(false);

    const [datosOrigen, setDatosOrigen] = useState([]);
    const [datosInvitados, setDatosInvitados] = useState([]);
    const [datosPresidium, setDatosPresidium] = useState([]);
    const [datosProgramas, setDatosProgramas] = useState([]);

    const columnsInvitados = [
        {
            header: 'IdAlcaldia',
            accessorKey: 'IdAlcaldia',
            footer: 'IdAlcaldia'
            , visible: false
        },
        {
            header: 'IdFichaTecnicaEvento',
            accessorKey: 'IdFichaTecnicaEvento',
            visible: false,
        },
        {
            header: 'IdParticipante',
            accessorKey: 'IdParticipante',
            visible: false,
        },
        {
            header: 'IdTipoParticipanteEvento',
            accessorKey: 'IdTipoParticipanteEvento',
            visible: false,
        },
        {
            header: ('Nombre'),
            accessorKey: 'NombreParticipante',
            visible: true,
        },
        {
            header: ('Titulo/Cargo'),
            accessorKey: 'TituloCargo',
            visible: true,
        },
        {
            header: (''),
            accessorKey: 'handleDelete',
            visible: true,
        },
    ];

    const columnsPresidium = [
        {
            header: 'IdAlcaldia',
            accessorKey: 'IdAlcaldia',
            footer: 'IdAlcaldia'
            , visible: false
        },
        {
            header: 'IdFichaTecnicaEvento',
            accessorKey: 'IdFichaTecnicaEvento',
            visible: false,
        },
        {
            header: 'IdParticipante',
            accessorKey: 'IdParticipante',
            visible: false,
        },
        {
            header: 'IdTipoParticipanteEvento',
            accessorKey: 'IdTipoParticipanteEvento',
            visible: false,
        },
        {
            header: ('Nombre'),
            accessorKey: 'NombreParticipante',
            visible: true,
        },
        {
            header: ('Titulo/Cargo'),
            accessorKey: 'TituloCargo',
            visible: true,
        },
        {
            header: (''),
            accessorKey: 'handleDelete',
            visible: true,
        },
    ];

    const columnsProgramas = [
        {
            header: 'IdAlcaldia',
            accessorKey: 'IdAlcaldia',
            footer: 'IdAlcaldia'
            , visible: false
        },
        {
            header: 'IdFichaTecnicaEvento',
            accessorKey: 'IdFichaTecnicaEvento',
            visible: false,
        },
        {
            header: 'IdPrograma',
            accessorKey: 'IdPrograma',
            visible: false,
        },
        {
            header: 'Num.',
            accessorKey: 'Link',
            visible: true,
        },
        {
            header: 'Tema',
            accessorKey: 'Programa',
            visible: true,
        }
    ];

    const onAceptarB = () => {
        setEsMuestraCamposReq(false)
    };


                /*
            if (fechaFintmp.getHours().toString().length == 1) {
                horafin = '0' + fechaFintmp.getHours();
            } else {
                horafin = fechaFintmp.getHours();
            }

            if (fechaFintmp.getMinutes().toString().length == 1) {
                horafin += ':0' + fechaFintmp.getMinutes();
            } else {
                horafin += ':' + fechaFintmp.getMinutes();
            }
            */
    const ObtenerHora = (fechatmp2) => {

        fechatmp2 = new Date(fechatmp2)

        let horatmp = ''
        if (fechatmp2.getHours().toString().length == 1) {
            horatmp = '0' + fechatmp2.getHours();
        } else {
            horatmp = fechatmp2.getHours();
        }

        if (fechatmp2.getMinutes().toString().length == 1) {
            horatmp += ':0' + fechatmp2.getMinutes();
        } else {
            horatmp += ':' + fechatmp2.getMinutes();
        }

        return horatmp
    }

    //-------------------------------------------------------------------SECCION USE EFFFECT
    // llena arreglos de combos
    useEffect(() => {

        var ApiUrl = 'http://localhost:3000/ConsultarCombo?psSpSel=%22ConsultarOrigenAgendaCmb%22';
        
        axios.get(ApiUrl)
        .then(response => { setDatosOrigen(response.data); })
        .catch( error => console.error('Error al obtener el Origen',error))

        if (dataParams.esNuevo == false ) {

            if (dataParams.IdFichaTecEvento == 0) return

            var ApiUrl = config.apiUrl + '/ConsultarEventoParticipantes';
    /*       
            axios.get(ApiUrl, { params: { pnIdAlcaldia: idAlcaldia, pnIdFichaTecnicaEvento: IdFichaTecnicaEvento, pnIdTipoParticipanteEvento: 1 }})
            .then (response => {
                setDatosInvitados(response.data)
                // copio la lista con [...list] y la ordeno con sort()
                const sortedList = [...datosInvitados].sort((a, b) => (a.IdParticipante > b.IdParticipante ? 1 : a.IdParticipante < b.IdParticipante ? -1 : 0))
                // actualizo el estado con la nueva lista ya ordenada
                setDatosInvitados(sortedList)
            })
            .catch (error => {console.error('Error al obtener los invitados', error)})

            console.log('CARGANDO GRIDS invitados', datosInvitados)

            ApiUrl = config.apiUrl + '/ConsultarEventoParticipantes';
            axios.get(ApiUrl, {params: {pnIdAlcaldia: idAlcaldia, pnIdFichaTecnicaEvento: IdFichaTecnicaEvento, pnIdTipoParticipanteEvento: 2 }})
            .then (response => {
                setDatosPresidium(response.data)
                // copio la lista con [...list] y la ordeno con sort()
                const sortedList = [...datosPresidium].sort((a, b) => (a.IdParticipante > b.IdParticipante ? 1 : a.IdParticipante < b.IdParticipante ? -1 : 0))
                // actualizo el estado con la nueva lista ya ordenada
                setDatosPresidium(sortedList)
            })
            .catch (error => {console.error('Error al obtener el Presidium',error)})

            console.log('CARGANDO GRIDS invitados', datosPresidium)
    */

            ApiUrl = config.apiUrl + '/ConsultarEventoProgramas';
            axios.get(ApiUrl, { params: { pnIdAlcaldia: idAlcaldia, pnIdFichaTecnicaEvento: dataParams.IdFichaTecEvento }})
            .then ( response => { 
                setDatosProgramas(response.data);
                // copio la lista con [...list] y la ordeno con sort()
                //const sortedList = [...datosProgramas].sort((a, b) => (a.IdPrograma > b.IdPrograma ? 1 : a.IdPrograma < b.IdPrograma ? -1 : 0))
                // actualizo el estado con la nueva lista ya ordenada
                //setDatosProgramas(sortedList)
                console.log('CARGANDO GRIDS programas', response.data, 'lista de progs: ' + datosProgramas)
            })
            .catch (error => { console.error('Error al obtener los programas', error)})

            console.log('ACTUALIZANDO VALORES')

            console.log('1 ' + dataParams, dataParams.esNuevo, esNuevo, dataParams.IdFichaTecEvento, dataParams.FechaHoraInicioEvento, dataParams.FechaHoraFinalEvento)
        
            const fechaInitmp = new Date(dataParams.FechaHoraInicioEvento)
            const fechaFintmp = new Date(dataParams.FechaHoraFinalEvento)
    
            const fechatmp = new Date(fechaInitmp.getFullYear(), fechaInitmp.getMonth(), fechaInitmp.getDate())
    
            console.log('2 '+ dataParams.esNuevo, fechatmp, fechaInitmp.getFullYear(), fechaFintmp.getFullYear())
    
            console.log('3 CARGANDO GRIDS', esEditar)

            console.log(idAlcaldia, dataParams.IdFichaTecEvento)

            //setEsEditar(false); // para que solo se ejecute al cargar la pantalla

            //variables para cargar los grids
            setIdFichaTecnicaEvento(dataParams.IdFichaTecEvento);

            //mostrar la informacion consultada en la pantalla
            setTitulo(dataParams.TituloEvento);

            console.log('3 '+ fechaInitmp, fechaFintmp)

            setFecha(format(fechatmp, 'yyyy-MM-dd'));

            let horaini = ObtenerHora(fechaInitmp);
            let horafin = ObtenerHora(fechaFintmp);

            setHora(horaini);
            setHoraFin(horafin)

            console.log('4 ', horaini, horafin, fechaInitmp, fechaFintmp)

            setIdOrigenAgenda(dataParams.IdOrigenAgenda);
            setLugar(dataParams.Lugar);
            setLogistica(dataParams.Logistica);

            setEsNuevo(dataParams.esNuevo);
            setEsEditar(dataParams.esEditar);

        }

    },[]); // se ejecuta 1 vez al inicio solamente

     //Carga la consulta de resultados desde BD
    useEffect(() => {
 
        if (dataParams.IdFichaTecEvento == 0) return

        console.log('5 CARGANDO GRIDS', esEditar)

        var ApiUrl = 'http://localhost:3000/ConsultarEventoParticipantes';
/*
        console.log(idAlcaldia, IdFichaTecnicaEvento)

        var ApiUrl = config.apiUrl + '/ConsultarEventoParticipantes';
      
        axios.get(ApiUrl,{params: {pnIdAlcaldia: idAlcaldia, pnIdFichaTecnicaEvento: IdFichaTecnicaEvento, pnIdTipoParticipanteEvento: 1 }})
        .then (response => {
            setDatosInvitados(response.data)
            // copio la lista con [...list] y la ordeno con sort()
            const sortedList = [...datosInvitados].sort((a, b) => (a.IdParticipante > b.IdParticipante ? 1 : a.IdParticipante < b.IdParticipante ? -1 : 0))
            // actualizo el estado con la nueva lista ya ordenada
            setDatosInvitados(sortedList)
        })
        .catch (error => {console.error('Error al obtener los invitados', error)})

        console.log('CARGANDO GRIDS invitados', datosInvitados)

        ApiUrl = config.apiUrl + '/ConsultarEventoParticipantes';
        axios.get(ApiUrl, {params: {pnIdAlcaldia: idAlcaldia, pnIdFichaTecnicaEvento: IdFichaTecnicaEvento, pnIdTipoParticipanteEvento: 2 }})
        .then (response => {
            setDatosPresidium(response.data)
            // copio la lista con [...list] y la ordeno con sort()
            const sortedList = [...datosPresidium].sort((a, b) => (a.IdParticipante > b.IdParticipante ? 1 : a.IdParticipante < b.IdParticipante ? -1 : 0))
            // actualizo el estado con la nueva lista ya ordenada
            setDatosPresidium(sortedList)
        })
        .catch (error => {console.error('Error al obtener el Presidium',error)})

        console.log('CARGANDO GRIDS invitados', datosPresidium)

*/

        ApiUrl = config.apiUrl + '/ConsultarEventoProgramas';
        axios.get(ApiUrl, { params: { pnIdAlcaldia: idAlcaldia, pnIdFichaTecnicaEvento: dataParams.IdFichaTecEvento }})
        .then ( response => { 
            setDatosProgramas(response.data);
            
            // copio la lista con [...list] y la ordeno con sort()
            //const sortedList = [...datosProgramas].sort((a, b) => (a.IdPrograma > b.IdPrograma ? 1 : a.IdPrograma < b.IdPrograma ? -1 : 0))
            // actualizo el estado con la nueva lista ya ordenada
            //setDatosProgramas(sortedList)
            console.log('CARGANDO GRIDS programas', response.data, 'lista de progs: 2' + datosProgramas)
        })
        .catch (error => { console.error('Error al obtener los programas', error)})

        //setEsEditar(false); // para que solo se ejecute al cargar la pantalla

    }, [esEditar]); // Se EJECUTA CUANDO CAMBIA la bandera esEditar // se ejecuta 1 vez al inicio solamente

    const enumTipoDeParticipante = {
        INVITADO: '1',
        PRESIDIUM: '2',
    }

    const ParticipanteEs = (TipoDeParticipante) => {

        if (TipoDeParticipante == 1) { //1 si es invitado
            return enumTipoDeParticipante.INVITADO
        } else if (TipoDeParticipante == 2) { // 2 si es presidium
            return enumTipoDeParticipante.PRESIDIUM
        }
    }

    //validar que muestre los valores del grid en los campos
    
    const handleEditParticipantes = (rowData, cellId) => {

        console.log(rowData.original.IdTipoParticipanteEvento + ' ' + rowData.original.NombreParticipante + ' ' + rowData.original.TituloCargo)

        if (ParticipanteEs(rowData.original.IdTipoParticipanteEvento) == enumTipoDeParticipante.INVITADO) { 
            console.log('INVITADO')
            setInvitadoIdFichaTecnicaEvento(rowData.original.IdFichaTecnicaEvento)
            setInvitadoIdParticipante(rowData.original.IdParticipante)
            setInvitadoIdTipoParticipanteEvento(rowData.original.IdTipoParticipanteEvento)
            setInvitadoNombreParticipante(rowData.original.NombreParticipante)
            setInvitadoTituloCargo(rowData.original.TituloCargo)

        } else if (ParticipanteEs(rowData.original.IdTipoParticipanteEvento) == enumTipoDeParticipante.PRESIDIUM) { 
            console.log('PRESIDIUM')
            setPresidiumIdFichaTecnicaEvento(rowData.original.IdFichaTecnicaEvento)
            setPresidiumIdParticipante(rowData.original.IdParticipante)
            setPresidiumIdTipoParticipanteEvento(rowData.original.IdTipoParticipanteEvento)
            setPresidiumNombreParticipante(rowData.original.NombreParticipante)
            setPresidiumTituloCargo(rowData.original.TituloCargo)
        }  
        console.log(InvitadoNombreParticipante + ' ' + PresidiumNombreParticipante)
    }

    const handleEditProgramas = (rowData, cellId) => {

        setProgramaIdFichaTecnicaEvento(rowData.original.IdFichaTecnicaEvento)
        setProgramaIdPrograma(rowData.original.IdPrograma)
        setProgramaNum(rowData.original.Link)  
        setProgramaTema(rowData.original.Programa)

    }

    // falta validar bien los campos del grid para que agrege los valores al grid
    
    const handleSave = (tipo) => {

        console.log(tipo + ' ' + InvitadoIdParticipante)

        if (tipo == 1) { // Guardar Invitados
            console.log(InvitadoNombreParticipante + '-' + InvitadoTituloCargo + '-' + InvitadoIdParticipante)
            if (InvitadoNombreParticipante.trim() === '' || InvitadoTituloCargo.trim() === '') { setEsMuestraCamposReq(true); return }
           
            if (InvitadoIdParticipante == 0) {
               
                const UltimoIdParticipante = datosInvitados.length > 0 && datosInvitados[datosInvitados.length-1].IdParticipante > 0 ? (datosInvitados[datosInvitados.length-1].IdParticipante + 1) : (datosInvitados.length + 1)
                agregarInvitado({ IdFichaTecnicaEvento: InvitadoIdFichaTecnicaEvento, IdParticipante: UltimoIdParticipante, IdTipoParticipanteEvento: 1, NombreParticipante: InvitadoNombreParticipante, TituloCargo: InvitadoTituloCargo })
                      
            } else {
                editInvitado()
            }

        }
        if (tipo == 2) { // Guardar Presidium
            console.log(PresidiumNombreParticipante + '-' + PresidiumTituloCargo + '-' + PresidiumIdParticipante)
           
            if (PresidiumNombreParticipante.trim() === '' || PresidiumTituloCargo.trim() === '') { setEsMuestraCamposReq(true); return }
           
            if (PresidiumIdParticipante == 0) {

                const UltimoIdParticipante = datosPresidium.length > 0 && datosPresidium[datosPresidium.length-1].IdParticipante > 0 ? (datosPresidium[datosPresidium.length-1].IdParticipante + 1) : (datosPresidium.length + 1)
                
                agregarPresidium({ IdFichaTecnicaEvento: PresidiumIdFichaTecnicaEvento, IdParticipante: UltimoIdParticipante, IdTipoParticipanteEvento: 2, NombreParticipante: PresidiumNombreParticipante, TituloCargo: PresidiumTituloCargo })
                       
            } else {
                editarPresidium()
            }
        }
        if (tipo == 3) { // Guardar Programas
            console.log(ProgramaTema + '-' + ProgramaNum + '-' + ProgramaIdPrograma)
           
            if (ProgramaNum.trim() === '' || ProgramaTema.trim() === '') { setEsMuestraCamposReq(true); return }
           
            if (ProgramaIdPrograma == 0) {  

                const UltimoIdPrograma = datosProgramas.length > 0 && datosProgramas[datosProgramas.length-1].IdPrograma > 0 ? (datosProgramas[datosProgramas.length-1].IdPrograma + 1) : (datosProgramas.length + 1)
                
                agregarProgramas( {IdFichaTecnicaEvento: ProgramaIdFichaTecnicaEvento, IdPrograma: UltimoIdPrograma, Link: ProgramaNum, Programa: ProgramaTema })
           
            } else {
                editarPrograma()
            }
        }

    };

    const agregarInvitado = (nuevoParticipante) => {
        console.log('agregarInvitado')
        setDatosInvitados(prevDatos => [...prevDatos, nuevoParticipante]);
        inicializaInvitados()
    };

    const agregarPresidium = (nuevo) => {
        console.log('agregarPresidium')
        setDatosPresidium(prevDatos => [...prevDatos, nuevo]);
        inicializaPresidium()
    };

    const agregarProgramas = (nuevo) => {
        console.log('agregarProgramas')
        //setDatosProgramas(prevDatos => [...prevDatos, nuevo]);
        inicializaProgramas()
    };

    const handleDeleteInvitado = (row, cellId) => {
        const nuevosDatos = datosInvitados.filter(dato => dato.IdFichaTecnicaEvento == row.original.IdFichaTecnicaEvento && dato.IdParticipante !== row.original.IdParticipante);
        setDatosInvitados(nuevosDatos);
    };

    const handleDeletePresidium = (row, cellId) => {
        const nuevosDatos = datosPresidium.filter(dato => dato.IdFichaTecnicaEvento == row.original.IdFichaTecnicaEvento && dato.IdParticipante !== row.original.IdParticipante);
        setDatosPresidium(nuevosDatos);
    };

    const handleDeletePrograma = (row, cellId) => {
        const nuevosDatos = datosProgramas.filter(dato => dato.IdFichaTecnicaEvento == row.original.IdFichaTecnicaEvento && dato.IdPrograma !== row.original.IdPrograma);
        //setDatosProgramas(nuevosDatos);
    };

    const editInvitado = () => {
        console.log('editInvitado ')
        const nuevosParticipantes = datosInvitados.map((participante) => {
            if (participante.IdFichaTecnicaEvento == InvitadoIdFichaTecnicaEvento && participante.IdParticipante === InvitadoIdParticipante) {
                return {
                    ...participante, // Mantiene los datos existentes
                    NombreParticipante: InvitadoNombreParticipante, // Sobrescribe el campo de nombre
                    TituloCargo: InvitadoTituloCargo, // Sobrescribe el campo de puesto
                };
            }
            return participante; // Devolver el participante sin cambios si no coincide el ID
        });
        setDatosInvitados(nuevosParticipantes);
        inicializaInvitados()
    };

    const editarPresidium = () => {
        console.log('editarPresidium')
        const nuevosPresidium = datosPresidium.map((Presidium) => {
            if (Presidium.IdFichaTecnicaEvento == PresidiumIdFichaTecnicaEvento && Presidium.IdParticipante === PresidiumIdParticipante) {
                return {
                    ...Presidium, // Mantiene los datos existentes
                    NombreParticipante: PresidiumNombreParticipante, // Sobrescribe el campo de nombre
                    TituloCargo: PresidiumTituloCargo, // Sobrescribe el campo de puesto
                };
            }
            return Presidium; // Devolver el participante sin cambios si no coincide el ID
        });
        setDatosPresidium(nuevosPresidium);
        inicializaPresidium()
    };

    const editarPrograma = () => {
        console.log('editarPrograma')
        const nuevosProgramas = datosProgramas.map((programa) => {
            if (programa.IdFichaTecnicaEvento == ProgramaIdFichaTecnicaEvento && programa.IdPrograma === ProgramaIdPrograma) {
                return {
                    ...programa,
                    Link: ProgramaNum,
                    Programa: ProgramaTema,
                };
            }
            return programa; // Devolver el participante sin cambios si no coincide el ID
        });
        //setDatosProgramas(nuevosProgramas);
        inicializaProgramas()
    };

    const inicializaInvitados = () => {
        setInvitadoNombreParticipante('')
        setInvitadoTituloCargo('')
        setInvitadoIdParticipante(0)
    }

    const inicializaPresidium = () => {
        setPresidiumNombreParticipante('')
        setPresidiumTituloCargo('')
        setPresidiumIdParticipante(0)
    }

    const inicializaProgramas = () => {
        setProgramaNum('')
        setProgramaTema('')
        setProgramaIdPrograma(0)
    }

    useEffect(() => {
        setEsNuevo(1)
    }, []);


    const guardarFichaTecnicaEvento = async (e) => {
        e.preventDefault();

        //convierte arreglo a xml para parametro sql
        var xmlString1 = '';
/*
        const tIni = new Date();

        const pInicio = vInicio.split(":");

        tIni.setHours(pInicio[0], pInicio[1]);

        const tFin = new Date();

        const pFin = vFinal.split(":");

        tFin.setHours(pFin[0], pFin[1]);*/

        if (hora == null || horaFin == null) { setEsMuestraCamposReq(true); return }

        const fecha2 = new Date(fecha)
        console.log('1 fecha evento: '+ fecha + ' '+ hora.split(':')[0] +':'+ hora.split(':')[1], 'fecha 2 evento: ' + fecha + ' '+ horaFin.split(':')[0] +':'+ horaFin.split(':')[1], fecha2.getFullYear(), fecha2.getMonth(), fecha2.getDate(), hora, horaFin, hora.split(':')[0], hora.split(':')[1])

        //setFechaHoraInicioEvento(new Date(fecha2.getFullYear(), fecha2.getMonth(), fecha2.getDate(), hora.split(':')[0], hora.split(':')[1]))
        //setFechaHoraFinalEvento(new Date(fecha2.getFullYear(), fecha2.getMonth(), fecha2.getDate(), horaFin.split(':')[0], horaFin.split(':')[1]))
        setFechaHoraInicioEvento(fecha + ' '+ hora.split(':')[0] +':'+ hora.split(':')[1])
        setFechaHoraFinalEvento(fecha + ' '+ horaFin.split(':')[0] +':'+ horaFin.split(':')[1])

        console.log('2 '+ idAlcaldia, titulo, 'fecha hora inicio: ' + FechaHoraInicioEvento, 'fecha hora fin: ' + FechaHoraFinalEvento, lugar, Logistica, IdOrigenAgenda)
        
        if (idAlcaldia == 0) { setEsMuestraCamposReq(true); return }
        if (titulo === null || titulo.trim() == '') { setEsMuestraCamposReq(true); return }
        if (FechaHoraInicioEvento == null || FechaHoraFinalEvento == null) { setEsMuestraCamposReq(true); return }
        if (hora == null || horaFin == null) { setEsMuestraCamposReq(true); return }
       
        if (lugar === null || lugar.trim() == '') { setEsMuestraCamposReq(true); return }
        if (Logistica === null || Logistica.trim() == '') { setEsMuestraCamposReq(true); return }
        if (IdOrigenAgenda == 0) { setEsMuestraCamposReq(true); return }

         // todo validar requeridas las horas    
         console.log('3 '+ idAlcaldia, titulo, FechaHoraInicioEvento, FechaHoraFinalEvento, hora, horaFin, lugar, Logistica, IdOrigenAgenda)

        const data = {
    
          pnIdAlcaldia: idAlcaldia,
          pnIdFichaTecnicaEvento: IdFichaTecnicaEvento,
          psTituloEvento: titulo,
          pdFechaHoraInicioEvento: format(FechaHoraInicioEvento,'yyyy-MM-dd HH:mm:ss'),
          pdFechaHoraFinalEvento: format(FechaHoraFinalEvento,'yyyy-MM-dd HH:mm:ss'),
          pnIdOrigenAgenda : IdOrigenAgenda,
          psLugarEvento: lugar,
          psLogistica : Logistica,
          pnClaUsuarioMod: 0
        };
    
        const apiReq = config.apiUrl + '/GuardarFichaTecnicaEvento';
        
        console.log('4 Guardando los datos.', data);
    
        try {
    
            const response = await axios.post(apiReq, { data }, { 'Access-Control-Allow-Origin': '*' })
            console.log("Response Data:", response.data);
    
            const IdFicha = response.data[0].IdFichaTecnicaEvento; //se debe especificar el registro 0 ya que el response es un arreglo
            console.log('IdFichaTecnicaEvento Generado:', IdFicha);

            if (IdFicha > 0) {

                // Actualizar idfichatecnicaevento insertado a toda la lista
                const datosInvitados2 = datosInvitados.map((invitado) => {
                    if (invitado.IdFichaTecnicaEvento == 0) {
                        return {
                            ...invitado,
                            IdFichaTecnicaEvento: IdFicha,
                        };
                    }
                    return invitado; // Devolver el participante sin cambios si no coincide el ID
                });
               
                 //const datosInvitadosTmp = datosEquipo1.filter((equipo1) => {return equipo1.ActivoChk;});
                const datosInvitadosTmp = datosInvitados2.map(({ idAlcaldia, 
                                                                IdFichaTecnicaEvento, 
                                                                IdParticipante, 
                                                                IdTipoParticipanteEvento, 
                                                                NombreParticipante, 
                                                                TituloCargo, 
                                                                ClaUsuarioMod }) => ({ idAlcaldia, 
                                                                                       IdFichaTecnicaEvento, 
                                                                                       IdParticipante, 
                                                                                       IdTipoParticipanteEvento, 
                                                                                       NombreParticipante, 
                                                                                       TituloCargo, 
                                                                                       ClaUsuarioMod }));

                let xmlDoc = document.implementation.createDocument(null, "data");
                let rootElement = xmlDoc.documentElement;
                datosInvitadosTmp.forEach(item => {
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

                xmlString1 = new XMLSerializer().serializeToString(xmlDoc);

                console.log('5 ' + xmlString1)

                //convierte arreglo a xml para parametro sql
                var xmlString2
                xmlString2 = ''

                // Actualizar idfichatecnicaevento insertado a toda la lista
                const datosPresidium2 = datosPresidium.map((item) => {
                    if (item.IdFichaTecnicaEvento == 0) {
                        return {
                            ...item,
                            IdFichaTecnicaEvento: IdFicha,
                        };
                    }
                    return item; // Devolver el participante sin cambios si no coincide el ID
                });

                //const datosInvitadosTmp = datosEquipo1.filter((equipo1) => {return equipo1.ActivoChk;});
                const datosPresidiumTmp = datosPresidium2.map(({ idAlcaldia, 
                                                                 IdFichaTecnicaEvento, 
                                                                 IdParticipante, 
                                                                 IdTipoParticipanteEvento, 
                                                                 NombreParticipante, 
                                                                 TituloCargo, 
                                                                 ClaUsuarioMod }) => ({ idAlcaldia, 
                                                                                       IdFichaTecnicaEvento, 
                                                                                       IdParticipante, 
                                                                                       IdTipoParticipanteEvento, 
                                                                                       NombreParticipante, 
                                                                                       TituloCargo, 
                                                                                       ClaUsuarioMod }));
                xmlDoc = document.implementation.createDocument(null, "data");
                rootElement = xmlDoc.documentElement;
                datosPresidiumTmp.forEach(item => {
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

                xmlString2 = new XMLSerializer().serializeToString(xmlDoc);
                
                console.log('6 ' + xmlString2)

                //convierte arreglo a xml para parametro sql
                var xmlString3
                xmlString3 = ''

                // Actualizar idfichatecnicaevento insertado a toda la lista
                const datosProgramas2 = datosProgramas.map((item) => {
                    if (item.IdFichaTecnicaEvento == 0) {
                        return {
                            ...item,
                            IdFichaTecnicaEvento: IdFicha,
                        };
                    }
                    return item; // Devolver el participante sin cambios si no coincide el ID
                });

                //const datosInvitadosTmp = datosEquipo1.filter((equipo1) => {return equipo1.ActivoChk;});
                const datosProgramasTmp = datosProgramas2.map(({ idAlcaldia, 
                                                                IdFichaTecnicaEvento, 
                                                                IdPrograma, 
                                                                Link, 
                                                                Programa, 
                                                                ClaUsuarioMod }) => ({ idAlcaldia, 
                                                                                       IdFichaTecnicaEvento, 
                                                                                       IdPrograma, 
                                                                                       Link, 
                                                                                       Programa, 
                                                                                       ClaUsuarioMod }));
                xmlDoc = document.implementation.createDocument(null, "data");
                rootElement = xmlDoc.documentElement;
                datosProgramasTmp.forEach(item => {
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

                xmlString3 = new XMLSerializer().serializeToString(xmlDoc);
                
                console.log('7  ' + xmlString3)

                const data = {
                    pnIdAlcaldia: idAlcaldia,
                    pnIdFichaTecnicaEvento: IdFicha,
                    pnClaUsuarioMod: 0,
                    psXmlResultados1: xmlString1,
                    psXmlResultados2: xmlString2,
                    psXmlResultados3: xmlString3,
                };

                const apiReq = config.apiUrl + '/GuardaFichaTecnicaEventoGrids';

                try {
                    
                    await axios.post(apiReq, { data })
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
                            //setEsRegresaDeEditar(true)
                            //inicializaCampos()
                            setEsEditar(false)//regresa al grid
                            setEsNuevo(false)

                            const data = {
                                esNuevo: true      
                            };
                          
                            navigate("/ConsultarEventos", { state: data });
                        }
                    })    
                
                } catch (error) {
                     console.error('Error al guardar la captura de resultados', error);
                }

            }
                        
            setEsFin(true);

        } catch (error) {

            console.error('Error al guardar el evento.', error);

        }

    }

    const regresar = () => {
        console.log('regresando a la pagina')
        navigate(-1);
      };

    const cancelar = () => {
        //inicializaCampos()
        setEsEditar(false)
        setEsNuevo(false)
        regresar();  //regresa a la pantalla anterior
    };

    return (
        <>
            <SideBarHeader titulo={esNuevo ? ('Ficha Técnica del Evento') : esEditar ? 'Editar Ficha Técnica del Evento' : 'Consulta del Evento'}></SideBarHeader>
            <br /><br /><br /><br />

            <form onSubmit={guardarFichaTecnicaEvento}>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <ElementoBotones cancelar={cancelar}></ElementoBotones>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

                    <span style={{ flexBasis: '99%', flexGrow: 0 }}>
                
                        <Frame title="Datos del evento">

                            <span style={{ flexBasis: '95%', flexGrow: 0 }}>
                                <ElementoCampo type='text' lblCampo="Título* :" claCampo="Nombre" nomCampo={titulo} onInputChange={setTitulo} tamanioString={100} />
                            </span>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

                                <span style={{ flexBasis: '65%', flexShrink: 1, marginTop: '0px' }}>
                                    <ElementoCampo type='date' lblCampo="Fecha evento*:" claCampo="fecha" nomCampo={fecha} onInputChange={setFecha} onClick={setFecha} />
                                </span>
                                <span style={{ flexBasis: '15%', flexShrink: 1, marginTop: '0px' }}>
                                    <ElementoCampo type='time' lblCampo="Hora Inicio*:" claCampo="hora" nomCampo={hora} onInputChange={setHora} onClick={setHora} />
                                </span>
                                <span style={{ flexBasis: '15%', flexShrink: 1, marginTop: '0px' }}>
                                    <ElementoCampo type='time' lblCampo="Hora Fin*:" claCampo="horaFin" nomCampo={horaFin} onInputChange={setHoraFin} onClick={setHoraFin} />
                                </span>

                            </div>

                                <span style={{ flexBasis: '95%', flexShrink: 1, marginTop: '0px' }}>
                                    <ElementoCampo type='select' lblCampo="Origen*:" claCampo="Origen" nomCampo={IdOrigenAgenda} options={datosOrigen} onInputChange={setIdOrigenAgenda} />
                                </span>
                                    
                                <span style={{ flexBasis: '95%', flexShrink: 1, marginTop: '0px' }}>
                                    <ElementoCampo type='text' lblCampo="Lugar*:" claCampo="Lugar" nomCampo={lugar} onInputChange={setLugar} />
                                </span>

                                <span style={{ flexBasis: '95%', flexGrow: 1 }}>
                                    <ElementoCampo type='text' lblCampo="Logística*:" claCampo="Logistica" nomCampo={Logistica} onInputChange={setLogistica} />
                                </span>
                        
                        </Frame>

                    </span> 

                </div> 

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

                    <span style={{ flexBasis: '95%', flexGrow: 1 }}>
        
                        <Frame title="Personal y programas">

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                
                                <span style={{ flexBasis: '99%', flexGrow: 1 }}>

                                    <Frame title="Presidium">

                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            
                                            <span style={{ flexBasis: '70%', flexGrow: 1 }}>
                                                <ElementoCampo type='text' lblCampo="Nombre*:" claCampo="" nomCampo={PresidiumNombreParticipante} onInputChange={setPresidiumNombreParticipante} />
                                            </span>

                                            <span style={{ flexBasis: '25%', flexShrink: 1, marginTop: '0px' }}>
                                                <ElementoCampo type='text' lblCampo="Título/Cargo*:" claCampo="" nomCampo={PresidiumTituloCargo} onInputChange={setPresidiumTituloCargo} />
                                            </span>

                                            <span style={{ flexBasis: '5%', flexShrink: 1, marginTop: '0px' }}>
                                                {/* <button type="button" className="btn btn-primary" onClick={() => handleSave(1)} ><Pagenew /></button> */}
                                                <i className="bi bi-table fs-2" onClick={() => handleSave(2)}></i>
                                            </span>

                                        </div>

                                        <SimpleTable data={datosPresidium} columns={columnsPresidium} handleEdit={handleEditParticipantes}
                                                esOcultaFooter={true} esOcultaBotonNuevo={true} esOcultaFiltro={true} esOcultaBotonArriba={true}
                                                handleDelete={handleDeletePresidium} />

                                    </Frame >

                                </span>

                            </div>

                            <Frame title="Invitados" >

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ flexBasis: '70%', flexGrow: 1 }}>
                                        <ElementoCampo type='text' lblCampo="Nombre *:" claCampo="" nomCampo={InvitadoNombreParticipante} onInputChange={setInvitadoNombreParticipante} />
                                    </span>
                                    <span style={{ flexBasis: '25%', flexShrink: 1, marginTop: '0px' }}>
                                        <ElementoCampo type='text' lblCampo="Título/Cargo*:" claCampo="" nomCampo={InvitadoTituloCargo} onInputChange={setInvitadoTituloCargo} />
                                    </span>
                                    <span style={{ flexBasis: '5%', flexShrink: 1, marginTop: '0px' }}>
                                        {/* <button type="button" className="btn btn-primary" onClick={() => handleSave(1)} ><Pagenew /></button> */}
                                        <i className="bi bi-table fs-2" onClick={() => handleSave(1)}></i>
                                    </span>
                                </div>
                                
                                <SimpleTable data={datosInvitados} columns={columnsInvitados} handleEdit={handleEditParticipantes}
                                            esOcultaFooter={true} esOcultaBotonNuevo={true} esOcultaFiltro={true} esOcultaBotonArriba={true}
                                            // handleDelete={() => handleDelete(1,datosInvitados,'idParticipante')} />
                                            handleDelete={handleDeleteInvitado} />
        
                            </Frame >

                            <Frame title="Programas" >

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                
                                    <span style={{ flexBasis: '15%', flexGrow: 0 }}>
                                        <ElementoCampo type='text' lblCampo="Num.*:" claCampo="" nomCampo={ProgramaNum} onInputChange={setProgramaNum} />
                                    </span>
                                    <span style={{ flexBasis: '75%', flexShrink: 1, marginTop: '0px' }}>
                                        <ElementoCampo type='text' lblCampo="Tema*:" claCampo="" nomCampo={ProgramaTema} onInputChange={setProgramaTema} />
                                    </span>
                                    <span style={{ flexBasis: '5%', flexShrink: 1, marginTop: '0px' }}>
                                        {/* <button type="button" className="btn btn-primary" onClick={() => handleSave(1)} ><Pagenew /></button> */}
                                        <i className="bi bi-table fs-2" onClick={() => handleSave(3)}></i>
                                    </span>

                                </div>
                                
                                <SimpleTable 
                                    data={datosProgramas} 
                                    columns={columnsProgramas} 
                                    handleEdit={handleEditProgramas}
                                    esOcultaFooter={true} 
                                    esOcultaBotonNuevo={true} 
                                    esOcultaFiltro={true} 
                                    esOcultaBotonArriba={true}
                                    // handleDelete={() => handleDelete(1,datosInvitados,'idParticipante')} />
                                    handleDelete={handleDeletePrograma} 
                                    setData={setDatosProgramas}/>
{/*
                    <SimpleTable
                    // data={datosActividadLocal} 
                    data={datosActividad.filter(item => item.IdAcuerdo == acuerdoIdAct)}
                    columns={columnsActividad} 
                    handleEdit={handleEditActividad}
                    esOcultaFooter={true} 
                    esOcultaBotonNuevo={true} 
                    esOcultaFiltro={true}
                    handleDelete={handleDeleteActividad} 
                    esOcultaBotonArriba={true}
                    handleDet={handleDet}
                    handleDownload={handleDownload}
                    setData={setDatosActividad}
                />*/}
                                                   
                            </Frame >

                        </Frame>

                    </span>    

                </div> 
            </form>
            {esMuestraCamposReq &&
                <ElementoToastNotification
                    mensaje={'Los datos con * son requeridos, favor de validar.'}
                    onAceptar={onAceptarB}
                ></ElementoToastNotification>
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
        </>
    )
}
export default FrmFichaTecnicaEvento