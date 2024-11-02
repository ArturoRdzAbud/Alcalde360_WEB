// useColumnsActividad.js
import { useMemo } from "react";

export default function useColumnsActividad() {
  const columnsActividad = useMemo(
    () => [
      {
        header: "IdAcuerdo",
        accessorKey: "IdAcuerdo",
        visible: false,
      },
      {
        header: "IdActividad",
        accessorKey: "IdActividad",
        visible: false,
      },
      {
        header: "Descripción",
        accessorKey: "Descripcion",
        visible: true,
      },
      {
        header: "Responsable",
        accessorKey: "Responsable",
        visible: true,
      },
      {
        header: "responsableIdCombo",
        accessorKey: "responsableIdCombo",
        visible: false,
      },
      {
        header: "Inicio",
        accessorKey: "FechaIni",
        visible: true,
      },
      {
        header: "Fin",
        accessorKey: "FechaFin",
        visible: true,
      },
      {
        header: "Estatus",
        accessorKey: "Estatus",
        visible: false,
      },
      {
        header: "Estatus",
        accessorKey: "NomEstatus",
        visible: false,
      },
      // {
      //     header: 'Estatus',
      //     accessorKey: 'EstatusColor2',
      //     visible: true,
      // },
      {
        header: "Estatus",
        accessorKey: "EstatusColor",
        visible: true,
        cell: ({ getValue }) => {
          const value=getValue();
          // console.log('value es:'+value)
          const getColor = (status) => {
            if (status === 1) return "orange";
            if (status === 2) return "red";
            return "green";
          };

          return (
            <div
              style={{
                backgroundColor: getColor(value),
                color: "white",
                padding: "5px",
                borderRadius: "5px",
                textAlign: "center",
              }}
            >
              {value === 1 ? "Pendiente" : value === 2 ? "Vencida" : "Completada"}
              {/* {'2'} */}
            </div>
          );
        },
      },
      {
        header: "Listo",
        accessorKey: "ListoEditChk",
        visible: true,
      },
      {
        header: "Días",
        accessorKey: "Dias",
        visible: true,
      },
      {
        header: "File",
        accessorKey: "File",
        visible: false,
      },
      {
        header: "Adjuntar",
        accessorKey: "handleDet",
        visible: true,
      },
      {
        header: "",
        accessorKey: "handleDownload",
        visible: true,
      },
      {
        header: "",
        accessorKey: "handleDelete",
        visible: true,
      },
    ],
    []
  );

  return columnsActividad;
}
