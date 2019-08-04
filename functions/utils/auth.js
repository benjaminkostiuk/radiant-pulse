'use strict';

const {google} = require('googleapis');

module.exports.authenticateUser = function(agent) {
    const gAuth = new google.auth.OAuth2();   // Set up Google OAuth2 for authenticating as End Users
    let token = getToken(agent);
    // If token is attached to user
    if(token) {
        gAuth.setCredentials({      // Set token as access token
            access_token: token
        });
        return gAuth;
    } else {
        return null;
    }
}

function getToken(agent) {
    let conv = agent.conv();
    return conv.user.access.token;
}