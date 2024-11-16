import Header from "./Header";

function WelcomeScreen(  ) {
    
    return (
        <div className="bg-gray-200 min-h-screen flex justify-center items-center">
            <div className="bg-white w-full max-w-2xl mx-auto p-5 shadow-lg rounded-lg text-center">
                <Header />
                <div className="flex flex-col items-center bg-white relative min-h-screen">
                    <h1 className="text-2xl font-extrabold mt-5" style={{color: "#326807"}}>¡TU SUSCRIPCIÓN</h1>
                    <h1 className="text-2xl font-extrabold mb-6" style={{color: "#326807"}}>SE HA GENERADO CORRECTAMENTE!</h1>

                    <img
                        src="https://muysaludable.com.mx/img-site/logoMuySaludableMR.png"
                        alt="Logo Muy Saludable"
                        className="mx-auto"
                        width={100}
                        height={100}
                    />

                    <h4 className="text-lg mb-3 mt-3"  style={{color: "#326807"}}>
                        Para disfrutar de los beneficios
                    </h4>
                    <h4 className="text-lg mb-4"  style={{color: "#326807"}}>de tu suscripción</h4>
                    <h4 className="text-lg mb-4"  style={{color: "#326807"}}>te invitamos a</h4>

                    <h4 className="text-lg mb-4"  style={{color: "#326807"}}>descargar nuestra app móvil</h4>

                    <h4 className="text-lg mb-4"  style={{color: "#326807"}}>dando click en alguno</h4>
                    <h4 className="text-lg mb-4"  style={{color: "#326807"}}>de los siguientes enlaces:</h4>
                    <div className="flex space-x-4">
                        <a href="https://play.google.com/store" target="_blank" rel="noopener noreferrer">
                            <img src="https://muysaludable.com.mx/img-site/google_play.png" alt="Google Play" className="w-32 h-auto" />
                        </a>
                        <a href="https://apps.apple.com/store" target="_blank" rel="noopener noreferrer">
                            <img src="https://muysaludable.com.mx/img-site/app_store.png" alt="App Store" className="w-32 h-auto" />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default WelcomeScreen;