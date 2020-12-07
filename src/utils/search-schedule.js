'use strict'
const sendResponse = require('../general/sendResponse');
const textResponse = require('../general/textResponse');
const { checkGroup, handleDayInput, convertTimestamp } = require('../general/validate-input');
const { userDataUnblockSchema } = require('../general/template');

const dbName = 'database-for-cbner';

module.exports = {
  handleMessage: handleMessage,
  init: init
}

function handleMessage(client, text, userData) {
  client.db(dbName).collection('schedule').findOne({ updated_time: {$gt: 0} }, (err, data) => {
    if(err) console.log(err);
    else if(userData.schedule_updated_time < data.updated_time) {
      let groupFind = userData.search_schedule_other_group.block
      ? userData.search_schedule_other_group.group
      : userData.group;
      if(!userData.group && !userData.search_schedule_other_group.group) {
        if(!checkGroup(userData.sender_psid, text)) return;
        else groupFind = text;
      }
      updateData(client, userData, groupFind, userData.search_schedule_other_group.block);
    }
    else {
      if(text === "tra lớp khác") {
        const response = textResponse.searchScheduleAskGroup;
        clearOtherGroupData(client, userData.sender_psid);
        sendResponse(userData.sender_psid, response);
      }
      else if(!userData.search_schedule_other_group.block) { // have group set
        sendSchedule(text, userData, client, data.updated_time);
      }
      else if(userData.search_schedule_other_group.group) { // not have group set, but being day searching
        sendSchedule(text, userData, client, data.updated_time);
      }
      else if(checkGroup(userData.sender_psid, text)) { // not being day searching, but being group searching
        updateData(client, userData, text, userData.search_schedule_other_group.block);
      }
    }
  });
}

function init(client, userData) {
  if(userData.group) { // init search_schedule_block, add schedule of that group
    updateData(client, userData, userData.group, userData.search_schedule_other_group.block);
  }
  else { // init both search_schedule_block & search_schedule_other_group block
    let update = userDataUnblockSchema(userData);
    update.search_schedule_block = true;
    update.search_schedule_other_group.block = true;
    update.search_schedule_other_group.group = "";
    update.search_schedule_other_group.schedule = [];
    client.db(dbName).collection('users-data').updateOne({ sender_psid: userData.sender_psid }, {
      $set: update
    }, (err) => {
      if(err) {
        console.log("could not init search_schedule_other_group block");
        const response = {
          "text": "Úi, tớ không kết nối với database được. Bạn hãy thử lại sau nha T.T"
        };
        sendResponse(userData.sender_psid, response);
      }
      else {
        console.log('init search_schedule_other_group block successfully');
        const response = textResponse.searchScheduleAskGroup;
        sendResponse(userData.sender_psid, response);
      }
    });
  }
}

function clearOtherGroupData(client, sender_psid) {
  client.db(dbName).collection('users-data').updateOne({ sender_psid: sender_psid }, {
    $set: {
      search_schedule_other_group: {
        block: true,
        group: "",
        schedule: []
      }
    }
  }, (err) => {
    if(err) {
      console.log("Could not clear other group data");
      let response = {
        "text": "Úi, tớ không kết nối với database được. Bạn hãy thử lại sau nha T.T"
      };
      sendResponse(sender_psid, response);
    }
    else console.log("clear other group data successfully");
  });
}

async function updateData(client, userData, groupInput, other_group_block) {
  await client.db(dbName).collection('schedule').findOne({ group: groupInput }, (err, scheduleData) => { // find schedule of groupInput
    if (err) {
      console.error("Could not update other group data: \n" + err);
      const response = {
        "text": "Úi, tớ không kết nối với database được. Bạn hãy thử lại sau nha T.T"
      };
      sendResponse(userData.sender_psid, response);
    }
    else {
      let update = userDataUnblockSchema(userData);
      update.search_schedule_block = true;
      if(other_group_block) {
        update.search_schedule_block = true;
        update.search_schedule_other_group.block = true;
        update.search_schedule_other_group.group = groupInput;
        update.search_schedule_other_group.schedule = scheduleData.schedule;
      }
      else {
        update.search_schedule_block = true;
        update.main_schedule = scheduleData.schedule;
      }
      const date = new Date();
      date.setHours(date.getHours() + 7); // deploy at US
      update.schedule_updated_time = date.getTime();
      client.db(dbName).collection('users-data').updateOne({ sender_psid: userData.sender_psid }, {
        $set: update
      }, (err) => {
        if (err) {
          console.error("Could not update other group data: \n" + err);
          const response = {
            "text": "Úi, tớ không kết nối với database được. Bạn hãy thử lại sau nha T.T"
          };
          sendResponse(userData.sender_psid, response);
        } else {
          console.log("Update other group data successfully!");
          let response = textResponse.askDay;
          response.quick_replies[0].title = "Tra lớp khác";
          response.quick_replies[0].payload = "overwriteClass";
          response.text = `Cập nhật thời khoá biểu lớp ${groupInput} thành công!\nBạn muốn tra thứ mấy?`;
          sendResponse(userData.sender_psid, response);
        }
      });
    }
  });
}

function sendSchedule(dayInput, userData, client, updated_time) {
  let response = textResponse.askDay;
  response.quick_replies[0].title = "Tra lớp khác";
  response.quick_replies[0].payload = "overwriteClass";
  let day = handleDayInput(dayInput);
  // Check if we are in search_schedule_other_group block or not, and send the suitable data
  let schedule = (userData.search_schedule_other_group.block)
  ? userData.search_schedule_other_group.schedule
  : userData.main_schedule;
  if(day === "Tất cả") {
    let text = "Lịch học tuần này: ";
    let subText = "";
    schedule.forEach((data) => {
      text += `
Thứ ${data.day}:
 - Sáng: `;
      data.morning.forEach((Class, i) => {
        if(Class.subject !== "")
        subText += `
   + Tiết ${i + 1}: ${Class.subject} - ${Class.teacher}`;
      });
    //    ------------------------
    if(!subText) text += "Nghỉ";
    else text += subText;
    subText = "";
    text += `
 - Chiều: `;
      //
      if(data.afternoon) {
        data.afternoon.forEach((Class, i) => {
          if(Class.subject !== "")
          subText += `
     + Tiết ${i + 1}: ${Class.subject} - ${Class.teacher}`;
        });
      }
      if(!subText) text += "Nghỉ";
      else text += subText;
      subText = "";
      text += `\n`;
    });
    text += "\nHọc tập hẳn hoi không là bị véo tai suốt ngày như tôi đấy :(\n-----------\nNgày cập nhật thời khoá biểu: ";
    text += convertTimestamp(updated_time ? updated_time : "Not found");
    response.text = text;
    sendResponse(userData.sender_psid, response);
  }
  else if(!isNaN(day)){
    if(day == 8) {
      response.text = "Chủ nhật mà vẫn muốn tìm thời khoá biểu để học ư 🥺";
      sendResponse(userData.sender_psid, response);
    }
    else if(day - 1 > schedule.length || day - 2 < 0) {
      response.text = `Đừng nhắn gì ngoài phần gợi ý bên dưới nhé :(`;
      sendResponse(userData.sender_psid, response);
    }
    else {
      const data = schedule[day - 2];
      let subText = "";
      let text = `Lịch học thứ ${day}:
 - Sáng: `;
      data.morning.forEach((Class, i) => {
        if(Class.subject !== "")
        subText += `
   + Tiết ${i + 1}: ${Class.subject} - ${Class.teacher}`;
      });
      //    ------------------------
      if(!subText) text += "Nghỉ";
      else text += subText;
      text += `
 - Chiều: `;
      //
      subText = "";
      if(data.afternoon) {
        data.afternoon.forEach((Class, i) => {
          if(Class.subject !== "")
          subText += `
     + Tiết ${i + 1}: ${Class.subject} - ${Class.teacher}`;
        });
      }
      if(!subText) text += "Nghỉ";
      else text += subText;
      text += "\n\nĐừng có ngủ gật trong giờ nhé 🥱\n-----------\nNgày cập nhật thời khoá biểu: ";
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
