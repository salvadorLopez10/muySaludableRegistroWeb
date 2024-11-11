import { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { MuySaludableApi } from '../api/MuySaludableApi';
import LoadingIndicator from './LoadingIndicator';


const ModalSuccess = ({ 
    visible,
    disableButton,
    idUsuario
}) => {

    const [indicatorVisible, setIndicatorVisible] = useState(false);
    const [showPassword, setShowPassword] = useState(false);    
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");


    const handlePassword = (e) => setPassword(e.target.value);

    const handleConfirmPassword = (e) => setConfirmPassword(e.target.value);

    const navigate = useNavigate();

    if (!visible) return null;

    const closeIndicator = () => {
        setIndicatorVisible(false);
    };

    const showIndicator = () => {
        setIndicatorVisible(true);
    };

    const handleConfirmContinue = async () => {
        console.log("PASSWORD");
        console.log(password. confirmPassword, idUsuario);

        if( password.trim().length < 8 ){
            alert("La contraseña debe tener al menos 8 caracteres");
            return;
          }
      
        if (confirmPassword.trim().length == 0) {
        alert("Error", "Por favor confirma la contraseña");
        return;
        }
    
        if ( password.trim() !== confirmPassword.trim() ) {
        alert("Las contraseñas no coinciden, favor de verificar");
        return;
        }

        const bodyUpdatePass = {
            password: password
        };

        showIndicator();
        await MuySaludableApi.put(`/usuarios/${idUsuario}`, bodyUpdatePass)
        .then((responsePassword) => {
            console.log("SE GENERÓ LA SUSCRIPCIÓN DEL USUARIO");
            console.log(JSON.stringify(responsePassword,null,2));
            closeIndicator();
            //enableButton();
            //console.log("RESPUESTA PASSWORD CREADO");
            //console.log(JSON.stringify(responsePassword, null, 2));
            alert("La contraseña se estableció correctamente.\nPor favor guarda tu contraseña, la necesitarás para acceder a tu información." );
            console.log("dirigirnos a una nueva pantalla con QR de app y mostrar texto indicando que debemos descargar la app para contestar el cuestionario");
            navigate("/welcome");
            

            
        }).catch((errorSuscripcion) => {
            closeIndicator();
            //enableButton();
            console.log("Mensaje de error en suscripción: ",errorSuscripcion.response.data.message);

        });
        }


    return (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-80 z-50">
            <div className="bg-white rounded-lg p-8 w-full max-w-md mx-auto flex flex-col items-center">
                <div className="flex items-center justify-center bg-green-100 rounded-full w-16 h-16 mb-4">
                    <i className="text-green-600 text-2xl">✓</i>
                </div>
                <h2 className="text-center text-lg font-semibold mb-2 text-gray-700">Éxito</h2>
                <p className="text-center mb-4 text-gray-700">
                    Registro generado correctamente
                </p>
                <div className="mb-4">
                    <p className="text-center text-gray-600">Para continuar es necesario establecer una contraseña.</p>
                    <p className="text-center text-gray-600">Favor de ingresarla a continuación</p>
                    <p className="text-center text-gray-600">(Mínimo 8 caracteres)</p>
                </div>

                <div className="space-y-4">
                    {/* Input para ingresar la contraseña */}
                    <div className="relative flex items-center">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Ingresa contraseña"
                            value={password}
                            onChange={handlePassword}
                            className="w-full border border-gray-300 rounded-full px-4 py-2 text-center focus:outline-none focus:ring-2 focus:ring-green-600 text-gray-700"
                        />
                        <button 
                            onClick={() => setShowPassword(!showPassword)} 
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600"
                        >
                            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                        </button>
                    </div>

                    {/* Input para confirmar la contraseña */}
                    <div className="relative flex items-center">
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirma contraseña"
                            value={confirmPassword}
                            onChange={handleConfirmPassword}
                            className="w-full border border-gray-300 rounded-full px-4 py-2 text-center focus:outline-none focus:ring-2 focus:ring-green-600 text-gray-700"
                        />

                        <button 
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600"
                        >
                            <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
                        </button>
                    </div>
                </div>

                <button 
                    onClick={handleConfirmContinue} 
                    disabled={disableButton}
                    className={`w-full mt-6 text-white rounded-full py-2 font-bold ${disableButton ? "opacity-50 cursor-not-allowed" : ""}`}
                    style={{backgroundColor:"#326807"}}
                >
                    Confirmar
                </button>
                {/* {indicatorVisible && <div className="flex justify-center mt-4"><div className="loader"></div></div>} */}
                {indicatorVisible &&  <LoadingIndicator /> }
            </div>
        </div>
    );
};

// Validación de props usando PropTypes
ModalSuccess.propTypes = {
    visible: PropTypes.bool.isRequired,
    //password: PropTypes.string.isRequired,
    //confirmPassword: PropTypes.string.isRequired,
    //visibleIndicator: PropTypes.bool.isRequired,
    disableButton: PropTypes.bool.isRequired,
    idUsuario: PropTypes.number
    //handlePassword: PropTypes.func.isRequired,
    //handleConfirmPassword: PropTypes.func.isRequired,
    //onConfirmContinue: PropTypes.func.isRequired,
};

export default ModalSuccess;
