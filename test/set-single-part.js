(async () => {

// This file just for setting up single part of chatbot like get started button,
// persistent menu, greeting text,... It does not support for main code and
// another files in this repository

const request = require('request');
//
// await request({
//   "uri": "https://graph.facebook.com/v8.0/me/messenger_profile",
//   // "uri": "https://graph.facebook.com/me/personas",
//   "qs": { "access_token": process.env.PAGE_ACCESS_TOKEN },
//   "method": "POST",
//   "json": {
//     "setting-type":"call_to_actions",
//     "thread_state":"new_thread",
//     "get_started": {
//       "payload": "getStarted"
//     }
//   }
// }, (err, res, body) => {
//   console.log("getStarted: \n");
//   if(err) console.error(err);
//   else console.log(body);
// });

await request({
  "uri": "https://graph.facebook.com/v8.0/me/messenger_profile",
  // "uri": "https://graph.facebook.com/me/personas",
  // "qs": { "access_token": process.env.TEST_PAGE_ACCESS_TOKEN },
  "qs": { "access_token": process.env.PAGE_ACCESS_TOKEN },
  "method": "POST",
  "json": {
    "persistent_menu": [
      {
        "locale": "default",
        "composer_input_disabled": false,
        "call_to_actions": [
          {
            "type": "postback",
            "title": "Menu",
            "payload": "menu"
          },
          {
            "type": "postback",
            "title": "About",
            "payload": "chatbotInformation"
          },
          {
            "type": "postback",
            "title": "Yêu cầu hỗ trợ",
            "payload": "help"
          },
          {
            "type": "web_url",
            "title": "Gửi phản hồi",
            "url": "https://forms.gle/er53FLSRkVQyL3FF8",
            "webview_height_ratio": "full"
          }
        ]
      }
    ]
  }
}, (err, res, body) => {
  console.log('persistent_menu: \n');
  if(err) console.error(err);
  else console.log(body);
});

// await request({
//   "uri": "https://graph.facebook.com/v8.0/me/messenger_profile",
//   "qs": { "access_token": process.env.PAGE_ACCESS_TOKEN },
//   "method": "POST",
//   "json": {
//     "greeting":[{
//       "locale":"default",
//       "text":"Chào {{user_first_name}} nha :> Bấm GET STARTED/BẮT ĐẦU để khám phá những tính năng dành riêng cho CBNers nhé!"
//     }]
//   }
// }, (err, res, body) => {
//   console.log('greeting: \n');
//   if(err) console.error(err);
//   else console.log(body);
// });

// request({
//   "uri": "https://graph.facebook.com/v2.6/me/messenger_profile",
//   "qs": { "access_token": process.env.PAGE_ACCESS_TOKEN },
//   "method": "DELETE",
//   "json": {
//     "fields":[
//       "persistent_menu"
//     ]
//   }
// }, (err, res, body) => {
//   console.log('delete: \n');
//   if(err) console.error(err);
//   else console.log(body);
// });
})()
