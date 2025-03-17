const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const paypal = require('@paypal/checkout-server-sdk');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors()); // Permettre les requêtes CORS
app.use(bodyParser.json());


app.get('/payments', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html')); // Assurez-vous que le chemin est correct
});

// Configurer le client PayPal
const clientId = 'AYvPy5jTSvgSKnkb883xjro4-LyVoN7OueY_UWzD27Qc-ODHs5yhMRT-DO7Fu4sfptv8xCG7wh5q9rXX';
const clientSecret = 'EHLAy1S3p4I7eGqbUAabqelAifYvZJ4HMDGZmHphzMRVo8UOUckXgOTkA_T5MC0oZbxvpnzQ_EpaosqV';

const environment = new paypal.core.SandboxEnvironment(clientId, clientSecret);
const client = new paypal.core.PayPalHttpClient(environment);

// Route pour gérer les paiements
app.post('/api/payment', async (req, res) => {
    const orderDetails = req.body; // Récupérer les détails de la commande envoyés par le frontend

    // Créer une commande PayPal
    const request = new paypal.orders.OrdersCreateRequest();
    request.requestBody({
        intent: 'CAPTURE',
        purchase_units: [{
            amount: {
                currency_code: 'USD',
                value: orderDetails.purchase_units[0].amount.value,
            },
        }],
    });

    try {
        const order = await client.execute(request);
        res.status(200).json(order); // Retourner les détails de la commande
    } catch (error) {
        console.error("Erreur lors de la création de la commande PayPal:", error);
        res.status(500).send("Erreur lors de la création de la commande PayPal.");
    }
});

app.listen(PORT, () => {
    console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
});