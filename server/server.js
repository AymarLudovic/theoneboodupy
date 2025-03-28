const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const paypal = require('@paypal/checkout-server-sdk');
const path = require('path');
const { Groq } = require('groq-sdk'); 

 // Load environment variables from .env file

const app = express();
const PORT =  5000;

app.use(cors()); // Permettre les requêtes CORS
app.use(bodyParser.json());


app.post('/api/groq', async (req, res) => {
    try {
      const { input } = req.body;
      const groqApiKey = "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";
  
      if (!groqApiKey) {
        console.error("VITE_GROQ_API_KEY is missing!");
        return res.status(500).json({ message: "Groq API key is missing!" });
      }
  
      const groq = new Groq({ apiKey: groqApiKey });
  
      const chatCompletion = await groq.chat.completions.create({
        messages: [{ role: "user", content: input }],
        model: "llama-3.3-70b-versatile",
        temperature: 1,
        max_completion_tokens: 1024,
        top_p: 1,
        stop: null,
      });
  
      const responseText = chatCompletion.choices?.[0]?.message?.content || "";
      res.status(200).json({ responseText });
  
    } catch (error) {
      console.error("Error in /api/groq:", error);
      res.status(500).json({ message: error.message || "An error occurred" });
    }
  });

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