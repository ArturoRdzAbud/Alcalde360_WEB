import React, { createContext, useState } from 'react';

// Crear el contexto
export const PerfilContext = createContext();

// Proveedor del contexto
export const PerfilProvider = ({ children }) => {
  //const [perfil, setPerfil] = useState(1);//default es consulta
  const [perfil, setPerfil] = useState(4);//devteam temporalmente default seras admin
  const [esConLicencia, setEsConLicencia] = useState(0);
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [idAlcaldia, setIdAlcaldia] = useState(1);
  const [nomAlcaldia, setNomAlcaldia] = useState('');

  return (
    <PerfilContext.Provider value={{ 
             perfil, setPerfil
            ,esConLicencia, setEsConLicencia
            ,nombreUsuario,setNombreUsuario
            ,idAlcaldia,setIdAlcaldia
            ,nomAlcaldia,setNomAlcaldia
            }}>
      {children}
    </PerfilContext.Provider>
  );
};
