'use strict';

const { google } = require('googleapis');
const { SignIn } = require('actions-on-google');

module.exports.authenticatedUser = function (conv) {
    const gAuth = new google.auth.OAuth2();   // Set up Google OAuth2 for authenticating as End Users
    let token = conv.user.access.token;
    // If token is attached to user
    if (token) {
        gAuth.setCredentials({      // Set token as access token
            access_token: token
        });
        return gAuth;
    } else {
        return null;
    }
}

module.exports.signIn = function (conv) {
    conv.ask(new SignIn('In order to complete your request.'));
}

