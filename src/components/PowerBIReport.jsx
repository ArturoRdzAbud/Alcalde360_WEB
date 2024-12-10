import React, { useEffect, useRef } from 'react';
import { PowerBIEmbed } from 'powerbi-client-react'; // Si usas el paquete React wrapper
import { models, service } from 'powerbi-client';

const PowerBIReport = ({ embedUrl, accessToken, reportId }) => {
    //const reportContainer = useRef(null);
    //console.log({ embedUrl, accessToken });
    /*
        useEffect(() => {
            if (!embedUrl || !accessToken) {
                console.error('Faltan configuraciones necesarias para embeber el reporte.');
                return;
            }*/

    //if (reportContainer.current) {
    const reportConfig = {
        type: "report",
        tokenType: models.TokenType.Embed, // Use models.TokenType.Aad for SaaS embed
        accessToken: accessToken,
        embedUrl: embedUrl,
        id: reportId, // Opcional si está en la URL
        settings: {
            panes: {
                filters: {
                    visible: false,
                },
                pageNavigation: {
                    visible: true,
                },
            },
            background: models.BackgroundType.Transparent,
        },
    };
    /*
    // Crear instancia del servicio de Power BI
    const powerbi = new service.PowerBIService();
    powerbi.embed(reportContainer.current, config);

    return () => {
        powerbi.reset(reportContainer.current); // Limpia el contenedor al desmontar
    };*/
    //}
    //}, [embedUrl, accessToken]);

    //return <div ref={reportContainer} style={{ height: "500px", width: "100%" }} />;
    return (<>
        <div>
            <PowerBIEmbed
                embedConfig={reportConfig}
                cssClassName='power-bi-report-class'
            />
        </div>
    </>)
};

export default PowerBIReport;
