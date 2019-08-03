/*
    Creates an Express App for local development purposes,
    this speeds up the process of making minor ajustments with nodemon and allows
    for quick additions.
*/

const express = require('express');
const bodyParser = require('body-parser');

const PORT = process.env.PORT || 5000;

// Import cloud function for Dialogflow Webhook
const dialogflowFunction = require('./index.js').dialogflowFirebaseFulfillment;

// Create express app
let app = express();

app.get('/', (req, res) => res.send('online')); // Test route to see if app is running
/* 
    Send the dialoflow request through this route.
    Remember to set your Webhook URL to [ngrok url]/dialogflow when developping locally
*/
app.post('/dialogflow', express.json(), (req, res) => dialogflowFunction(req, res));

app.listen(PORT);


