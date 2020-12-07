'use strict'
const sendResponse = require('../general/sendResponse');
const typingOn = require('../general/typing');
const textResponse = require('../general/textResponse');

module.exports = function(textSplit, userData) {
  const responseDefault = [
    `Trung bình bạn mất ${userData.wind_down_time} phút để chìm vào giấc ngủ, một giấc ngủ đủ giấc sẽ kéo dài từ 3 đến 6 chu kỳ. Thời điểm tốt nhất bạn nên thức dậy chính là lúc giao thoa giữa 2 chu kỳ.`,
    "Nếu có thể thức dậy vào lúc đó, đảm bảo bạn sẽ có một ngày tuyệt vời tràn đầy năng lượng!"
  ];
  let response = {
    "text": ""
  };
  if(textSplit.length === 1) { // Sleep now
    const date = new Date();
    date.setHours(date.getHours() + 7); // App is deployed in heroku US +7(VN)
    response.text = `Bây giờ là ${date.getHours()} giờ ${date.getMinutes()} phút. Bạn nên thức dậy vào những thời điểm sau:\n`;
    // Estimate time to wake up if sleep now
    date.setMinutes(date.getMinutes() + 90 * 2 + userData.wind_down_time);
    for (let i = 0; i < 4; i ++) {
      date.setMinutes(date.getMinutes() + 90);
      response.text += `+ ${date.getHours()} giờ ${date.getMinutes()} phút\n`;
    }
    sendResponse(userData.sender_psid, response);
    typingOn(userData.sender_psid);
    setTimeout(() => {
      response.text = responseDefault[0];
      sendResponse(userData.sender_psid, response);
      typingOn(userData.sender_psid);
      setTimeout(() => {
        typingOn(userData.sender_psid);
        response = textResponse.estimateTimeResponse;
        response.text = responseDefault[1];
        sendResponse(userData.sender_psid, response);
      }, 3500);
    }, 3000);
  }
  else if(checkTime(userData.sender_psid, textSplit[1].split("h"))) {
    const time = textSplit[1].split("h");
    const date = new Date();
    date.setHours(time[0]);
    date.setMinutes(time[1]);
    response.text = `Nếu ngủ lúc ${date.getHours()} giờ ${date.getMinutes()} phút, bạn nên thức dậy vào những thời điểm sau:\n`;
    // Estimate time to wake up if sleep at that time
    date.setMinutes(date.getMinutes() + 90 * 2 + userData.wind_down_time);
    for(let i = 0; i < 4; i ++) {
      date.setMinutes(date.getMinutes() + 90);
      response.text += `+ ${date.getHours()} giờ ${date.getMinutes()} phút\n`;
    }
    sendResponse(userData.sender_psid, response);
    typingOn(userData.sender_psid);
    setTimeout(() => {
      response.text = responseDefault[0];
      sendResponse(userData.sender_psid, response);
      typingOn(userData.sender_psid);
      setTimeout(() => {
        typingOn(userData.sender_psid);
        response = textResponse.estimateTimeResponse;
        response.text = responseDefault[1];
        sendResponse(userData.sender_psid, response);
      }, 3500);
    }, 3000);
  }
}

function checkTime(sender_psid, time) {
  if(isNaN(time[0]) || isNaN(time[1]) || time[0] < 0 || time[0] > 24 || time[1] < 0 || time[1] > 60) {
    let response = textResponse.defaultResponse;
    response.text = "Xin lỗi, tớ không hiểu thời gian bạn vừa nhập :(";
    sendResponse(sender_psid, response);
    return 0;
  }
  return 1;
}
