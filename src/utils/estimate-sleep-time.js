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
  while(textSplit.length < 2) textSplit.push("6h");
  const time = textSplit[1].split("h");
  if(checkTime(userData.sender_psid, time)) {
    const date = new Date();
    date.setHours(time[0]);
    date.setMinutes(time[1]);
    response.text = `Nếu muốn thức dậy lúc ${date.getHours()} giờ ${date.getMinutes()} phút, bạn nên ngủ vào những thời điểm sau:\n`;
    // Estimate time to sleep if wake up at that time
    date.setMinutes(date.getMinutes() - 90 * 6 - userData.wind_down_time);
    for(let i = 0; i < 4; i ++) {
      response.text += `+ ${date.getHours()} giờ ${date.getMinutes()} phút\n`;
      date.setMinutes(date.getMinutes() + 90);
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
