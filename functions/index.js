// Dialogflow fulfillment getting started guide:
// https://dialogflow.com/docs/how-tos/getting-started-fulfillment

'use strict';

const functions = require('firebase-functions');
const { google } = require('googleapis');
const { dialogflow, Suggestions, SimpleResponse } = require('actions-on-google');

const auth = require('./utils/auth');   // Authentication for calling Google Apis
const youtubeData = require('./api/data');   // Call the YouTube Data v3 Api

process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements

const app = dialogflow({
  // Replace with your client ID of your Actions Project
  clientId: '482054100077-mpve9p8ksof22m1nh97pktqao8li6sbj.apps.googleusercontent.com'
});

/* ---------------------- Google Sign In Functions ------------------------------- */
app.intent('sign.in', auth.signIn);
// Sign in confirmation
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

/* ----------------- User account statistic functions ------------------------------- */
// Get the statistics for a user's channel
app.intent('channel.mine.statistics', async (conv, { statistic }) => {
  let gAuth = auth.authenticateUser(conv);
  if (gAuth) {
    const statsObj = await youtubeData.getChannelStatistics(gAuth, true);   // Get statistic information
    if (statsObj) {
      // Object to convert statistic into something for the Assistant to say back
      let plainTextStatistic = {
        'commentCount': 'comment count',
        'subscriberCount': 'subscriber count',
        'videoCount': 'video count',
        'viewCount': 'view count'
      };
      if(statistic) {
        conv.ask(`Your ${plainTextStatistic[statistic]} is ${statsObj[statistic]}.`);
      } else {
        conv.ask(`You have ${statsObj['subscriberCount']} subscribers, ${statsObj['viewCount']} views, ${statsObj['videoCount']} videos and ${statsObj['commentCount']} comments.`);
      }
    } else {
      conv.ask('I\'m having some trouble pulling your information. Try again later.');
    }
  } else {
    // TODO add context for suggestions later
    conv.followup('pulse_intent_SIGN_IN');  // Redirect to sign in
  }
});


// Export the dialogflowFufillment for Firebase cloud function
exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);
// Export your dialogflow app for local debugging
exports.googleAssistantAgent = app;