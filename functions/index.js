// Copyright 2017, Google, Inc.
// Licensed under the Apache License, Version 2.0 (the 'License');
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an 'AS IS' BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// Dialogflow fulfillment getting started guide:
// https://dialogflow.com/docs/how-tos/getting-started-fulfillment

'use strict';

const functions = require('firebase-functions');
const {google} = require('googleapis');
const {SignIn} = require('actions-on-google');
const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment');

const gAuth = new google.auth.OAuth2();   // Set up Google OAuth2 for authenticating as End Users
const youtubeAnalytics = google.youtubeAnalytics('v2');   // Get Google's Youtube Analytics Api

process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements

exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  // Create Webhook Client
  const agent = new WebhookClient({ request, response });
  // Uncomment for debugging purposes
  // console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  // console.log('Dialogflow Request body: ' + JSON.stringify(request.body));

  // // Uncomment and edit to make your own intent handler
  // // uncomment `intentMap.set('your intent name here', yourFunctionHandler);`
  // // below to get this function to be run when a Dialogflow intent is matched
  // function yourFunctionHandler(agent) {
  //   agent.add(`This message is from Dialogflow's Cloud Functions for Firebase inline editor!`);
  //   agent.add(new Card({
  //       title: `Title: this is a card title`,
  //       imageUrl: 'https://dialogflow.com/images/api_home_laptop.svg',
  //       text: `This is the body text of a card.  You can even use line\n  breaks and emoji! 💁`,
  //       buttonText: 'This is a button',
  //       buttonUrl: 'https://docs.dialogflow.com/'
  //     })
  //   );
  //   agent.add(new Suggestion(`Quick Reply`));
  //   agent.add(new Suggestion(`Suggestion`));
  //   agent.setContext({ name: 'weather', lifespan: 2, parameters: { city: 'Rome' }});
  // }

  function testFunction(agent) {
    let conv = agent.conv();
    let token = conv.user.access.token;
    if(token) {
      console.log(token);
      gAuth.setCredentials({
        access_token: token
      });
      youtubeAnalytics.reports.query({
        auth: gAuth,
        dimensions: 'day',
        endDate: '2019-01-02',
        startDate: '2019-01-01',
        metrics: 'likes,dislikes,views',
        ids: 'channel==mine'
      }, (err, response) => {
        if(err) {
          console.log(err);
        } else {
          console.log(response);
        }
      }); 
      conv.ask('Has token');
      // runReport(token).then(output => {
      //   conv.ask('Sucess');
      //   agent.add(conv);
      // }).catch(error => {
      //   conv.ask('Failed to pull resource');
      //   agent.add(conv);
      // });
    } else {
      conv.ask('No token');
    }
    agent.add(conv);
  }

  function signIn(agent) {
    let conv = agent.conv();
    conv.ask(new SignIn('To get access token'));
    agent.add(conv);
  }


  function confirmationSignIn(agent) {
   console.log(agent);
   let conv = agent.conv();
   console.log(conv);
   conv.ask('Great! Confirmed!');
   agent.add(conv); 
  }

  // Run the proper function handler based on the matched Dialogflow intent name
  let intentMap = new Map();
  if(agent.requestSource == agent.ACTIONS_ON_GOOGLE) {
    intentMap.set('analytics.video.views', testFunction);
    intentMap.set('sign.in', signIn);
    intentMap.set('sign.in.confirmation', confirmationSignIn);
  } else {
    intentMap.set('analytics.video.views', testFunction);
  }
  
  // intentMap.set('<INTENT_NAME_HERE>', yourFunctionHandler);
  // intentMap.set('<INTENT_NAME_HERE>', googleAssistantHandler);
  agent.handleRequest(intentMap);
});

function runReport(token) {
  if(token) {
    console.log(token)

    return new Promise((resolve, reject) => {
      
    });


  }


  
}
