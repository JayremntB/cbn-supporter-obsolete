// This feature was deprecated
'use strict'
const request = require('request');
const sendResponse = require('../general/sendResponse');
const typingOn = require('../general/typing')
const textResponse = require('../general/textResponse');

module.exports = function (sender_psid) {
  let response = textResponse.defaultResponse;
  // Fetch http://covid-rest.herokuapp.com/vietnam
  typingOn(sender_psid);
  request({
    "uri": "https://api.covid19api.com/summary",
    "method": "GET",
  }, (err, res, body) => {
    const data = JSON.parse(body);
    if(!err && data.Message !== "Caching in progress") {
      console.log(data);
      if(data.Global.TotalDeaths === "") data.Global.TotalDeaths = "0";
      if(data.Countries[data.Countries.length - 4].TotalDeaths === "") data.Countries[data.Countries.length - 4].TotalDeaths = "0";
      if(data.Global.NewConfirmed === "") data.Global.NewConfirmed = "0";
      if(data.Countries[data.Countries.length - 4].NewConfirmed === "") data.Countries[data.Countries.length - 4].NewConfirmed = "0";
      response.text = `Tình hình dịch bệnh trên thế giới:
  - Tổng ca nhiễm: ${data.Global.TotalConfirmed}
  - Tổng ca tử vong: ${data.Global.TotalDeaths}
  - Tổng ca hồi phục: ${data.Global.TotalRecovered}
  - Số ca nhiễm mới: ${data.Global.NewConfirmed}
  - Số ca tử vong mới: ${data.Global.NewDeaths}
  - Số ca hồi phục mới: ${data.Global.NewRecovered}
  ------
  Tình hình dịch bệnh trong nước:
  - Tổng ca nhiễm: ${data.Countries[data.Countries.length - 5].TotalConfirmed}
  - Tổng ca tử vong: ${data.Countries[data.Countries.length - 5].TotalDeaths}
  - Tổng ca hồi phục: ${data.Countries[data.Countries.length - 5].TotalRecovered}
  - Số ca nhiễm mới: ${data.Countries[data.Countries.length - 5].NewConfirmed}
  - Số ca tử vong mới: ${data.Countries[data.Countries.length - 5].NewDeaths}
  - Số ca hồi phục mới: ${data.Countries[data.Countries.length - 5].NewRecovered}
  ------
  Giữ cho mình một sức khoẻ dẻo dai, luyện tập thể dục và rửa tay thường xuyên nha <3`
      sendResponse(sender_psid, response);
    }
    else {
      response.text = "Có lỗi xảy ra, thử lại sau ha :("
      sendResponse(sender_psid, response);
    }
  });
}