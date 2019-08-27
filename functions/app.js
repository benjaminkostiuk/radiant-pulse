/*
    Creates an Express App for local development purposes,
    this speeds up the process of making minor ajustments with nodemon and allows
    for quick additions.
*/
const express = require('express');
const bodyParser = require('body-parser');

const PORT = process.env.PORT || 5000;

// Import cloud function for Dialogflow Webhook
const googleAssistant = require('./index.js').googleAssistantAgent;

// Create express app
let app = express().use(bodyParser.json());

app.get('/', (req, res) => res.send('online')); // Test route to see if app is running (Look at this in a browser)
/*
    Send the dialoflow request through this route.
    Remember to set your Webhook URL to [ngrok url]/dialogflow when developping locally
*/
app.post('/dialogflow', googleAssistant);

console.log(`Listening on PORT ${PORT}...`);
app.listen(PORT);


