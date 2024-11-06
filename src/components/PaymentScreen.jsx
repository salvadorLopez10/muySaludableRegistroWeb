//import LoadingIndicator from "./LoadingIndicator";

import { useLocation } from "react-router-dom";
import CreditCardForm from "./CreditCardForm";
//import { useState } from "react";

function PaymentScreen(  ) {

    const location = useLocation();
    console.log(location);
    const { email, precio, selectedView, expirationDate } = location.state;
    
    return (
        <div className="bg-gray-200 min-h-screen flex justify-center">
            <div className="bg-white w-full max-w-2xl mx-auto p-5 shadow-lg rounded-lg">
                <div className="flex flex-col items-center bg-white relative min-h-screen">

                <CreditCardForm userEmail={email} planCost={Number(precio)} selectedPlan={selectedView} expirationDate={expirationDate}/>
                </div>
            </div>
        </div>
    );
}

export default PaymentScreen;