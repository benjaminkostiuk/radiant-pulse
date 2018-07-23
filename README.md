# Dialogflow Fulfillment Webhook Template for Node.js and Cloud Functions for Firebase

This webhook template sets up everything you need to build your fulfillment for your Dialogflow agent.

## Setup Instructions

### Option #1: Dialogflow Inline Editor (Recommended)
1. **Fulfillment** > **Enable** the [Dialogflow Inline Editor](https://dialogflow.com/docs/fulfillment#cloud_functions_for_firebase)<sup> a.</sup>
2. Select **Deploy**

  <sup>a.</sup>Powered by Cloud Functions for Firebase

### Option #2: Firebase CLI
1. `git clone https://github.com/dialogflow/fulfillment-webhook-nodejs.git`
2. `cd` to the `functions` directory
3. `npm install`
4. Install the Firebase CLI by running `npm install -g firebase-tools`
5. Login with your Google account, `firebase login`
6. Add your project to the sample with $ `firebase use <project ID>`
  + In Dialogflow console under **Settings** ⚙ > **General** tab > copy **Project ID**.
7. Run `firebase deploy --only functions:dialogflowFirebaseFulfillment`
8. When successfully deployed, you will see a Project Console link and from there: **Functions** > **Dashboard**
  + Copy the link under the events column. For ex:  `https://us-central1-<PROJECTID>.cloudfunctions.net/<FUNCTIONNAME>`.
9. Back in DialogFlow Console > **Fulfullment** > **Enable** Webhook.
10. Paste the URL from the Firebase Console’s events column into the **URL** field > **Save**


## License
See [LICENSE](LICENSE).

## Terms
Your use of this sample is subject to, and by using or downloading the sample files you agree to comply with, the [Google APIs Terms of Service](https://developers.google.com/terms/).
