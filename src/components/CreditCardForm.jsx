import PropTypes from 'prop-types';
import Header from './Header';
import { useEffect, useState } from 'react';
import LoadingIndicator from './LoadingIndicator';
import { MuySaludableApi } from '../api/MuySaludableApi';
import ModalSuccess from './ModalSuccess';

const formatCurrency = (amount) => {
    if (typeof amount === "string") {
      amount = parseFloat(amount);
    }
    return amount.toLocaleString("es-MX", {
      style: "currency",
      currency: "MXN",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

const CreditCardForm = ({ userEmail, planCost, selectedPlan, expirationDate }) => {
    const [loading, setLoading] = useState(false);
    const [visibleErrorAlert, setVisibleErrorAlert] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [valStripe, setValStripe] = useState("");
    //const [currentPrice, setCurrentPrice] = useState(planCost);
    const [discountCode, setDiscountCode] = useState("");
    const [showDiscountCode, setShowDiscountCode] = useState(false);

    const [textButtonDiscount, setTextButtonDiscount] = useState("Validar");

    const [cardHolder, setCardHolder] = useState("");
    const [errorHolder, setErrorCardHolder] = useState(false);
    
    const [cardNumber, setCardNumber] = useState("");
    const [errorCard, setErrorCard] = useState(false);
    
    const [expiration, setExpiration] = useState("");
    const [errorExpiration, setErrorExpiration] = useState(false);
    
    const [cvv, setCVV] = useState("");
    const [errorCVV, setErrorCVV] = useState(false);
    
    const [inputDisabled, setInputDisabled] = useState(false);

    const [discountAmount, setDiscountAmount] = useState(formatCurrency(""));
    const [finalPrice, setFinalPrice] = useState(formatCurrency(planCost));
    
    const [modalSuccessVisible, setModalSuccessVisible] = useState(false);
    //const [indicatorVisible, setIndicatorVisible] = useState(false);
    const [disableButton, setDisableButton] = useState(false);

    const [idUsuario, setIdUsuario] = useState(null);

    useEffect(() => {
        // console.log("EFFECT VALUES CREDITCARDFORM");
        // console.log("VALUES: " + JSON.stringify(values, null, 3));
        getValStripe();
      }, []);

    useEffect(() => {
        if (idUsuario) {
            showSuccessModal();
        }
    }, [idUsuario]);
    
    const getValStripe = async() =>{
        console.log("ENTRA PARA OBTENER KEY DE STRIPE");
        await MuySaludableApi.get("/config/stripe_client").then((response) => {
          console.log("STRIPE DATA");
          console.log(JSON.stringify(response.data.data,null,2));
          setValStripe(response.data.data);
    
        }).catch(() =>{
          console.log("Error al obtener key de stripe client");
          console.log(error);
        });
      }

    async function handleValidateDiscount () {
        
        if( discountCode.trim().length == 0 ){
            alert("Ingresa un código de descuento");
            return;
        }

        if( textButtonDiscount == "Remover" ){
            setTextButtonDiscount("Validar");
            //setCurrentPrice(planCost);
            setDiscountCode("");
            setDiscountAmount("");
            setShowDiscountCode(false);
            setFinalPrice(formatCurrency( planCost ));
            setInputDisabled(false);
        }else{

            setLoading(true);
            
            await MuySaludableApi.get(
                `/codigosDescuento/getCodigoName/${discountCode}`
            ).then((response) =>{
                setLoading(false);
                setDiscountCode( response.data.data.nombre );
                alert("El código de descuento se ha aplicado correctamente");
    
                //Se calcula el porcentaje de descuento del cupón
                const percent = response.data.data.valor / 100;
                const discount = 1.0 - percent;
                
                const montoDescontado = (Number( planCost ) * percent).toFixed(2);
    
                const finalPrice = (Number(planCost) * discount).toFixed(2);
    
                setShowDiscountCode(true);
                //setCurrentPrice(finalPrice.toString());
                setDiscountAmount( formatCurrency(montoDescontado) );
                setFinalPrice( formatCurrency(finalPrice));
    
                setTextButtonDiscount("Remover");
    
                setCamposEditables(finalPrice);
                
            }).catch((errorAPIdiscount) => {
                setLoading(false);
                console.log(JSON.stringify(errorAPIdiscount))
                if( errorAPIdiscount.response.data ){
                    //Mensaje de respuesta de endpoint
                    if( errorAPIdiscount.response.status == 404 ){
          
                      alert(errorAPIdiscount.response.data.msg);
                    }
                  }
    
            });
        }



    }

    const setCamposEditables = (value) => {
        //En caso de que el precio final con descuento sea = 0, se deshabilitan campos para ingresar datos de tarjeta
        if( Number(value) == 0 ){
          setInputDisabled(true);
        }else{
            setInputDisabled(false);
        }
    }

    const handleCardHolderChange = (e) => {
        let text = e.target.value;
        setCardHolder(text);
    }
    
    const handleCardNumberChange = (e) => {
        let text = e.target.value;
        // Eliminar cualquier caracter no numérico
        let formattedText = text.replace(/\D/g, "");
    
        // Agregar un espacio cada 4 dígitos
        if (formattedText.length > 0) {
          formattedText = formattedText.match(new RegExp(".{1,4}", "g")).join(" ");
        }
    
        // Limitar la longitud a 19 caracteres (16 dígitos + 3 espacios)
        if (formattedText.length <= 19) {
          //setCardNumber(formattedText);
          setCardNumber(formattedText);
        }
    };

    const handleExpirationChange = (e) => {
        let text = e.target.value;
        let formattedText = text.replace(/\D/g, "");

        // Limitar a los primeros 4 dígitos
        if (formattedText.length > 4) {
          formattedText = formattedText.slice(0, 4);
        }
    
        // Agregar una barra después de los primeros 2 dígitos
        if (formattedText.length > 2) {
          formattedText = formattedText.slice(0, 2) + "/" + formattedText.slice(2);
        }
        setExpiration(formattedText);
    }

    const handleCVVChange = (e) => {
        let text = e.target.value;
        let formattedCVV = text.replace(/\D/g, "");
        setCVV(formattedCVV);
    }

    function onSubmitPayment() {
        //Si el precio se establece como 0 pesos, no es necesario agregar datos de tarjeta
        if ( inputDisabled ) {
          console.log("PROCEDEMOS A CREAR AL USUARIO Y LA SUSCRIPCIÓN")
          //En caso de que el descuento sea de 100% se procede directamente a crear el usuario y la suscripcion sin necesidad de crear el pago
          createUserSuscription();
    
        } else {
          // Validar cardHolder
          let stringError = "";
          if (cardHolder.trim().length === 0) {
            stringError += "Introduce valor en Nombre del Titular"; 
            setErrorCardHolder(true);
          }else{
            setErrorCardHolder(false);
          }
      
          // Validar cardNumber
          if (cardNumber.trim().length === 0) {
            stringError += "<br />Introduce el Número de Tarjeta"; 
            setErrorCard(true);
            
          } else if (
            cardNumber.replace(/\D/g, "").length !== 16 &&
            cardNumber.replace(/\D/g, "").length !== 15
          ) {

            stringError += "<br />Favor de establecer al menos 15 dígitos";
            setErrorCard(true);
            
          }else{
            setErrorCard(false);
          }
      
          if (expiration.trim().length === 0) {
            stringError += "<br />Introduce la expiración de tu tarjeta"; 
            setErrorExpiration(true);

          } else {
            const formattedExpiryDate = expiration.replace(/\s/g, ""); // Eliminar espacios en blanco
            const regex = /^(0[1-9]|1[0-2])\/?([0-9]{2})$/;
      
            if (!regex.test(formattedExpiryDate)) {

                stringError += "<br />El formato de la fecha de vencimiento debe ser MM/YY";
                setErrorExpiration(true);

            } else {
              const [month, year] = formattedExpiryDate.split("/").map(Number);
              const currentYear = new Date().getFullYear() % 100; // Últimos 2 dígitos del año actual
              const currentMonth = new Date().getMonth() + 1; // Mes actual (de 1 a 12)
    
              if (month < 1 || month > 12) {
                stringError += "<br />El mes introducido no es válido"; 
                setErrorExpiration(true);
              }else{
                setErrorExpiration(false);
              }
      
              if ( year < currentYear || (year === currentYear && month < currentMonth) ) {
                stringError += "<br />La tarjeta está vencida"; 
                setErrorExpiration(true);

              }else{
                setErrorExpiration(false);
              }
            }
          }
      
          if (cvv.trim().length === 0) {
            //setErrorCvv("Este campo es requerido");
            stringError += "<br />Introduce valor en CVV"; 
            setErrorCVV(true);

          } else if (cvv.trim().length < 3 && cvv.trim().length > 4) {
            
            stringError += "<br />El CVV introducido no es válido";
            setErrorCVV(true);
          } else{
            setErrorCVV(false);
          }
      
          console.log("PROCEDEMOS A GENERAR EL PAGO");
          
          if ( stringError == "" ) {
            setVisibleErrorAlert(false);
            setErrorMessage("");
            //createTokenPayment();
            console.log("LLAMAMOS CREATETOKENPAYMENT");
          } else {
            
            setVisibleErrorAlert(true);
            setErrorMessage(stringError);
          }
        }
    }

    /*
    const createTokenPayment = async () => {
        setLoading(true);
        const response = await stripeClient.createToken({
          card: {
            number: values.cardNumber.replace(/\s/g, ""),
            exp_month: parseInt(values.expiration.split("/")[0]),
            exp_year: parseInt("20" + values.expiration.split("/")[1]),
            cvc: values.cvv,
          },
        });
    
        console.log("RESPONSE STRIPE: " + JSON.stringify(response, null, 3));
    
        if (response.id !== undefined && response.id !== null) {
          //Mandar a llamar el post del endpoint de stripe para generar el pago
          //el endpoint espera: amount, id (token de stripe), description (para identificar el plan contratado)
          console.log(
            "SE MANDA EL PAGO STRIPE CON EL TOKEN OBTENIDO : " + response.id
          );
    
          //El precio final se obtiene y se convierte a número
          const total = parseFloat( finalPrice.replace(/[^0-9.-]+/g, ""));
    
          const body = {
            id: response.id,
            //amount: parseInt(values.precio) * 100, //Se multiplica * 100 ya que el monto se envía en centavos
            amount: total * 100,
            plan: values.plan
          };
    
          const responsePayment = await MuySaludableApi.post(
            "/stripe/create",
            body
          ).then((respuesta:any) => {
              
              console.log("RESPUESTA PAGO");
              console.log(JSON.stringify(respuesta, null, 2));
    
              //Se obtiene ID de pago
              setIdPago(respuesta.data.data.id);
    
              //En caso de tener información del usuario en el AuthStore, quiere decir  que es una renovación, por lo tanto, la info del usuario se actualiza
              //Actualiza suscripción, inhabilitando la suscripción actual
              if (userInfo !== undefined) {
                const bodyInactiveSuscripcion = {
                  estado: "Vencido",
                };
    
                const actualizaSuscripcion = MuySaludableApi.put(
                  `/suscripciones/${userInfo?.id_suscripcion}`,
                  bodyInactiveSuscripcion
                )
                  .then((responseSuscripcion:any) => {
                    //console.log(JSON.stringify(responseSuscripcion, null, 2));
                    const bodySuscripcion = {
                      id_usuario: userInfo?.id,
                      id_plan_alimenticio: values.idPlan,
                      id_pago:
                        values.discountCode != ""
                          ? respuesta.data.data.id +
                            "-DISCOUNT-CODE-" +
                            values.discountCode
                          : respuesta.data.data.id,
                      fecha_expiracion: values.fechaExpiracion,
                      estado: "Activo",
                    };
    
                    const suscripción = MuySaludableApi.post(
                      "/suscripciones",
                      bodySuscripcion
                    )
                      .then((responseSuscripcion:any) => {
                        console.log("RESPUESTA SUSCRIPCIÓN");
                        console.log(JSON.stringify(responseSuscripcion, null, 2));
    
                        setLoading(false);
    
                        //Se muestra directamente el quiz resumido
                        Alert.alert(
                          "Éxito",
                          "¡Tu nueva suscripción se ha generado correctamente!.\nPara continuar es necesario contestar el siguiente cuestionario y de esta manera mantener actualizada tu información",
                          [
                            {
                              text: "Continuar",
                              onPress: () =>
                                navigation.dispatch(
                                  CommonActions.reset({
                                    index: 0,
                                    routes: [
                                      {
                                        name: "QuizSummaryScreen",
                                        params: { userInfo },
                                      },
                                    ],
                                  })
                                ),
                            },
                          ],
                          { cancelable: false }
                        );
                      })
                      .catch((errorSuscripcion:any) => {
                        setLoading(false);
                        console.log(
                          "Mensaje de error en suscripción: ",
                          errorSuscripcion.response.data.message
                        );
                      });
                  })
                  .catch((errorDeleteAccount:any) => {
                    setLoading(false);
    
                    console.log(
                      "Mensaje de error al INACTIVAR suscripción: ",
                      errorDeleteAccount.response.data.message
                    );
                  });
              } else {
                //Inserta usuario con su suscripción
                const bodyUser = {
                  email: values.email,
                };
                console.log("BODY USER");
                console.log(JSON.stringify(bodyUser, null, 2));
    
                const usuario = MuySaludableApi.post("/usuarios", bodyUser)
                  .then((responseUsuario:any) => {
                    console.log("RESPUESTA CREACIÓN DE USUARIO");
                    console.log(JSON.stringify(responseUsuario, null, 2));
                    //Una vez creado el usuario, se procede a generar el registro de suscripción
                    const bodySuscripcion = {
                      id_usuario: responseUsuario.data.data.id,
                      id_plan_alimenticio: values.idPlan,
                      id_pago:
                        values.discountCode != ""
                          ? respuesta.data.data.id +
                            "-DISCOUNT-CODE-" +
                            values.discountCode
                          : respuesta.data.data.id,
                      fecha_expiracion: values.fechaExpiracion,
                      estado: "Activo",
                    };
    
                    //Establece idUsuario en el state
                    setIdUsuario(responseUsuario.data.data.id);
                    //console.log(JSON.stringify(bodySuscripcion, null, 2));
                    //Una vez creado el usuario, se procede a generar el registro de suscripción
                    const suscripción = MuySaludableApi.post(
                      "/suscripciones",
                      bodySuscripcion
                    )
                      .then((responseSuscripcion:any) => {
                        console.log("RESPUESTA SUSCRIPCIÓN");
                        console.log(JSON.stringify(responseSuscripcion, null, 2));
    
                        setLoading(false);
    
                        //Muestra ventana modal para establecer contraseña
                        showSuccessModal();
                      })
                      .catch((errorSuscripcion:any) => {
                        setLoading(false);
                        console.log(
                          "Mensaje de error en suscripción: ",
                          errorSuscripcion.response.data.message
                        );
                      });
                  })
                  .catch((errorUsuario:any) => {
                    setLoading(false);
                    console.log(
                      "Mensaje de error en creación de usuario: ",
                      errorUsuario.response.data.message
                    );
                  });
              }
    
    
          }).catch((error:any) => {
            // Manejar el error
              setLoading(false);
              console.log("ERROR POST PAGO CATCH BLOQUE");
              //console.log(`Error: ${(error as AxiosError)?.response?.data}`);
    
            if (error.response && error.response.data) {
              if( !error.response.data.success ){
                  showErrorModal();
                  console.log("Mensaje de error: ", error.response.data.message);
              }
            } else {
              showErrorModal();
              console.log("Error en la transacción SIN DATA:", error.message);
            }
          });
           
        } else {
           setLoading(false);
          console.log("NO SE MANDA EL PAGO NO SE OBTUVO TOKEN PARA PAGO");
          showErrorModal();
        }
      };
      */

    const createUserSuscription = async () => {
        /* ToDo: Generar flujo para renovar suscripción */

        const bodyUser = {
            email: userEmail,
        };

        console.log("PLAN SELECCIONADO");
        
        console.log(JSON.stringify(selectedPlan, null, 2));
    
        MuySaludableApi.post("/usuarios", bodyUser)
            .then((responseUsuario) => {
                console.log("RESPUESTA CREACIÓN DE USUARIO");
                console.log(JSON.stringify(responseUsuario, null, 2));
                //Una vez creado el usuario, se procede a generar el registro de suscripción
                const bodySuscripcion = {
                id_usuario: responseUsuario.data.data.id,
                id_plan_alimenticio: selectedPlan.id,
                id_pago: "FREE-DISCOUNT-CODE-" + discountCode,
                fecha_expiracion: expirationDate,
                estado: "Activo",
                };

                //Establece idUsuario en el state
                setIdUsuario(responseUsuario.data.data.id);
                //console.log(JSON.stringify(bodySuscripcion, null, 2));
                //Una vez creado el usuario, se procede a generar el registro de suscripción
                MuySaludableApi.post(
                "/suscripciones",
                bodySuscripcion
                )
                .then((responseSuscripcion) => {
                    console.log("RESPUESTA SUSCRIPCIÓN");
                    console.log(JSON.stringify(responseSuscripcion, null, 2));

                   // setIdUsuario(responseSuscripcion.data.data.id_usuario);

                    setLoading(false);

                    //Muestra ventana modal para establecer contraseña
                    //showSuccessModal();
                })
                .catch((errorSuscripcion) => {
                    setLoading(false);
                    console.log(
                    "Mensaje de error en suscripción: ",
                    errorSuscripcion.response.data.message
                    );
                });
        })
        .catch((errorUsuario) => {
            setLoading(false);
            console.log(
            "Mensaje de error en creación de usuario: ",
            errorUsuario.response.data.message
            );
        });

    }

    const showSuccessModal = () => {
        //setIdUsuario(idUsuario);
        setModalSuccessVisible(true);
    };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg space-y-4">
       <Header />

        {
            visibleErrorAlert && (
                <div className="fixed top-2/10 left-6 right-6 bg-red-400 text-white text-center py-2 shadow-lg z-50 p-3">
                    <p
                        className="text-sm font-semibold"
                        dangerouslySetInnerHTML={{ __html: errorMessage }}
                    />
                </div>
            )
        }
       

        {/* Barra de imágenes de tarjetas aceptadas */}
        <div className="flex justify-center space-x-4 mb-4">
            <img src="https://muysaludable.com.mx/img-site/card-visa.svg" alt="Visa" className="w-10 h-6" />
            <img src="https://muysaludable.com.mx/img-site/card-mastercard.svg" alt="MasterCard" className="w-10 h-6" />
            <img src="https://muysaludable.com.mx/img-site/card-amex.svg" alt="American Express" className="w-10 h-6" />
        </div>

      {/* Título */}
      <h2 className="text-center text-2xl font-semibold mb-4"  style={{color:"#326807"}}>
        Información de Pago
      </h2>

      {/* Input de descuento y botón de validación */}
      <div className="flex items-center mb-4">
          <input
            type="text"
            placeholder="Descuento"
            value={discountCode}
            onChange={(e) => setDiscountCode(e.target.value)}
            className="flex-grow border border-gray-300 text-sm rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-700"
            style={{ width: '60%',color:"#326807" }} // Asignar el 70% del ancho
          />
          <button
            type="button"
            className="flex-none w-1/3 text-white font-semibold text-sm rounded-r-lg py-2 hover:bg-green-700 focus:outline-none"
            onClick={handleValidateDiscount}
            style={{ width: '40%', backgroundColor: "#faa029" }} // Asignar el 30% del ancho
          >
            {textButtonDiscount}
          </button>
        </div>


      {/* Input del Nombre del Titular */}
      <div className='items-start'>
        <label className={`block text-sm font-bold mb-1 text-left px-1 ${errorHolder ? 'text-red-600' : 'text-[#326807]'}`}>
          Nombre del Titular
        </label>
        <input
          type="text"
          placeholder="Nombre del Titular"
          value={cardHolder}
          onChange={handleCardHolderChange}
          className={`w-full px-3 py-2 border rounded-md text-gray-700 focus:outline-none focus:ring-2 ${errorHolder ? 'border-red-600 focus:ring-red-600' : 'border-gray-300 focus:ring-green-700'}`}
          style={{color:"#326807"}}
          disabled={inputDisabled}
        />
      </div>

      {/* Otro input de texto */}
      <div>
        <label className={`block text-sm font-bold mb-1 text-left px-1 ${errorCard ? 'text-red-600' : 'text-[#326807]'}`}>
          Número de Tarjeta
        </label>
        <input
          type="text"
          placeholder="Número de Tarjeta"
          value={cardNumber}
          onChange={handleCardNumberChange}
          className={`w-full px-3 py-2 border rounded-md text-gray-700 focus:outline-none focus:ring-2 ${errorCard ? 'border-red-600 focus:ring-red-600' : 'border-gray-300 focus:ring-green-700'}`}
          style={{color:"#326807"}}
          disabled={inputDisabled}
        />
      </div>

      {/* Inputs de Expiración y CVV */}
      <div className="flex space-x-2">
        <div className="flex-1">
          <label className={`block text-sm font-bold mb-1 text-left px-1 ${errorExpiration ? 'text-red-600' : 'text-[#326807]'}`}>
            Expiración
          </label>
          <input
            type="text"
            placeholder="MM/AA"
            value={expiration}
            onChange={handleExpirationChange}
            className={`w-full px-3 py-2 border rounded-md text-gray-700 focus:outline-none focus:ring-2 ${errorExpiration ? 'border-red-600 focus:ring-red-600' : 'border-gray-300 focus:ring-green-700'}`}
            style={{color:"#326807"}}
            disabled={inputDisabled}
          />
        </div>
        <div className="flex-1">
          <label className={`block text-sm font-bold mb-1 text-left px-1 ${errorCVV ? 'text-red-600' : 'text-[#326807]'}`}>
            CVV
          </label>
          <input
            type="text"
            placeholder="CVV"
            value={cvv}
            onChange={handleCVVChange}
            maxLength={4}
            className={`w-full px-3 py-2 border rounded-md text-gray-700 focus:outline-none focus:ring-2 ${errorCVV ? 'border-red-600 focus:ring-red-600' : 'border-gray-300 focus:ring-green-700'}`}
            style={{color:"#326807"}}
            disabled={inputDisabled}
          />
        </div>
      </div>

      {/* Texto con email y costo del plan */}
      <div className="text-center mt-6">
        <p className=" text-sm" style={{color:"#326807"}}>
          <span className="font-semibold">Email:</span> {userEmail}
        </p>
        <p className=" text-sm" style={{color:"#326807"}}>
          <span className="font-semibold">Costo del Plan:</span> {formatCurrency(planCost)}
        </p>
        {
            //Solo se muestra la sección de descuento en caso de que se aplique un cupón
            showDiscountCode &&  <p className=" text-sm" style={{color:"#faa029"}}>
            <span className="font-semibold">Descuento:</span> {discountCode} - {discountAmount}
          </p>
          }
       
        <p className=" text-lg" style={{color:"#326807"}}>
          <span className="font-semibold">Total a pagar:</span> {finalPrice}
        </p>
      </div>

      <button
        type="button"
        className="w-full mt-4 text-white font-semibold rounded-md py-2 hover:bg-orange-800 focus:outline-none"
        style={{backgroundColor: "#faa029"}}
        onClick={onSubmitPayment}
      >{
        inputDisabled ? "Confirmar Registro": "Confirmar Pago"
      }
      </button>

      
        <ModalSuccess
            visible={modalSuccessVisible}
            //visibleIndicator={indicatorVisible}
            disableButton={disableButton}
            idUsuario={idUsuario}
            //handlePassword={(text) => handlePassword(text)}
            //handleConfirmPassword={(text) => handleConfirmPassword(text)}
            //onConfirmContinue={handleConfirmContinue}
        />


      { loading && <LoadingIndicator /> }
    </div>
  );
};

// PropTypes para validar las propiedades
CreditCardForm.propTypes = {
  userEmail: PropTypes.string.isRequired,
  planCost: PropTypes.number.isRequired,
  selectedPlan: PropTypes.object,
  expirationDate: PropTypes.string
};

export default CreditCardForm;
