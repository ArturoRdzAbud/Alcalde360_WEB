// useMiLogica.js
import { useState, useEffect } from 'react';

export default function useFrmFichaTecnicaAcuerdoArchivo(datosActividad, acuerdoIdAct,actividadId2,setDatosActividad,setActividadNombre2,setAlertaMensaje) {
    const [archivoNombre, setArchivoNombre] = useState('');
    const [archivo, setArchivo] = useState(null);
    const [file, setFile] = useState(null);
    const [archivoDownload, setArchivoDownload] = useState(null);

    const selectedFileHandler = e => {
        console.log('ARCHIVO SELECCIONADO:');
        setFile(e.target.files[0]);
    };

    const guardarFile = async () => {
        if (!file) {
            alert('Favor de seleccionar un Archivo');
            return;
        }
        if (file.size > 1000000) {
            alert('El límite máximo del archivo es 1 MB. Favor de validar');
            return;
        }
        
        try {
            setArchivo(file);
            actualizarArchivoEnActividad(actividadId2, file);
        } catch (error) {
            console.error('Error al guardar archivo:', error.message);
        }

        setArchivoNombre('');
        setFile(null);
    };

    const actualizarArchivoEnActividad = (idActividad, file) => {
        const reader = new FileReader();
        reader.onload = function (event) {
            const archivoBin = event.target.result.split(',')[1]; // Obtiene solo la cadena en base64
            const updatedColumnsActividad = datosActividad.map(row => {
                if (row.IdActividad === idActividad && row.IdAcuerdo === acuerdoIdAct) {
                    return { ...row, File: archivoBin };
                }
                return row;
            });
            // Asumiendo que tienes un setter para datosActividad, deberías usarlo aquí
            setDatosActividad(updatedColumnsActividad);
            setActividadNombre2('')
        };
        reader.readAsDataURL(file);
    };

    const handleDownloadFile = (rowData) => {
        const archivo = datosActividad.find(
            (archivo) => archivo.IdArchivo === rowData.original.IdArchivo && archivo.IdAcuerdo === acuerdoIdAct
        );
        setArchivoDownload(archivo);
    };

    const base64ToUint8Array = (base64) => {
        const binaryString = window.atob(base64);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes;
    };

    useEffect(() => {
        if (!archivoDownload || !archivoDownload.File) {
            // setAlertaMensaje('Sin Archivo Adjunto')
            return
        }

        const binario = typeof archivoDownload.File === 'string'
            ? base64ToUint8Array(archivoDownload.File)
            : archivoDownload.File;

        const blob = new Blob([binario], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'Archivo Adjunto'; // Puedes usar archivoDownload.Nombre si lo tienes disponible
        document.body.appendChild(link);
        link.click();
        URL.revokeObjectURL(url);
        document.body.removeChild(link);
        setArchivoDownload(null);
    }, [archivoDownload]);

    return {
        archivoNombre,
        setArchivoNombre,
        archivo,
        setArchivo,
        file,
        setFile,
        selectedFileHandler,
        guardarFile,
        handleDownloadFile,
    };
}
