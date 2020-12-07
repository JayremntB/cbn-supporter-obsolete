const request = require('request');
const sendResponse = require('../general/sendResponse');
const templateResponse = require('../general/templateResponse');
const { userDataUnblockSchema } = require('../general/template');
const { settingAvatar, getPersonaID } = require('./chat-room');
const dbName = 'database-for-cbner';

module.exports = {
  init: init,
  handleMessage: handleMessage
}

function init(client, userData) {
  let update = userDataUnblockSchema(userData);
  update.find_images.block = true;
  client.db(dbName).collection('users-data').updateOne({ sender_psid: userData.sender_psid }, {
    $set: update
  }, (err) => {
    if(err) return console.log(err);
    const response = {
      "text": "Nhập từ khoá...\n"
    };
    sendResponse(userData.sender_psid, response);
  });
}

function handleMessage(client, text, userData) {
  text = text.toLowerCase();
  if(text !== "ảnh khác" && text !== "đặt làm ảnh chat") {
    let queryString = "";
    text.split(" ").forEach((component) => {
      queryString += component + "+"
    });
    request({
      "uri": "https://pixabay.com/api/",
      "qs": {
        "key": process.env.PIXABAY_API_KEY,
        "q": queryString,
        "lang": "vi",
        "per_page": 50
      },
      "method": "GET"
    }, (err, res, body) => {
      body = JSON.parse(body);
      if(parseInt(body.hits.length) > 0) {
        // send message with first img
        let response = {
          "text": `Tìm thấy ${body.total} kết quả!`
        };
        sendResponse(userData.sender_psid, response);
        setTimeout(() => {
          response = templateResponse.findImagesSendAttachment;
          response.attachment.payload.url = body.hits[0].largeImageURL;
          response.attachment.type = "image";
          sendResponse(userData.sender_psid, response);
        }, 300);
        // update imgs' url
        let listImgsURL = [];
        body.hits.forEach((img) => {
          listImgsURL.push(img.largeImageURL);
        });
        let update = userDataUnblockSchema(userData);
        update.find_images.block = true;
        update.find_images.list_images = listImgsURL;
        update.find_images.img_now = 1;
        client.db(dbName).collection('users-data').updateOne({ sender_psid: userData.sender_psid }, {
          $set: update
        });
      }
      else {
        let update = userDataUnblockSchema(userData);
        update.find_images.block = true;
        client.db(dbName).collection('users-data').updateOne({ sender_psid: userData.sender_psid }, {
          $set: update
        });
        const response = {
          "text": "Không tìm thấy kết quả nào.\nHãy nhập từ khoá khác..."
        };
        sendResponse(userData.sender_psid, response);
      }
    });
  }
  else if(text === "ảnh khác") {
    if(!userData.find_images.list_images.length) {
      const response = {
        "text": "Nhập từ khoá..."
      };
      sendResponse(userData.sender_psid, response);
      return;
    }

    if(userData.find_images.img_now >= userData.find_images.list_images.length) userData.find_images.img_now = 0;
    let response = templateResponse.findImagesSendAttachment;
    response.attachment.payload.url = userData.find_images.list_images[userData.find_images.img_now];
    sendResponse(userData.sender_psid, response);

    client.db(dbName).collection('users-data').updateOne({ sender_psid: userData.sender_psid }, {
      $set: {
        "find_images.img_now": userData.find_images.img_now + 1
      }
    });
  }
  else if(text === "đặt làm ảnh chat") getPersonaID(client, userData.room_chatting.name, userData.find_images.list_images[userData.find_images.img_now - 1], userData);
}
