//import LoadingIndicator from "./LoadingIndicator";

import { useLocation } from "react-router-dom";
import CreditCardForm from "./CreditCardForm";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
//import { useState } from "react";

const stripePromise = loadStripe( import.meta.env.VITE_STRIPE_PUBLIC_KEY );

function PaymentScreen(  ) {

    const location = useLocation();
    console.log(location);
    const { email, precio, selectedView, expirationDate, accountCreatedFromApp } = location.state;
    
    return (
        <div className="bg-gray-200 min-h-screen flex justify-center">
            <div className="bg-white w-full max-w-2xl mx-auto p-5 shadow-lg rounded-lg">
                <div className="flex flex-col items-center bg-white relative min-h-screen">

                <Elements stripe={stripePromise}>
                    <CreditCardForm userEmail={email} planCost={Number(precio)} selectedPlan={selectedView} expirationDate={expirationDate} fromApp={accountCreatedFromApp}/>
                </Elements>
                </div>
            </div>
        </div>
    );
}

export default PaymentScreen;