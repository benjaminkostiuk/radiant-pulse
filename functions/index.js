// Dialogflow fulfillment getting started guide:
// https://dialogflow.com/docs/how-tos/getting-started-fulfillment

'use strict';

const functions = require('firebase-functions');
const { google } = require('googleapis');
const { dialogflow,
  Suggestions,
  BrowseCarousel,
  BrowseCarouselItem,
  BasicCard,
  Button,
  Image } = require('actions-on-google');

const auth = require('./utils/auth');   // Authentication for calling Google Apis
const dateformat = require('dateformat');
const youtubeData = require('./api/data');   // Call the YouTube Data v3 Api

process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements

const app = dialogflow({
  // Replace with your client ID of your Actions Project
  clientId: '482054100077-mpve9p8ksof22m1nh97pktqao8li6sbj.apps.googleusercontent.com'
});

// Obtain information about the agent
app.intent('agent.information', (conv) => {
  conv.ask('I can give you information about your YouTube channel and other channels, '
    + 'subscribe to channels, like videos and retrieve your YouTube analytics data all on your behalf.');
  conv.ask(new Suggestions('Show me my channel'));
  conv.ask(new Suggestions('Get my data'));
});

/* ---------------------- Google Sign In Functions ------------------------------- */
app.intent('sign.in', auth.signIn);

// Sign in confirmation
app.intent('sign.in - event:confirmation', (conv, params, signin) => {
  if (signin.status === 'OK') {
    conv.ask("You're signed in. Let's get started!");
    if (conv.screen) {
      conv.ask(new Suggestions('What can you do?'));
      conv.ask(new Suggestions('Show me my channel'));
      conv.ask(new Suggestions('What are my stats?'));
      conv.ask(new Suggestions('Show me my subscriptions'));
    }
  } else {
    conv.ask("I can\'t connect to your account, what do you want to do next?");
  }
});

// Sign in prompt for users to connect their account
app.intent('sign.in - event:prompt', (conv) => {
  conv.ask('In order to complete that request you\'ll need to connect to your YouTube account. Ask me to sign in to connect.');
  if (conv.screen) {
    conv.ask(new Suggestions('Sign in'));
    conv.ask(new Suggestions('Connect to YouTube'));
  }
});

/* ----------------- YouTube Channel intents ------------------------------- */

// Get the statistics for a user's channel
app.intent('channel.mine.statistics', async (conv, { statistic }) => {
  let gAuth = auth.authenticateUser(conv);
  if (gAuth) {
    const statsObj = await youtubeData.getChannelDetails(gAuth, 'statistics', true);   // Get statistic information
    if (statsObj) {
      // Object to convert statistic into something for the Assistant to say back
      let plainTextStatistic = {
        'commentCount': 'comments',
        'subscriberCount': 'subscribers',
        'videoCount': 'videos',
        'viewCount': 'views'
      };
      if (statistic) {
        conv.ask(`Your account has ${statsObj[statistic]} ${plainTextStatistic[statistic]}.`);
      } else {
        conv.ask(`Your account has ${statsObj['subscriberCount']} subscribers, ${statsObj['viewCount']} views, ${statsObj['videoCount']} video and ${statsObj['commentCount']} comments.`);
      }
    } else {
      conv.ask('I\'m having some trouble getting your information. Try again later.');
    }
  } else {
    conv.followup('pulse_intent_SIGN_IN_PROMPT');  // Redirect to sign in prompt
  }
});

// Get information about a user's channel
app.intent('channel.mine.overview', async (conv, { property }) => {
  let gAuth = auth.authenticateUser(conv);
  if (gAuth) {
    const overviewObj = await youtubeData.getChannelDetails(gAuth, 'snippet', true);  // Get details
    if (overviewObj) {
      // TODO add no screen text
      if (!conv.screen) {   // If no screen provided
        conv.ask('No screen :(');
        return;
      }
      conv.ask('Here\'s an overview of your YouTube channel.');
      conv.ask(new BasicCard({
        title: `${overviewObj.title} - Youtube Channel`,
        subtitle: `Published ${dateformat(overviewObj.publishedAt, 'dddd, mmmm dS, yyyy')}`,
        text: overviewObj.description,
        buttons: new Button({
          title: 'Open in YouTube',
          url: `https://www.youtube.com/channel/${overviewObj.id}`,
        }),
        image: new Image({
          url: overviewObj.thumbnails.high.url,
          alt: 'Thumbnail',
        }),
        display: 'WHITE'
      }));
    } else {
      conv.ask('I\'m having some trouble getting your information. Try again later.');
    }
  } else {
    conv.followup('pulse_intent_SIGN_IN_PROMPT');  // Redirect to sign in prompt
  }
});

/* ------------------- YouTube Subscription intents ------------------------- */

// Show a list of subscriptions for a channel
app.intent('channel.mine.subscriptions.list', async (conv) => {
  let gAuth = auth.authenticateUser(conv);
  if (gAuth) {
    const subscriptions = await youtubeData.getSubscriptions(gAuth, false, null); // Just get a sample to start

    // TODO add no screen text
    if (!conv.screen) {   // If no screen provided
      conv.ask('No screen :(');
      return;
    }

    if (subscriptions) {
      conv.ask('Here are some of your subscriptions. ');
      conv.ask(new BrowseCarousel({
        items: subscriptions.map((value) => {
          return new BrowseCarouselItem({
            title: value.snippet.title,
            url: `https://www.youtube.com/channel/${value.snippet.resourceId.channelId}`,
            description: value.snippet.description,
            image: new Image({
              url: value.snippet.thumbnail,
              alt: 'Thumbnail'
            }),
            footer: 'Tap to view'
          });
        })
      }));
      conv.ask('Would you like to view the entire list?');
    } else {
      conv.ask('I\'m having some trouble getting your subscriptions. Try again later.');
    }
  } else {
    conv.followup('pulse_intent_SIGN_IN_PROMPT');  // Redirect to sign in prompt
  }
});

// Followup: Yes to view the entire list
app.intent('channel.mine.subscriptions.list - yes', (conv) => {
  if (!conv.screen) {    // No screen
    conv.ask('No view and manage your subscription list go to https://www.youtube.com/subscription_manager');
    return;
  }

  conv.ask('Here\'s a link to view and manage your subscriptions.');
  conv.ask(new BasicCard({
    title: 'YouTube subscription manager',
    subtitle: 'View and manage your subscriptions',
    text: '',
    buttons: new Button({
      title: 'Open subscription manager',
      url: 'https://www.youtube.com/subscription_manager'
    }),
  }));
  // TODO add Suggestions
});

app.intent('channel.mine.subscriptions.list - no', (conv) => {
  conv.ask('Ok, what can I help you with?');
  //TODO add Suggestions
});

// Export the dialogflowFufillment for Firebase cloud function
exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);
// Export your dialogflow app for local debugging
exports.googleAssistantAgent = app;