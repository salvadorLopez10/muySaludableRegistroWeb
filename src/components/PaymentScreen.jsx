//import LoadingIndicator from "./LoadingIndicator";

import { useLocation } from "react-router-dom";

function PaymentScreen(  ) {

    const location = useLocation();
    console.log(location);
    const { email } = location.state;
    
    return (
        <>
            <div>HOLA mi email es { email }</div>
            
        </>
    );
}

export default PaymentScreen;