const request = require('request');
const sendResponse = require('../general/sendResponse');
const textResponse = require('../general/textResponse');
const { userDataUnblockSchema } = require('../general/template');

const dbName = 'database-for-cbner';
const collectionName = 'users-data';

module.exports = {
  startLiveChat: startLiveChat,
  endLiveChat: endLiveChat,
  deniedUsingOtherFeatures: deniedUsingOtherFeatures
}

function startLiveChat(client, userData) {
  let response = {
    "text": "Đợi tý, tớ đang gọi thằng coder..."
  };
  sendResponse(userData.sender_psid, response);
  onLiveChat(client, userData);
  // send notification to author with user's info
  request({
    "uri": `https://graph.facebook.com/${userData.sender_psid}`,
    "qs": {
      "fields": "name",
      "access_token": process.env.PAGE_ACCESS_TOKEN
    },
    "method": "GET"
  }, (err, res, body) => {
    if(err) {
      console.error("Unable to send message:" + err);
    } else {
      let userName = JSON.parse(body);
      response = {
        "text": `Hey boyyy, ${userName.name} wants to have a conversation :^)`
      };
      sendResponse("3785286158180365", response);
    }
  });
}

function endLiveChat(client, userData) {
  // send notification to author with user's info
  request({
    "uri": `https://graph.facebook.com/${userData.sender_psid}`,
    "qs": {
      "fields": "name",
      "access_token": process.env.PAGE_ACCESS_TOKEN
    },
    "method": "GET"
  }, (err, res, body) => {
    if(err) {
      console.error("Unable to send message:" + err);
    } else {
      let userName = JSON.parse(body);
      response = {
        "text": `${userName.name} has just typed Exit...`
      };
      sendResponse(process.env.authorPSID, response);
    }
  });
}

function deniedUsingOtherFeatures(userData) {
  let response = textResponse.liveChatExitResponse;
  response.text = "Nhập Exit để thoát hỗ trợ và sử dụng các tính năng khác nhé :3";
  sendResponse(userData.sender_psid, response);
}

function onLiveChat(client, userData) {
  let update = userDataUnblockSchema(userData);
  update.live_chat = true;
  client.db(dbName).collection(collectionName).updateOne({ sender_psid: userData.sender_psid }, {
    $set: update
  }, (err) => {
    if(err) {
      console.error(err);
      const response = {
        "text": "Úi, tớ không kết nối với database được. Bạn hãy thử lại sau nha T.T"
      };
      sendResponse(userData.sender_psid, response);
    }
    else {
      setTimeout(() => {
        const response = textResponse.liveChatExitResponse;
        sendResponse(userData.sender_psid, response);
      }, 500);
    }
  });
}
