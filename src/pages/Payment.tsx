
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useNavigate } from 'react-router-dom';

const Payment = () => {
    const navigate = useNavigate();

    return (
        <PayPalScriptProvider options={{ clientId: "YOUR_PAYPAL_CLIENT_ID", currency: "USD" }}>
            <div>
                <h1>Renew Subscription</h1>
                <PayPalButtons
                    createOrder={async (_data, _actions) => {
                        // Créer une commande via le serveur
                        const response = await fetch('http://localhost:5000/api/payment', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                purchase_units: [{
                                    amount: {
                                        currency_code: "USD",
                                        value: "10.00",
                                    },
                                }],
                            }),
                        });

                        const orderData = await response.json();
                        return orderData.id; // Retourner l'ID de la commande créée par le serveur
                    }}
                    onApprove={async (_data, _actions) => {
                        // Capturer la commande via le serveur
                        const response = await fetch(`http://localhost:5000/api/payment/${_data.orderID}`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                        });

                        if (response.ok) {
                            alert("Subscription renewed successfully!");
                            navigate('/builder'); // Rediriger vers le Builder après le paiement
                        } else {
                            alert("Erreur de paiement. Veuillez réessayer.");
                        }
                    }}
                    onError={(err) => {
                        console.error("Erreur PayPal :", err);
                        alert('Une erreur s\'est produite lors du paiement. Veuillez réessayer.');
                    }}
                />
                <button onClick={() => navigate('/builder')}>
                    Back to Builder
                </button>
            </div>
        </PayPalScriptProvider>
    );
};

export default Payment;