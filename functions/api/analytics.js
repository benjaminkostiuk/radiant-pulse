const youtubeAnalytics = google.youtubeAnalytics('v2');   // Get Google's Youtube Analytics Api


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