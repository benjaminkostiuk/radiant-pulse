/*
    For more information about Youtube Data Api:
        - Explore features: https://developers.google.com/youtube/v3/
        - Api explorer: https://developers.google.com/apis-explorer/#search/youtube/youtube/v3/
        - Official documentation: https://googleapis.dev/nodejs/googleapis/latest/youtube/index.html
*/
const { google } = require('googleapis');
const ytData = google.youtube('v3');   // Get Google's Youtube Data Api 

module.exports.getChannelStatistics = async function (gAuth, mine) {
    console.log('Calling Youtube Data Api api.channel.list...');
    let response;
    try {
        response = await ytData.channels.list({
            auth: gAuth,
            part: 'statistics',
            mine: mine
        });
    } catch (err) {
        console.log(`Failed to retreive channel statistics with error: ${err}`);
        return null;
    }
    console.log(`Successfully retreived channel stats: ${response.data["items"][0]["statistics"]}`);
    return response.data["items"][0]["statistics"];
}