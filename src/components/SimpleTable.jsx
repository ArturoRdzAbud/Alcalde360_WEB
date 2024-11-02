import {
    useReactTable, getCoreRowModel, flexRender, getPaginationRowModel
    , getSortedRowModel, getFilteredRowModel
} from "@tanstack/react-table";
import React, { useState } from 'react';
// import dayjs from "dayjs";
import { ElementoCampo } from './ElementoCampo';
import { useEffect } from "react";

import Pagefirst from '../svg/page-first.svg?react'
import Pageprev from '../svg/page-prev.svg?react'
import Pagenext from '../svg/page-next.svg?react'
import Pagelast from '../svg/page-last.svg?react'
import Pagenew from '../svg/page-new.svg?react'
import Pagetop from '../svg/page-top.svg?react'
import Delete from '../svg/icon-trash-red.svg?react'
// import Det from '../svg/icon-config.svg?react'

function SimpleTable({ data
    , columns
    , handleEdit //para columna tipo link
    , esOcultaBotonNuevo = false
    , esOcultaBotonArriba = false
    , esOcultaFooter = false
    , esOcultaFiltro = false
    // , esOcultaLinkNombre = false
    , handleNuevo//Evento al dar clic en nuevo
    , buttonRefNuevo
    , setData
    , pageSize = 20
    , handleDelete
    , handleDet
    , handleDownload
    // , esConLink = true
}) {

    useEffect(() => {
        table.setPageSize(pageSize);
    }, [])
    useEffect(() => {//asigna la pagina actual
        const timeoutId = setTimeout(() => {
            table.setPageIndex(numeroPag);
        }, 0.0001);
        return () => clearTimeout(timeoutId);
    }, [data])



    const [sorting, setSorting] = useState([])
    const [filtering, setFiltering] = useState("")
    const [numeroPag, setNumeroPag] = useState(0)



    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        state: { sorting, globalFilter: filtering },
        onSortingChange: setSorting,
        onGlobalFilterChange: setFiltering,
    })



    const handleCheckboxChange = (row, isChecked, idColumna) => {
        setNumeroPag(table.getState().pagination.pageIndex)
        // row.isActive = isChecked;

        const newData = data.map((item, index) => {
            if (index === row.index) {
                // Actualiza el campo ActivoChk
                return {
                    ...item,
                    [idColumna]: isChecked
                    // Nombr3: isChecked
                };
            }
            return item;
        });
        setData(newData);

    };

    const handleTextboxChange = (row, value, idColumna) => {
        setNumeroPag(table.getState().pagination.pageIndex)
        const newData = data.map((item, index) => {
            if (index === row.index) {
                return {
                    ...item,
                    [idColumna]: value
                };
            }
            return item;
        });
        setData(newData);
    };




    const vuelveArriba = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };
    const nextPage = () => {
        if (table.getCanNextPage()) {
            table.nextPage()
        }

        // console.log(table.getPageCount())
        //https://tanstack.com/table/v8/docs/api/features/pagination#setpagesize
    }


    return (
        <>
            <div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    {!esOcultaFiltro &&
                        <span style={{ flexGrow: 1 }}>
                            <ElementoCampo type='text' lblCampo="Filtro :" claCampo="filtro" valCampo={filtering} onInputChange={setFiltering} />
                        </span>
                    }
                    {table.getPageCount() > 1 &&
                        <span >
                            <button type="button" className="btn btn-secondary" onClick={() => table.setPageIndex(0)}><Pagefirst /></button>
                            <button type="button" className="btn btn-primary" onClick={() => (table.previousPage())}><Pageprev /></button>
                            <button type="button" className="btn btn-primary" onClick={nextPage}><Pagenext /></button>
                            <button type="button" className="btn btn-secondary" onClick={() => table.setPageIndex(table.getPageCount() - 1)}><Pagelast /></button>
                        </span>
                    }

                    <span>
                        <button type="button" ref={buttonRefNuevo} className="btn btn-primary" onClick={handleNuevo} hidden={esOcultaBotonNuevo}><Pagenew /></button>
                    </span>
                </div>

                <table border="1">

                    <thead>
                        {table.getHeaderGroups().map(headerGroup => (
                            <tr key={headerGroup.id}>
                                {
                                    headerGroup.headers.map(header => (
                                        header.column.columnDef.visible && (//VALIDA SI ES VISIBLE
                                            <th key={header.id}
                                                onClick={header.column.getToggleSortingHandler()}>
                                                {flexRender(header.column.columnDef.header, header.getContext())}
                                                {{ asc: "⬆️", desc: "⬇️" }[header.column.getIsSorted() ?? null]}
                                            </th>
                                        )
                                    ))
                                }
                            </tr>
                        ))
                        }
                    </thead>
                    <tbody>
                        {table.getRowModel().rows.map((row) => (
                            <tr key={row.id}>
                                {row.getVisibleCells().map((cell) => (
                                    cell.column.columnDef.visible && (  //VALIDA SI ES VISIBLE

                                        <td key={cell.id}
                                            style={cell.column.id === "handleDelete" || cell.column.id === "handleDet" || cell.column.id === "handleDet2" ? { width: '50px', textAlign: 'center' } : {}}
                                        >
                                            {
                                                // let hasMeta = flexRender(cell.column.columnDef.cell, cell.getContext())
                                                ((cell.column.id == "Nombre" || cell.column.id == "Descripcion" || cell.column.id == "Link")) ?    //VALIDA SI ES COLUMNA TIPO LINK
                                                    <a href="#" onClick={(e) => { e.preventDefault(); handleEdit(row, cell.column.id) }}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</a>
                                                    // : (cell.column.id == "Activo") ?
                                                    : (cell.column.id == "handleDelete") ?
                                                        <a href="#" onClick={(e) => { e.preventDefault(); handleDelete(row, cell.column.id) }}><Delete /></a>
                                                        : (cell.column.id == "handleDet") ?
                                                            <i className="bi bi-pencil-square" onClick={() => handleDet(row, cell.column.id)}></i>
                                                            : (cell.column.id == "handleDownload") ?
                                                                <i className="bi bi-download" onClick={() => handleDownload(row, cell.column.id)}></i>
                                                                : (cell.column.id.endsWith("Chk")) ?

                                                                    <input
                                                                        type="checkbox"
                                                                        checked={cell.renderValue().toString() == 'true' || cell.renderValue().toString() == '1'}
                                                                        onChange={(e) => {
                                                                            handleCheckboxChange(row, e.target.checked, cell.column.id);
                                                                        }}
                                                                        disabled={!cell.column.id.endsWith("EditChk")}

                                                                    />
                                                                    : (cell.column.id == "btnAdd") ?
                                                                        <button type="button" className="btn btn-secondary" onClick={vuelveArriba}><Pagetop /></button>
                                                                        : (cell.column.id.endsWith("EditTxt")) ?
                                                                            <input
                                                                                style={{ width: 50 }}//ancho de col
                                                                                min="0"//Solo Positivos
                                                                                type="number"//solo nums
                                                                                value={cell.renderValue().toString()}//trae el valor de BD
                                                                                onChange={(e) => {//asigna valor
                                                                                    handleTextboxChange(row, e.target.value, cell.column.id);
                                                                                }}
                                                                            /> :
                                                                            flexRender(cell.column.columnDef.cell, cell.getContext())

                                            }
                                        </td>
                                    )

                                ))}
                            </tr>
                        ))}
                    </tbody>
                    {!esOcultaFooter &&
                        <tfoot>
                            {table.getFooterGroups().map(footerGroup => (
                                <tr key={footerGroup.id}>
                                    {
                                        footerGroup.headers.map(footer => (
                                            footer.column.columnDef.visible && (//VALIDA SI ES VISIBLE
                                                <th key={footer.id}>
                                                    {flexRender(footer.column.columnDef.footer, footer.getContext())}
                                                </th>
                                            )
                                        ))
                                    }
                                </tr>
                            ))
                            }
                        </tfoot>
                    }

                </table>



                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ flexGrow: 1 }}>
                        {/* <button type="button" className="btn btn-secondary" onClick={() => table.setPageIndex(0)}><Pagefirst /></button>
                    <button type="button" className="btn btn-primary" onClick={() => (table.previousPage())}><Pageprev /></button>
                    <button type="button" className="btn btn-primary" onClick={nextPage}><Pagenext /></button>
                    <button type="button" className="btn btn-secondary" onClick={() => table.setPageIndex(table.getPageCount() - 1)}><Pagelast /></button> */}
                    </span>
                    <span>
                        {!esOcultaBotonArriba &&
                            <button type="button" className="btn btn-secondary" onClick={vuelveArriba}><Pagetop /></button>
                        }
                    </span>
                </div>


            </div >
        </>
    );

}

export default SimpleTable