
function Header()  {
  return (
    <div
    className="w-full flex items-center px-4 py-2 bg-white shadow-md"
    style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 10,
      boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)', // sombra gris
    }}
  >
    <a href="/" rel="noopener noreferrer">
        <img
        src="/src/img/logoMuySaludableMR.png"
        alt="Logo Muy Saludable"
        className="h-10 w-10"
        />
          
    </a>
    <h1 className="ml-4 text-base font-bold" style={{color:"#326807"}} >Muy Saludable</h1>
  </div>
  )
}

export default Header;


