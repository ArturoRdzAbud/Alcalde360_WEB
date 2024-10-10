//componente para mostrar un campo
import { useState, useEffect } from "react";
export const ElementoCampo = ({
  type = 'text'
  , lblCampo = 'lblCampo'
  , claCampo = 'claCampo'
  , nomCampo = ''
  , onInputChange
  //, valCampo
  , options = []// Nuevo prop para las opciones del combo desplegable
  , editable = true //para indicar si el campo es editable
  , tamanioString = 255
  , width = '100%'
  , onInputChange2
  // , ref 
  // , setRef
  //,options = [{ value: '', label: 'Seleccionar' }, ...] // Agrega una opción por defecto al combo desplegable
}) => {

  // const [value, setValue] = useState(nomCampo || '')
  const [value, setValue] = useState(nomCampo)

  // const ref = useRef(null);
  // setRef(ref);
  // useEffect(() => {
  //   setRef(ref.current);
  // }, [setRef]);

  const handleInputChange = (event) => {
    let newValue;

    if (type == 'radio') {
      newValue = event.target.value
      // console.log(newValue)
      setValue(newValue);
    } else {
      newValue = type === 'checkbox' ? event.target.checked : event.target.value;
      setValue(newValue)
    }

    if (onInputChange) {//Asigna el valor en el padre recibe de parametro el evento SET
      onInputChange(newValue);
      // console.log(newValue)
    }
  }

  useEffect(() => {
    if (onInputChange2) {
      onInputChange2()
    }
  }, [value]);


  // Actualiza el valor cuando cambia `nomCampo` externamente
  useEffect(() => {
    setValue(nomCampo);
  }, [nomCampo]);

  return (
    <>
      {
        type === 'radio' ? (
          // Si el tipo es 'radio', mostrar botones de radio
          <div className="mb-3">
            <label>{lblCampo}</label>
            {options.map((option, index) => (
              <div key={index} className="form-check d-flex align-items-center">
                <input
                  className="form-check-input"
                  type="radio"
                  id={`${claCampo}_${index}`}  // Generar un id único para cada opción
                  name={claCampo}               // Nombre del grupo de radio
                  value={option.value}
                  checked={parseInt(value) === option.value}  // Comprobar si está seleccionado
                  onChange={handleInputChange}
                  // disabled={!editable}
                />
                <label className="form-check-label" htmlFor={`${claCampo}_${index}`}>
                  {option.label}
                </label>
              </div>
            ))}
          </div>

        ) : type == 'checkbox' ? (

          <div className="form-check form-switch">
            <input className="form-check-input"
              type={type} role="switch"
              id={claCampo}
              //checked={value=='on'?true:false} 
              checked={value}
              onChange={handleInputChange}
              disabled={!editable}

            // ref={referencia}
            />
            <label className="form-check-label" htmlFor={claCampo}>{lblCampo}</label>
          </div>

        ) : type == 'select' ? ( // Si el tipo es 'select', mostrar un combo desplegable

          <div className="form-floating mb-3">
            <select className="form-select"
              id={claCampo}
              value={value}
              onChange={handleInputChange}
              disabled={!editable}
              style={{ width: width }}            // ref={ref}
            >
              {[{ value: '-1', label: '' }, ...options].map((option, index) => (
                // {options.map((option, index) => (
                <option key={index} value={option.value}>{option.label}</option>
              ))}
            </select>
            <label htmlFor={claCampo}>{lblCampo}</label>
          </div>

        ) : type == "password" ? ( // Si es una conttraseña o password

          <div className="form-floating mb-3">
            <input className="form-control"
              type={type}    //{showPwd ? "text" : "password"}
              id={claCampo}
              placeholder={lblCampo}
              value={value}
              onChange={handleInputChange}
              disabled={!editable}
              maxLength={tamanioString}
              style={{ width: width }}            // ref={referencia}
            />
            <label htmlFor="floatingInput">{lblCampo}</label>
          </div>

          //PARTE ELSE DEL CONDICIONAL AQUI ENTRAN VARIOS TYPES COMUNES COMO TEXT,NUMBER,DATE,EMAIL, ETC VALIDAR SI FUNCIONA el de arriba "password"
        ) : (
          <div className="form-floating mb-3">
            <input className="form-control"
              type={type}
              id={claCampo}
              placeholder={lblCampo}
              value={value}
              onChange={handleInputChange}
              disabled={!editable}
              maxLength={tamanioString}
              style={{ width: width }}            // ref={referencia}
            />
            <label htmlFor="floatingInput">{lblCampo}</label>
          </div>
        )

      }








    </>
  )
}


