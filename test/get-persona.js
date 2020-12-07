const request = require('request');

request({
  "uri": "https://graph.facebook.com/me/personas",
  "qs": { access_token: process.env.PAGE_ACCESS_TOKEN },
  // "qs": { "access_token": process.env.TEST_PAGE_ACCESS_TOKEN },
  "method": "POST",
  "json": {
  	"name": "Người lạ",
  	"profile_picture_url": "https://i.imgur.com/187Y4u3.png",
  }
}, (err, res, body) => {
  if(err) console.log(err);
  else console.log(body);
})
