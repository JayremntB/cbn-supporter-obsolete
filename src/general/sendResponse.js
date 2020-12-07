const request = require('request');

module.exports = function (sender_psid, response) {
  let request_body = {
    "recipient": {
      "id": sender_psid
    },
    "messaging_type": "RESPONSE",
    "message": response
  }
  request({
    "uri": "https://graph.facebook.com/v6.0/me/messages",
    // "qs": { "access_token": process.env.TEST_PAGE_ACCESS_TOKEN },
    "qs": { "access_token": process.env.PAGE_ACCESS_TOKEN },
    "method": "POST",
    "json": request_body
  }, (err, res, body) => {
    if(err) {
      console.error("Unable to send message:" + err);
    } else {
      console.log(`+ successfully sent message \n=================================`);
    }
  });
}
