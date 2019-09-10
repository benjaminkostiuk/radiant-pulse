# Pulse for Google Assistant

This repository contains the complete code for creating and developing the Pulse Google Assistant Agent created for Youtube.

Included is the zipped JSON for easy agent import, the full cloud function code to be hosted by Firebase and tools for local development.

## Setup
Before beginning you __must__ have a google account. You can create one [here](https://accounts.google.com/signup/v2/webcreateaccount?flowName=GlifWebSignIn&flowEntry=SignUp).

### Step 1: Create a new Project on Actions on Google
1. Create or Import a [New Project](https://console.actions.google.com/) on [Actions on Google](https://developers.google.com/actions/)
2. Specify Invocation of your project under __Setup > Invocation__
3. Add an Action to fufill your invocation under __Build > Actions__
4. Select **Custom Intent** then **Build**
5. You will be redirected to Dialogflow
6. Rename your Dialogflow Agent
7. Specify language, timezone and click **Create**

### Step 2: Setting up your Dialogflow Agent
1. Clone the repository with `git clone https://github.com/BenjaminKostiuk/radiant-pulse.git`
2. Navigate in Dialogflow console under **Settings** ⚙ > __Export and Import__ tab > __RESTORE FROM ZIP__
3. Select `DialogflowAgent.zip` from the project directory
4. Type `RESTORE` and click **Restore**
5. Click **Save**
6. Ensure that all intents and entities have been imported properly

### Step 3: Connect to the Youtube API
1. Navigate to https://console.developers.google.com/apis/dashboard?
2. Select the name of your Google Project
3. Under __Library__ search for the **Youtube Analytics** & **Youtube Data V3** APIS and enable both.
4. Next, navigate to __Credentials__ and find the auto created OAuth 2.0 client ID. 
  + It should be named __Web Client (auto created by Google Service)__.
5. Make a note of the __Client ID__ and __Client secret__. These will be used for setting up Oauth. 
6. Add this authorized redirect URI under the section _Authorized redirect URIs_: https://oauth-redirect.googleusercontent.com/r/ *{your app name}* and save.
7. Navigate to https://console.actions.google.com and select your Google project > __Develop__ > __Account Linking__
8. Select 'Yes, allow users to sign up for new accounts via voice'.
9. Select __OAuth & Google Sign In__ as Linking Type with __Implicit__ Authentication.
10. Paste the Client ID from earlier and the following information:
 + Authorization URL: https://accounts.google.com/o/oauth2/v2/auth
 + Token URL: https://www.googleapis.com/oauth2/v3/tokeninfo

11. Add the following scopes to the client:   // TODO add more scopes
```
https://www.googleapis.com/auth/yt-analytics.readonly
```
12. Save and test

### Step 4: Firebase CLI and npm
1. `cd` to the `functions` directory from the repository
2. Run `npm install`
3. Install the Firebase CLI by running `npm install -g firebase-tools`
4. Login with your Google account, `firebase login`
6. Add your project to the sample with `firebase use <project ID>`
  + In Dialogflow console under **Settings** ⚙ > **General** tab > copy **Project ID**.

## Development

### Locally
1. Navigate to the `functions` directory.
2. Run `npm run tunnel` and copy the URL that ngrok gives. It should look like this http://75e31e28.ngrok.io.
3. In a new terminal run `npm run serve` from the functions directory.
4. Back in the Dialogflow Console > **Fulfillment** > **Enable** Webhook.
5. Change the URL to _{url}_/dialogflow
 + For example: http://75e31e28.ngrok.io/dialogflow
6. Save the changes. All traffic should be forwarded to localhost:5000.

### Deployment
1. Navigate to the `functions` directory.
2. Run `firebase deploy --only functions:dialogflowFirebaseFulfillment`
3. When successfully deployed, visit the **Project Console** link > **Functions** > **Dashboard**
  + Copy the link under the events column. For example: `https://us-central1-<PROJECTID>.cloudfunctions.net/<FUNCTIONNAME>`
4. Ensure that back in Dialogflow Console > **Fulfillment** > **Enable** Webhook.
  + If not, Paste the URL from the Firebase Console’s events column into the **URL** field > **Save**..

## Other Dialogflow Samples 
| Name                                 | Language                         |
| ------------------------------------ |:---------------------------------|
| [Fulfillment Webhook JSON](https://github.com/dialogflow/fulfillment-webhook-json)| JSON |
| [Dialogflow Console Template](https://github.com/dialogflow/fulfillment-webhook-nodejs)| Node.js
| [Bike Shop-Google Calendar API](https://github.com/dialogflow/fulfillment-bike-shop-nodejs)| Node.js|
| [WWO Weather API](https://github.com/dialogflow/fulfillment-weather-nodejs)| Node.js |
| [Alexa Importer](https://github.com/dialogflow/fulfillment-importer-nodejs) | Node.js |
| [Temperature Trivia](https://github.com/dialogflow/fulfillment-temperature-converter-nodejs) | Node.js |
| [Human-Agent](https://github.com/dialogflow/agent-human-handoff-nodejs) | Node.js |
| [Google Translation API](https://github.com/dialogflow/fulfillment-translate-python) | Python |
| [WWO Weather API](https://github.com/dialogflow/fulfillment-weather-python) | Python |


## Resources & Issues
* Questions? Try [StackOverflow](https://stackoverflow.com/questions/tagged/dialogflow).
* Dialogflow [Documentation](https://dialogflow.com/docs/getting-started/basics).
* For more information on [Initializing Firebase SDK for Cloud Functions](https://firebase.google.com/docs/functions/get-started#set_up_and_initialize_functions_sdk).

## License
See [LICENSE](LICENSE).

## Contributors
