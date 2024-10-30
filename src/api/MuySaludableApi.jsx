import axios from "axios";

let MuySaludableApi = null;

async function loadConfig() {
  try {
    // Solicita el archivo de configuración con una marca de tiempo para evitar el cacheo.
    //const response = await axios.get(`https://muysaludable.com.mx/config_app.json?timestamp=${new Date().getTime()}`);
    //console.log("OBTENIENDO API DINAMICAMENTE");
    //console.log(JSON.stringify(response.data, null, 2));
    
    //const config = response.data;
  
    // Crea la instancia de Axios con la baseURL cargada dinámicamente.
    //baseURL: config.baseURL,
    MuySaludableApi = axios.create({
      baseURL: "http://192.168.100.130:8000/api",
      //baseURL: config.baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error("Error loading config:", error);
    
    // Usa una baseURL predeterminada si falla la carga del JSON.
    MuySaludableApi = axios.create({
      baseURL: 'https://rest-server-muy-saludable-git-d4d2c5-salvadorlopez10s-projects.vercel.app/api',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}

// Llama a la función para cargar la configuración al inicio.
loadConfig();

export { MuySaludableApi };
