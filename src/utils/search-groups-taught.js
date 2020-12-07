'use strict'
const sendResponse = require('../general/sendResponse');
const textResponse = require('../general/textResponse');
const { handleDayInput, checkSubjectName, handleSubjectName, convertTimestamp } = require('../general/validate-input');
const { userDataUnblockSchema } = require('../general/template');

const dbName = 'database-for-cbner';

module.exports = {
  init: init,
  handleMessage: handleMessage
};

function handleMessage(client, text, userData) {
  client.db(dbName).collection('schedule').findOne({ updated_time: {$gt: 0} }, (err, data) => {
    if(err) console.log(err);
    else if(userData.schedule_updated_time < data.updated_time) {
      let subjectFind = "";
      if(!userData.search_groups_taught.subject) {
        if(!checkSubjectName(userData.sender_psid, text.toLowerCase())) return;
        else {
          subjectFind = handleSubjectName(text.toLowerCase());
          subjectFind = subjectFind.charAt(0).toUpperCase() + subjectFind.slice(1).toLowerCase();
          if(subjectFind === "Gdcd") subjectFind = "GDCD";
        }
      }
      updateData(client, userData, subjectFind);
    }
    else {
      if(text.toLowerCase() === "tra môn học khác") {
        const response = textResponse.searchClassesAskSubject;
        clearSubjectData(client, userData.sender_psid);
        sendResponse(userData.sender_psid, response);
      }
      else if(userData.search_groups_taught.subject) {
        sendGroups(text, userData, client, data.updated_time);
      }
      else if(checkSubjectName(userData.sender_psid, text.toLowerCase())) {
        text = handleSubjectName(text.toLowerCase());
        text = text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
        if(text === "Gdcd") text = "GDCD";
        updateData(client, userData, text);
      }
    }
  });
}

function init(client, userData) {
  let update = userDataUnblockSchema(userData);
  update.search_groups_taught.block = true;
  client.db(dbName).collection('users-data').updateOne({ sender_psid: userData.sender_psid }, {
    $set: update
  }, (err) => {
    if(err) {
      console.log("could not init search_groups_taught block");
      const response = {
        "text": "Úi, tớ không kết nối với database được. Bạn hãy thử lại sau nha T.T"
      };
      sendResponse(userData.sender_psid, response);
    }
    else {
      console.log('init search search_groups_taught successfully');
      const response = textResponse.searchClassesAskSubject;
      sendResponse(userData.sender_psid, response);
    }
  });
}

function clearSubjectData(client, sender_psid) {
  client.db(dbName).collection('users-data').updateOne({ sender_psid: sender_psid }, {
    $set: {
      search_groups_taught: {
        block: true,
        subject: "",
        list_groups: []
      }
    }
  }, (err) => {
    if(err) {
      console.log("Could not clear teacher-data: " + err);
      const response = {
        "text": "Úi, tớ không kết nối với database được. Bạn hãy thử lại sau nha T.T"
      };
      sendResponse(sender_psid, response);
    }
    else console.log("Clear subject data successfully");
  });
}

async function updateData(client, userData, subjectName) {
  await client.db(dbName).collection('schedule').find({ "schedule.0": {$exists: true} }).toArray((err, docs) => {
    if (err) {
      console.error("Could not update subject data: \n" + err);
      const response = {
        "text": "Úi, tớ không kết nối với database được. Bạn hãy thử lại sau nha T.T"
      };
      sendResponse(userData.sender_psid, response);
    }
    else {
      let groups = [];
      for(let i = 0; i < 6; i ++) { // loop days
        groups.push({
          "morning": [],
          "afternoon": []
        });
        for(let j = 0; j < 5; j ++) { // loop classes
          groups[i].morning.push({
            class: j + 1,
            groups: []
          });
          groups[i].afternoon.push({
            class: j + 1,
            groups: []
          });
          docs.forEach((doc) => {
            if(doc.schedule[i].morning && doc.schedule[i].morning[j] && doc.schedule[i].morning[j].subject === subjectName){
              groups[i].morning[j].groups.push(doc.group);
            }
            if(doc.schedule[i].afternoon && doc.schedule[i].afternoon[j] && doc.schedule[i].afternoon[j].subject === subjectName){
              groups[i].afternoon[j].groups.push(doc.group);
            }
          });
        }
      }
      //
      let update = userDataUnblockSchema(userData);
      update.search_groups_taught.block = true;
      update.search_groups_taught.subject = subjectName;
      update.search_groups_taught.groups = groups;
      const date = new Date();
      date.setHours(date.getHours() + 7); // deploy at US
      update.schedule_updated_time = date.getTime();
      client.db(dbName).collection('users-data').updateOne({ sender_psid: userData.sender_psid }, {
        $set: update
      }, (err) => {
        if (err) {
          console.log("Could not update groups data: " + err);
          const response = {
            "text": "Úi, tớ không kết nối với database được. Bạn hãy thử lại sau nha T.T"
          };
          sendResponse(userData.sender_psid, response);
        } else {
          console.log("Update groups data successfully");
          let response = textResponse.searchGroupsAskDay;
          response.text = `Cập nhật các lớp học môn ${subjectName} thành công!\nBạn muốn tra thứ mấy?`;
          sendResponse(userData.sender_psid, response);
        }
      });
    }
  });
}

function sendGroups(dayInput, userData, client, updated_time) {
  let response = textResponse.searchGroupsAskDay;
  let day = handleDayInput(dayInput.toLowerCase());
  let groups = userData.search_groups_taught.groups;
  if(!isNaN(day)) {
    if(day == 8) {
      response.text = "Làm gì có tiết nào...";
      sendResponse(userData.sender_psid, response);
    }
    else if(day - 1 > groups.length || day - 2 < 0) {
      response.text = `Đừng nhắn gì ngoài phần gợi ý bên dưới nhé :(`;
      sendResponse(userData.sender_psid, response);
    }
    else {
      const data = groups[day - 2];
      let text = `Các lớp học môn ${userData.search_groups_taught.subject} thứ ${day}:
 - Sáng: `;
      data.morning.forEach((subdata) => {
        let groupsTaught = "";
        subdata.groups.forEach((group, i) => {
          groupsTaught += group;
          if(i !== subdata.groups.length - 1) groupsTaught += ", ";
        });
        if(groupsTaught === "") text += `
   + Tiết ${subdata.class}: Không`;
        else text += `
   + Tiết ${subdata.class}: ${groupsTaught}`;
      });
      //    ------------------------
      text += `
 - Chiều: `;
      //
      data.afternoon.forEach((subdata, classes) => {
        if(classes > 1) return;
        let groupsTaught = "";
        subdata.groups.forEach((group, i) => {
          groupsTaught += group;
          if(i !== subdata.groups.length - 1) groupsTaught += ", ";
        });
        if(groupsTaught === "") text += `
   + Tiết ${subdata.class}: Không`;
        else text += `
   + Tiết ${subdata.class}: ${groupsTaught}`;
      });
      //    ------------------------
      text += "\n-----------\nNgày cập nhật thời khoá biểu: ";
      text += convertTimestamp(updated_time ? updated_time : "Not found");
      response.text = text;
      sendResponse(userData.sender_psid, response);
    }
  }
  else {
    response.text = `Đừng nhắn gì ngoài phần gợi ý bên dưới nhé :(`;
    sendResponse(userData.sender_psid, response);
  }
}
