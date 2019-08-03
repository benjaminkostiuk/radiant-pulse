const express = require('express');
const bodyParser = require('body-parser');

const PORT = process.env.PORT || 5000;

// Import cloud function
const dialogFlowFunction = require('./index.js');

let app = express();

app.get('/', (req, res) => res.send('online'));
// Send the dialoflow request through this.
app.post('/dialogflow', express.json(), (req, res) => dialogFlowFunction.dialogflowFirebaseFulfillment(req, res));

app.listen(PORT);


