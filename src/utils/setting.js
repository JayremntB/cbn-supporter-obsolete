const sendResponse = require('../general/sendResponse');
const textResponse = require('../general/textResponse');
const validateInput = require('../general/validate-input');
const { userDataUnblockSchema } = require('../general/template');

const dbName = 'database-for-cbner';

module.exports = {
  handleSetGroupMessage: handleSetGroupMessage,
  handleSetTeacherMessage: handleSetTeacherMessage,
  handleWindDownMessage: handleWindDownMessage
}

function handleSetGroupMessage(client, textSplit, userData) {
  let update = userDataUnblockSchema(userData);
  let response = textResponse.defaultResponse;
  if(textSplit[0] === 'xemlop') {
    if(userData.group) {
      response = textResponse.xemlopResponse;
      response.text = `${userData.group}`;
      sendResponse(userData.sender_psid, response);
    }
    else {
      response.text = "Bạn chưa cài đặt tên lớp :(";
      sendResponse(userData.sender_psid, response);
    }
  }
  else if(textSplit[0] === 'xoalop') {
    update.group = ""
    client.db(dbName).collection('users-data').updateOne({ sender_psid: userData.sender_psid }, {
      $set: update
    }, (err) => {
      if(err) {
        response.text = "Ủa không xoá được, bạn hãy thử lại sau nhé T.T";
        sendResponse(userData.sender_psid, response);
      }
      else {
        response.text = "Xoá lớp thành công!"
        sendResponse(userData.sender_psid, response);
      }
    });
  }
  else if(textSplit[0] === 'lop') {
    if(textSplit.length === 1) {
      response.text = "Tên lớp bạn chưa ghi kìa :(";
      sendResponse(userData.sender_psid, response);
    }
    else if(validateInput.checkGroup(userData.sender_psid, textSplit[1])) {
      update.group = textSplit[1];
      client.db(dbName).collection('users-data').updateOne({ sender_psid: userData.sender_psid }, {
        $set: update
      }, (err) => {
        if(err) {
          response.text = "Ủa không cài đặt được, bạn hãy thử lại sau nhé T.T";
          sendResponse(userData.sender_psid, response);
        }
        else {
          response = textResponse.lopResponse;
          response.text = `Lưu tên lớp thành công! (${textSplit[1]})`;
          sendResponse(userData.sender_psid, response);
        }
      });
    }
  }
}

function handleSetTeacherMessage(client, textSplit, userData, defaultText) {
  let update = userDataUnblockSchema(userData);
  let response = textResponse.defaultResponse;
  if(textSplit[0] === 'xemgv') {
    if(userData.teacher) {
      response = textResponse.xemgvResponse;
      response.text = `${userData.teacher}`;
      sendResponse(userData.sender_psid, response);
    }
    else {
      response.text = "Bạn chưa cài đặt tên giáo viên :(";
      sendResponse(userData.sender_psid, response);
    }
  }
  else if(textSplit[0] === 'xoagv') {
    update.teacher = "";
    client.db(dbName).collection('users-data').updateOne({ sender_psid: userData.sender_psid }, {
      $set: update
    }, (err) => {
      if(err) {
        response.text = "Ủa không xoá được, bạn hãy thử lại sau nhé T.T";
        sendResponse(userData.sender_psid, response);
      }
      else {
        response.text = "Xoá lịch dạy thành công!"
        sendResponse(userData.sender_psid, response);
      }
    });
  }
  else if(textSplit[0] === 'gv') {
    if(textSplit.length === 1) {
      response.text = "Tên giáo viên bạn chưa ghi kìa :(";
      sendResponse(userData.sender_psid, response);
    }
    else if(validateInput.checkTeacherName(userData.sender_psid, validateInput.handleTeacherName(defaultText.toLowerCase().replace("gv ", "")))) {
      teacher = validateInput.handleTeacherName(defaultText.toLowerCase().replace("gv ", ""));
      update.teacher = teacher;
      client.db(dbName).collection('users-data').updateOne({ sender_psid: userData.sender_psid }, {
        $set: update
      }, (err) => {
        if(err) {
          response.text = "Ủa không cài đặt được, bạn hãy thử lại sau nhé T.T";
          sendResponse(userData.sender_psid, response);
        }
        else {
          response = textResponse.gvResponse;
          response.text = `Lưu giáo viên thành công! (${teacher})`;
          sendResponse(userData.sender_psid, response);
        }
      });
    }
  }
}

function handleWindDownMessage(client, textSplit, userData) {
  let update = userDataUnblockSchema(userData);
  let response = textResponse.defaultResponse;
  if(textSplit[0] === 'xemwd') {
    response = textResponse.xemwdResponse;
    response.text = `${userData.wind_down_time}'`;
    sendResponse(userData.sender_psid, response);
  }
  else if(textSplit[0] === 'xoawd') {
    update.wind_down_time = 14;
    client.db(dbName).collection('users-data').updateOne({ sender_psid: userData.sender_psid }, {
      $set: update
    }, (err) => {
      if(err) {
        response.text = "Ủa không xoá được, bạn hãy thử lại sau nhé T.T";
        sendResponse(userData.sender_psid, response);
      }
      else {
        response.text = "Thời gian trung bình để chìm vào giấc ngủ của bạn đã được đổi về mặc định (14')"
        sendResponse(userData.sender_psid, response);
      }
    });
  }
  else if(textSplit[0] === 'wd') {
    if(textSplit.length === 1) {
      response.text = "Bạn chưa ghi thời gian kìa :(";
      sendResponse(userData.sender_psid, response);
    }
    else if(validateInput.checkWindDownTime(userData.sender_psid, textSplit[1])) {
      update.wind_down_time = Number(textSplit[1]);
      client.db(dbName).collection('users-data').updateOne({ sender_psid: userData.sender_psid }, {
        $set: update
      }, (err) => {
        if(err) {
          response.text = "Ủa không cài đặt được, bạn hãy thử lại sau nhé T.T";
          sendResponse(userData.sender_psid, response);
        }
        else {
          response = textResponse.wdResponse;
          response.text = `Cài đặt thành công! Thời gian trung bình để chìm vào giấc ngủ của bạn là ${textSplit[1]}'.`;
          sendResponse(userData.sender_psid, response);
        }
      });
    }
  }
}
