// const [datosActividadLocal, setDatosActividadLocal] = useState([]);
    // const columnsActividad = [
    //     {
    //         header: 'IdAcuerdo',
    //         accessorKey: 'IdAcuerdo',
    //         visible: false,
    //     },
    //     {
    //         header: 'IdActividad',
    //         accessorKey: 'IdActividad',
    //         visible: false,
    //     },
    //     {
    //         header: ('Descripción'),
    //         accessorKey: 'Descripcion',
    //         visible: true,
    //     },
    //     {
    //         header: ('Responsable'),
    //         accessorKey: 'Responsable',
    //         visible: true,
    //     },
    //     {
    //         header: ('responsableIdCombo'),
    //         accessorKey: 'responsableIdCombo',
    //         visible: false,
    //     },
    //     {
    //         header: ('Inicio'),
    //         accessorKey: 'FechaIni',
    //         visible: true,
    //     },
    //     {
    //         header: ('Fin'),
    //         accessorKey: 'FechaFin',
    //         visible: true,
    //     },
    //     {
    //         header: ('Estatus'),
    //         accessorKey: 'Estatus',
    //         visible: false,
    //     },
    //     {
    //         header: ('Estatus'),
    //         accessorKey: 'NomEstatus',
    //         visible: true,
    //     },
    //     {
    //         header: ('Listo'),
    //         accessorKey: 'Completado',
    //         visible: true,
    //     },
    //     {
    //         header: ('Días'),
    //         accessorKey: 'Dias',
    //         visible: true,
    //     },
    //     {
    //         header: ('File'),
    //         accessorKey: 'File',
    //         visible: false,
    //     },
    //     {
    //         header: ('Adjuntar'),
    //         accessorKey: 'handleDet',
    //         visible: true,
    //     },
    //     {
    //         header: (''),
    //         accessorKey: 'handleDownload',
    //         visible: true,
    //     },
    //     {
    //         header: (''),
    //         accessorKey: 'handleDelete',
    //         visible: true,
    //     },


    // ];








// useMiLogica.js
import { useState } from 'react';

export default function FrmFichaTecnicaAcuerdoArchivo() {
    // const [estado, setEstado] = useState(false);
    // const toggleEstado = () => setEstado(!estado);
    // return { estado, toggleEstado };

    const [archivoNombre, setArchivoNombre] = useState('');
    const [archivo, setArchivo] = useState(null);
    const [file, setFile] = useState(null);
    const [archivoDownload, setArchivoDownload] = useState(null);
    const handleDet = (rowData, cellId) => {
        // setEsModoActividadAdjuntar(true)
        setActividadId2(rowData.original.IdAcuerdo)
        setActividadNombre2(rowData.original.Descripcion)
        // setAcuerdoNum(rowData.original.Num)
    };
    const selectedFileHandler = e => {
        console.log('ARCHIVO SELECCIONADO:')
        setFile(null)
        // setUserProfileImage('')
        setFile(e.target.files[0])
    }
    const guardarFile = async (e) => {
        // const apiReq = config.apiUrl + '/GuardarFile';
        const formData = new FormData()
        formData.append('foto', file)
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
                // console.log(ActividadId2)
                // console.log(file)
                setArchivo(file)
                actualizarArchivoEnActividad(ActividadId2, file);

                // if (archivoNombre.trim() === '') { setEsMuestraCamposReq(true); console.log('return'); return }

                // const nuevoArchivo = {
                //     IdArchivo: ,
                //     Nombre: archivoNombre,
                //     Archivo: file.name,
                //     ArchivoFile: file,
                //     ArchivoBin: null // Inicialmente vacío
                // };
                // const updatedColumnsActividad = columnsActividad.map(row => {
                //     if (row.id === 1) {  // Aquí defines el identificador del renglón
                //         return {
                //             ...row,
                //             file: ''
                //         };
                //     }
                //     return row;
                // });
                // setColumnsActividad(updatedColumnsActividad);

                // const reader = new FileReader();
                // reader.onload = function (event) {
                //     nuevoArchivo.ArchivoBin = event.target.result.split(',')[1]; // Obtiene solo la cadena base64
                //     // agregarArchivo(nuevoArchivo);
                // };
                // reader.readAsDataURL(file);

            } catch (error) {
                if (error.message) {
                    console.error('Error al guardar archivo:', error.message);
                }
            }
        }
        setActividadNombre2('')
        setFile(null)
    };
    
    const actualizarArchivoEnActividad = (idActividad, file) => {
        const reader = new FileReader();
        reader.onload = function (event) {
            const archivoBin = event.target.result.split(',')[1]; // Obtiene solo la cadena en base64
            // console.log(archivoBin)
            const updatedColumnsActividad = datosActividad.map(row => {
                if (row.IdActividad === idActividad && row.IdAcuerdo===acuerdoIdAct ) {  
                    return { ...row, File: archivoBin };  
                }
                return row;
            });
            setDatosActividad(updatedColumnsActividad);
            // console.log(datosActividad)
        };
        // Lee el archivo como DataURL
        reader.readAsDataURL(file);
    };
    
    const handleDownloadFile = (rowData, cellId) => {
        const archivo = datosActividad.find((archivo) => archivo.IdArchivo === rowData.original.IdArchivo && archivo.IdAcuerdo === acuerdoIdAct );
        setArchivoDownload(archivo)
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
        const binario = typeof archivoDownload.File === 'string'
            ? base64ToUint8Array(archivoDownload.File)
            : archivoDownload.File;
        // console.log(archivoDownload.File)
        const blob = new Blob([binario], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'Archivo Adjunto';//archivoDownload.Nombre;
        document.body.appendChild(link);
        link.click();
        URL.revokeObjectURL(url);
        document.body.removeChild(link);
        setArchivoDownload(null);
    }, [archivoDownload]);

}
