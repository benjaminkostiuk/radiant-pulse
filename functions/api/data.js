/*
    For more information about Youtube Data Api:
        - Explore features: https://developers.google.com/youtube/v3/
        - Api explorer: https://developers.google.com/apis-explorer/#search/youtube/youtube/v3/
        - Official documentation: https://googleapis.dev/nodejs/googleapis/latest/youtube/index.html
*/
const { google } = require('googleapis');
const ytData = google.youtube('v3');   // Get Google's Youtube Data Api 

// Retrieve channel details about a channel specified by part
module.exports.getChannelDetails = async function (gAuth, part, mine) {
    console.log('Calling Youtube Data Api api.channel.list...');
    let response;
    try {
        response = await ytData.channels.list({
            auth: gAuth,
            part: part,
            mine: mine
        });
    } catch (err) {
        console.log(`Failed to retrieve channel information with error: ${err}`);
        return null;
    }
    let data = response.data['items'][0][part];
    data.id = response.data['items'][0]['id'];  // Include Channel Id
    console.log(`Successfully retreived channel information: ${data}`);
    return data;
}

// Retrieve the list of subscribers linked to a user's channel
module.exports.getSubscriptions = async function (gAuth, pagination, pageToken) {
    console.log('Calling YouTube Data Api api.subscriptions.list...');
    let response;
    try {
        response = await ytData.subscriptions.list({
            auth: gAuth,
            part: 'snippet',
            mine: true,
            pageToken: pageToken || ''
        });
    } catch (err) {
        console.log(`Failed to retrieve subscription information with error: ${err}`);
        return null;
    }
    let data = response.data['items'];
    for (var i = 0; i < data.length; i++) {
        data[i].snippet.thumbnail = await getChannelThumbnail(gAuth, data[i].snippet.resourceId.channelId);
    }
    // Pagination
    if (pagination && response.data['nextPageToken']) {    // Has more data
        moreData = await this.getSubscriptions(gAuth, pagination, response.data['nextPageToken']);
        if (moreData) {
            data.concat(moreData);
        } else {
            return null;
        }
    }
    console.log(`Successfully pulled subscription data: ${data}`);
    return data;
}

// Get the thumnail url from a given channel Id
async function getChannelThumbnail(gAuth, id) {
    let thumbnailresponse;
    try {
        thumbnailresponse = await ytData.channels.list({
            auth: gAuth,
            part: 'snippet',
            id: id
        });
    } catch (error) {
        console.log(`Failed to retrieve thumbnail for channel: ${id} with error: ${error}`);
        return 'https://static.thenounproject.com/png/340719-200.png';
    }
    return thumbnailresponse.data['items'][0]['snippet']['thumbnails']['high']['url'];
}