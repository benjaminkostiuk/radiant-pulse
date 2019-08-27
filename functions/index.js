// Dialogflow fulfillment getting started guide:
// https://dialogflow.com/docs/how-tos/getting-started-fulfillment

'use strict';

const functions = require('firebase-functions');
const { google } = require('googleapis');
const {
  dialogflow,
  Suggestions } = require('actions-on-google');
const auth = require('./utils/auth');


const youtubeAnalytics = google.youtubeAnalytics('v2');   // Get Google's Youtube Analytics Api

process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements

const app = dialogflow({
  clientId: '482054100077-mpve9p8ksof22m1nh97pktqao8li6sbj.apps.googleusercontent.com'
});

// ---------------------- Google Sign In Functions -------------------------------
app.intent('sign.in', auth.signIn);

app.intent('sign.in - event:confirmation', (conv, params, signin) => {
  if (signin.status === 'OK') {
    conv.ask("You're signed in. Let's get started!");
    if (conv.screen) {
      conv.ask(new Suggestions('What can you do?'));
    }
  } else {
    conv.ask("I won\'t be able to connect to your account, what do you want to do next?");
  }
});

/*
  User account statistic functions
*/



app.intent('analytics.video.views', (conv) => {
  conv.ask('hello');
});



// Export the dialogflowFufillment for Firebase cloud function
exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);
// Export your dialogflow app for local debugging
exports.googleAssistantAgent = app;


//   // function testFunction(agent) {
//   //   let conv = agent.conv();
//   //   let token = conv.user.access.token;
//   //   if(token) {
//   //     console.log(token);
//   //     gAuth.setCredentials({
//   //       access_token: token
//   //     });
//   //     youtubeAnalytics.reports.query({
//   //       auth: gAuth,
//   //       dimensions: 'day',
//   //       endDate: '2019-01-02',
//   //       startDate: '2019-01-01',
//   //       metrics: 'likes,dislikes,views',
//   //       ids: 'channel==mine'
//   //     }, (err, response) => {
//   //       if(err) {
//   //         console.log(err);
//   //       } else {
//   //         console.log(response);
//   //       }
//   //     }); 
//   //     conv.ask('Has token');
//   //     // runReport(token).then(output => {
//   //     //   conv.ask('Sucess');
//   //     //   agent.add(conv);
//   //     // }).catch(error => {
//   //     //   conv.ask('Failed to pull resource');
//   //     //   agent.add(conv);
//   //     // });
//   //   } else {
//   //     conv.ask('No token');
//   //   }
//   //   agent.add(conv);
//   // }






//   // Run the proper function handler based on the matched Dialogflow intent name
//   let intentMap = new Map();
//   if(agent.requestSource == agent.ACTIONS_ON_GOOGLE) {
//     intentMap.set('analytics.video.views', testFunction);
//     intentMap.set('sign.in', signIn);
//     intentMap.set('sign.in.confirmation', confirmationSignIn);
//   } else {
//     intentMap.set('analytics.video.views', testFunction);
//   }
//   agent.handleRequest(intentMap);
// });

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