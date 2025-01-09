import React, { useEffect, useState, useRef  } from 'react';
import axios from 'axios';

import { SideBarHeader } from './SideBarHeader';
import config from '../config'; // archivo configs globales del proy

import * as powerbi from 'powerbi-client';

export const FrmDashboardAlcalde = () => {
  
  
  const reportContainer = useRef(null);
  useEffect(() => {

    console.log('entra a useeffect!!')

    //se modifica la url que se genera desde power bi servicies, al crear una nueva área de trabajo nos generó un idgroup valido
    const embedUrl = "https://app.powerbi.com/reportEmbed?reportId=ee118c4d-2ffd-4bbd-87e2-b959d6ed54d3&groupId=fad3d819-9f17-4777-a2ad-3cc65decf46b&w=2&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly9XQUJJLU1FWElDTy1DRU5UUkFMLUEtUFJJTUFSWS1yZWRpcmVjdC5hbmFseXNpcy53aW5kb3dzLm5ldCIsImVtYmVkRmVhdHVyZXMiOnsidXNhZ2VNZXRyaWNzVk5leHQiOnRydWV9fQ%3d%3d";

     
    // Cambia la URL a la de tu API
    const apiUrl = config.apiUrl + '/embed-token';
    //axios.get(apiUrl)
      
    axios.get(apiUrl)
      .then(response => {          
        console.log('obtiene response.data.token', response.data.token)
        const embedConfig = {
          type: 'report',
          tokenType: powerbi.models.TokenType.Embed, //se modifica el tipo de token de "embed" a "Aad"
          accessToken: response.data.token,
          embedUrl: embedUrl,
          id: 'ee118c4d-2ffd-4bbd-87e2-b959d6ed54d3',
          settings: {
            panes: {
              filters: {
                visible: false,
              },
              pageNavigation: {
                visible: true,
              },
            },
          },
        };
    
        try {
          const powerBiService = new powerbi.service.Service(powerbi.factories.hpmFactory, powerbi.factories.wpmpFactory, powerbi.factories.routerFactory);
          powerBiService.embed(reportContainer.current, embedConfig);
        } catch (error) {
          console.error("Error embedding the Power BI report:", error);
        }
      })
      .catch(error => console.error('Error al obtener datos:', error))
  
  }, []);

  return (
    <div>
      <SideBarHeader titulo={'Dashboard del Alcalde'}></SideBarHeader>
      <br /><br /><br /><br />
     
          <div
            ref={reportContainer}
            style={{
              width: '100%',
              height: '100vh',
              border: '1px solid #ddd',
            }}
          ></div>
    </div>
  );
}

export default FrmDashboardAlcalde;
