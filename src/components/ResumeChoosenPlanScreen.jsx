import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from "react-router-dom";
import { MuySaludableApi } from '../api/MuySaludableApi';
import LoadingIndicator from './LoadingIndicator';


function ResumeChoosenPlanScreen() {

  const location = useLocation();
  const { selectedView } = location.state;
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const [validity, setValidity] = useState("");

  const handleEmailChange = (e) => setEmail(e.target.value);

  const navigate = useNavigate();

  useEffect(() => {
    
    const vigencia = setValidityDate(selectedView);
    setValidity(vigencia[0]);
    //console.log(JSON.stringify(vigencia,null,2));

  }, [selectedView]);

  const setValidityDate = (selectedPlan) => {
    const currentDate = new Date();
    const sumaMeses = parseInt(selectedPlan.duracion_meses);

    const validityDate = new Date();
    validityDate.setMonth(currentDate.getMonth() + sumaMeses);
    //console.log(validityDate)

    //Se establece formato de fecha en un string como: 12 de mayo de 2024
    const formatDate  = { year: 'numeric', month: 'long', day: 'numeric' };

    //Se establece fecha con el siguiente formato:  2024-05-12 23:55:00
    const formattedDate = formatExpirationDate(validityDate);

    return [`${validityDate.toLocaleDateString(undefined, formatDate)}`, formattedDate];
  }

  const formatExpirationDate = ( validityDate ) => {
    
    const year = validityDate.getFullYear().toString();
    let month = (validityDate.getMonth() + 1).toString().padStart(2, '0');
    let day = validityDate.getDate().toString().padStart(2, '0');
    let hours = '23';
    let minutes = '59';
    let seconds = '00';

    // Formatear la fecha
    const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

    return formattedDate;
  }

  const handleConfirmEmail = async() => {
    if( email.trim() == "" ){
      alert("Favor de ingresar el email");
    }else {
      const validRegex =
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
      if (!email.match(validRegex)) {
        alert("Favor de ingresar un correo electrónico válido");
        return;
      } 
    }

    const requestEmail = {
      "email": email
    }

    setLoading(true);
    await MuySaludableApi.post(
      "/usuarios/checkEmail",
      requestEmail
    ).then((response) => {

      setLoading(false);
     //console.log(JSON.stringify(response,null,2));
     if (response.data.status == "Duplicate") {

       alert("El email que ingresaste ya existe, favor de intentar con uno diferente");
       return;
     }

     navigate("/payment", { state: { email } });


    }).catch((error) => {
       // console.log("Error al verificar el email");
       // console.log(JSON.stringify(error, null, 2));
       setLoading(false);
       alert("No se ha podido verificar el email, favor de intentar nuevamente");
       if (error.response && error.response.data) {
         if (!error.response.data.success) {
           
           console.log("Mensaje de error: ", error.response.data.message);
         }
       } else {
         console.log("Error en la transacción SIN DATA:", error.message);
       }
   });



  }


  return (
    <div className="bg-gray-200 min-h-screen flex justify-center items-center">
        <div className="bg-white w-full max-w-2xl mx-auto p-5 shadow-lg rounded-lg text-center">
        <div className="flex flex-col items-center bg-white relative min-h-screen">
          <h1 className="text-2xl font-extrabold text-green-800 mb-6">RESUMEN DEL PLAN ELEGIDO</h1>

          {/* Características */}
          <div className="bg-yellow-100 border border-lime-700 rounded-lg p-3 max-w-full mb-6">
            <h2 className="text-xl font-extrabold text-lime-700 text-center">{selectedView.nombre}</h2>
              <div className="bg-lime-700 md:bg-opacity-70 text-xl text-white font-extrabold p-2 rounded-lg text-center my-4">
              ${selectedView.precio}
              </div>
              <div>
                {selectedView.descripcion_detallada?.split("\n").map((linea, index) => (
                  <div key={index} className="flex items-start space-x-2 m-4">
                    <span className="text-lime-700">•</span>
                    <p className="text-lime-700 text-left">{linea}</p>
                  </div>
                ))}
              </div>
          </div>

          {/* Vigencia */}
          <div className="text-center mb-4">
            <p className="text-lg font-extrabold text-lime-700">VIGENCIA DEL PLAN</p>
            <p className="text-lg font-extrabold text-lime-700">{validity}</p>
          </div>

          {/* Email */}
          {/* Campo de correo electrónico */}
          <div className="bg-lime-700 border md:bg-opacity-70 border-lime-700 rounded-lg p-4 w-11/12 mb-4">
            <label className="block text-white font-bold mb-2" htmlFor="email">
              Ingresa tu correo electrónico
            </label>
            <input
              id="email"
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={handleEmailChange}
              className="border border-lime-700 md:bg-opacity-70 rounded-lg w-full p-2 text-center text-lime-700"
            />
          </div>

          {/* Botón Confirmación */}
          <button className="bg-orange-400 text-white rounded-lg p-2 w-11/12 mt-4" onClick={handleConfirmEmail}>
            Confirmar y proceder al pago
          </button>

          { loading && <LoadingIndicator /> }

        </div>
      </div>
    </div>
  );
}

export default ResumeChoosenPlanScreen;
