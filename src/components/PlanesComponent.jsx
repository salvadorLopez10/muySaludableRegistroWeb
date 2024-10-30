    import { useEffect,useState } from "react";
    import { useNavigate } from 'react-router-dom';
    //import axios from 'axios';
    import { MuySaludableApi } from "../api/MuySaludableApi";


    function PlanesComponent(  ) {
      const [planes, setPlanes] = useState([]);
      const [modalVisible, setModalVisible] = useState(false);
      const [selectedView, setSelectedView] = useState(null);

      const navigate = useNavigate();

      useEffect(() => {
        const fetchPlanes = async () => {
          try {
            const response = await MuySaludableApi.get('/planesAlimenticios');
            
            setPlanes(response.data.elementos);
          } catch (error) {
            console.error('Error al cargar los planes:', error);
          }
        };

        fetchPlanes();
      }, []);

      const handleOpenModal = (element) => {
        setSelectedView(element);
        setModalVisible(true);
      };

      const handleCloseModal = () => {
        setModalVisible(false);
      };

      const handleSelectPlan = () => {
        //navigate('/resumen-plan');
        navigate("/resumen-plan", { state: { selectedView } });
      }; 


      return (
        <div className="bg-gray-200 min-h-screen flex justify-center items-center">
          <div className="bg-white w-full max-w-2xl mx-auto p-8 shadow-lg rounded-lg text-center">
            <div className="flex flex-col items-center bg-white relative min-h-screen">
            <h1 className="text-2xl font-extrabold text-green-800 mb-6">BIENVENIDO A MUY SALUDABLE</h1>

          {/* Imagen centrada */}
          <img
            src="https://muysaludable.com.mx/wp-content/uploads/2020/08/cropped-Logo-Muy-Saludable-2-99x103.png"
            alt="Logo Muy Saludable"
            className="mx-auto"
          />
          
              {/* <img
                src="path/to/background_carrete_frutas.jpg"
                alt="Background"
                className="w-full h-full object-cover absolute"
              /> */}

              {/* Título */}
              <div className="mt-5 text-center">
                <p className="text-green-800 text-2xl font-extrabold">ELIGE ALGUNO DE</p>
                <p className="text-green-800 text-2xl font-extrabold">LOS 4 PLANES</p>
                <p className="text-green-800 text-lg font-medium mt-2">Y vive una vida más saludable</p>
              </div>

              {/* Menú selección de planes */}
              <div className="overflow-y-scroll w-full flex flex-col items-center mt-5">
                {planes.map((element) => (
                  <button
                    key={element.id}
                    onClick={() => handleOpenModal(element)}
                    className="max-w-full border-2 border-orange-400 bg-white rounded-lg p-3 my-3 shadow-md text-center"
                  >
                    <p className="text-orange-400 text-xl font-extrabold">{element.nombre}</p>
                      {/* Renderizar cada línea del resumen en un <p> */}
                      {element.resumen.split("\n").map((line, index) => (
                        <p className="text-green-800 text-base font-medium mt-2" key={index}>{line}</p>
                      ))}
                    
                    <div className="flex justify-center items-center mt-3">
                      <span className="text-green-800 text-lg font-extrabold">De </span>
                      <span className="relative mx-1">
                        <span className="text-green-800 text-lg font-extrabold line-through">
                          ${element.precio_regular}
                        </span>
                        <span className="absolute inset-0 w-full h-0.5 bg-orange-400 transform translate-y-1/2" />
                      </span>
                      <span className="text-green-800 text-lg font-extrabold"> a ${element.precio}</span>
                    </div>
                    <div className="mt-5 bg-orange-400 text-white rounded-full px-4 py-2 text-sm font-medium">
                      DA CLIC
                    </div>
                  </button>
                ))}
              </div>

              {/* Modal */}
              {modalVisible && (
                <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
                  <div className="bg-yellow-100 rounded-lg p-5 w-11/12 md:w-1/2 relative">
                    <button
                      onClick={handleCloseModal}
                      className="absolute top-3 right-3 text-gray-700 text-xl font-bold"
                    >
                      ×
                    </button>
                  <div className="text-center mb-4">
                      <h2 className="text-green-700 text-2xl font-extrabold">Resumen del plan</h2>
                  </div>
                  <div className="text-center mb-4">
                    <p className="text-green-700 text-lg font-bold">{selectedView?.nombre}</p>
                  </div>
                  <div className="mb-4 space-y-2">
                {selectedView?.descripcion_detallada.split("\n").map((linea, index) => (
                  <div key={index} className="flex items-center">
                    <span className="text-green-700 text-xl mr-2">•</span>
                    <p className="text-green-700 text-base text-left">{linea}</p>
                  </div>
                ))}
              </div>
              <button
                onClick={handleSelectPlan}
                className="bg-orange-400 text-white text-center font-medium w-full rounded-lg py-3 mt-5"
              >
                Seleccionar
              </button>
            </div>
          </div>
        )}

            </div>
          </div>
        </div>
      );
    }

    export default PlanesComponent;
