import '../css/Marco.css'; // Importa tu archivo de estilos

const Frame = ({ title, children }) => {
  return (
    <>
      {/* <span style={{ flexBasis: '49%', flexGrow: 0 }}> */}
        <div className="mi-frame">
          <div className="frame-title">{title}</div>
          {children}
        </div>
      {/* </span > */}
    </>
  );
};
export default Frame;