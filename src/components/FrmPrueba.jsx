import React from 'react'
import { Login } from './Login';
import { SideBarHeader } from './SideBarHeader';
import { useLocation, useNavigate } from "react-router-dom";

export const FrmPrueba = () => {
    //const { id1, id2 } = Route.params
    const location = useLocation();
    const navigate = useNavigate();
    const data = location.state;

    const regresar = () => {
        navigate(-1);

        ////////////////
        // Define las columnas
        const columns = React.useMemo(
            () => [
                {
                    accessorKey: 'id',
                    header: 'ID',
                },
                {
                    accessorKey: 'nombre',
                    header: 'Nombre',
                },
                {
                    accessorKey: 'color',
                    header: 'Color',
                    cell: ({ cell }) => {
                        const valorColor = cell.getValue();
                        // Y dentro de la columna personalizada:
                        return (
                            <div className={obtenerClaseColor(valorColor)}>
                                {valorColor}
                            </div>
                        );
                    },
                },
            ],
            []
        );


        ///////////////
    };

    return (
        <>
            <SideBarHeader titulo=''></SideBarHeader>
            <br /><br /><br /><br />

            <h1>Prueba !</h1>
            <br />
            <p>IdAlcaldia : {data.idAlcaldia}</p><br />
            {/*<p>IdIncicencia : {data.idIncidencia}</p>
            <p>Descripción : {data.descripcion}</p>*/}
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button type="button" title="Cancelar" className="btn btn-danger" onClick={regresar} >Cancelar </button>
                <button type="submit" title="Guardar" className="btn btn-primary" onClick={regresar} >Save </button>
            </div>


        </>
    )
}

export default FrmPrueba;