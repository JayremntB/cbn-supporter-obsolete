'use strict'
const sendResponse = require('../general/sendResponse');
const textResponse = require('../general/textResponse');
const { checkTeacherName, handleDayInput, handleTeacherName, convertTimestamp } = require('../general/validate-input');
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
      let teacherFind = userData.search_classes_other_teacher.block
      ? userData.search_classes_other_teacher.teacher
      : userData.teacher;
      if(!userData.teacher && !userData.search_classes_other_teacher.teacher) {
        if(!checkTeacherName(userData.sender_psid, text)) return;
        else teacherFind = text;
      }
      updateData(client, userData, teacherFind, userData.search_classes_other_teacher.block);
    }
    else {
      if(text.toLowerCase() === "tra giáo viên khác") {
        const response = textResponse.searchClassesAskTeacher;
        clearOtherTeacherData(client, userData.sender_psid);
        sendResponse(userData.sender_psid, response);
      }
      else if(!userData.search_classes_other_teacher.block) {
        sendClasses(text, userData, client, data.updated_time);
      }
      else if(userData.search_classes_other_teacher.teacher) {
        sendClasses(text, userData, client, data.updated_time);
      }
      else if(checkTeacherName(userData.sender_psid, handleTeacherName(text))) {
        updateData(client, userData, handleTeacherName(text), userData.search_classes_other_teacher.block);
      }
    }
  });
}

function init(client, userData) {
  if(userData.teacher) { // init search_classes_block
    updateData(client, userData, userData.teacher, userData.search_classes_other_teacher.block);
  }
  else { // init both search_classes_block & search_classes_other_teacher block
    let update = userDataUnblockSchema(userData);
    update.search_classes_block = true;
    update.search_classes_other_teacher.block = true;
    update.search_classes_other_teacher.teacher = "";
    update.search_classes_other_teacher.teaches = [];
    client.db(dbName).collection('users-data').updateOne({ sender_psid: userData.sender_psid }, {
      $set: update
    }, (err) => {
      if(err) {
        console.log("could not init search_classes_other_teacher block");
        const response = {
          "text": "Úi, tớ không kết nối với database được. Bạn hãy thử lại sau nha T.T"
        };
        sendResponse(userData.sender_psid, response);
      }
      else {
        console.log('init search search_classes_other_teacher successfully');
        const response = textResponse.searchClassesAskTeacher;
        sendResponse(userData.sender_psid, response);
      }
    });
  }
}

function clearOtherTeacherData(client, sender_psid) {
  client.db(dbName).collection('users-data').updateOne({ sender_psid: sender_psid }, {
    $set: {
      search_classes_other_teacher: {
        block: true,
        teacher: "",
        teaches: []
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
    else console.log("Clear other_teacher data successfully");
  });
}

async function updateData(client, userData, teacherName, other_teacher_block) {
  await client.db(dbName).collection('schedule').find({
    $or: [
      { "schedule.morning.teacher": teacherName },
      { "schedule.afternoon.teacher": teacherName }
    ]
  }).toArray((err, docs) => {
    console.log(docs);
    if (err) {
      console.error("Could not update other teacher data: \n" + err);
      const response = {
        "text": "Úi, tớ không kết nối với database được. Bạn hãy thử lại sau nha T.T"
      };
      sendResponse(userData.sender_psid, response);
    }
    else {
      let teaches = [];
      for(let i = 0; i < 6; i ++) { // loop days
        teaches.push({
          "morning": [],
          "afternoon": []
        });
        for(let j = 0; j < 5; j ++) { // loop classes
          // loop groups
          docs.forEach((doc) => {
            if(doc.schedule[i].morning && doc.schedule[i].morning[j] && doc.schedule[i].morning[j].teacher === teacherName){
              teaches[i].morning.push({
                class: j + 1,
                group: doc.group
              });
              return; // If found, immediately return cause teacher teaches one class per group
            }
          });
          docs.forEach((doc) => {
            if(doc.schedule[i].afternoon && doc.schedule[i].afternoon[j] && doc.schedule[i].afternoon[j].teacher === teacherName){
              teaches[i].afternoon.push({
                class: j + 1,
                group: doc.group
              });
              return;
            }
          });
        }
      }
      //
      let update = userDataUnblockSchema(userData);
      if(other_teacher_block) {
        update.search_classes_block = true;
        update.search_classes_other_teacher.block = true;
        update.search_classes_other_teacher.teacher = teacherName;
        update.search_classes_other_teacher.teaches = teaches;
      }
      else {
        update.search_classes_block = true;
        update.main_teach_schedule = teaches;
      }
      const date = new Date();
      date.setHours(date.getHours() + 7); // deploy at US
      update.schedule_updated_time = date.getTime();
      client.db(dbName).collection('users-data').updateOne({ sender_psid: userData.sender_psid }, {
        $set: update
      }, (err) => {
        if (err) {
          console.log("Could not update teacher data: " + err);
          const response = {
            "text": "Úi, tớ không kết nối với database được. Bạn hãy thử lại sau nha T.T"
          };
          sendResponse(userData.sender_psid, response);
        } else {
          console.log("Update teacher data successfully");
          let response = textResponse.askDay;
          response.quick_replies[0].title = "Tra giáo viên khác";
          response.quick_replies[0].payload = "overwriteTeacher";
          response.text = `Cập nhật lịch dạy của giáo viên ${teacherName} thành công!\nBạn muốn tra thứ mấy?`;
          sendResponse(userData.sender_psid, response);
        }
      });
    }
  });
}

function sendClasses(dayInput, userData, client, updated_time) {
  let response = textResponse.askDay;
  response.quick_replies[0].title = "Tra giáo viên khác";
  response.quick_replies[0].payload = "overwriteTeacher";
  let day = handleDayInput(dayInput.toLowerCase());
  // Check if we are in search_schedule_other_group block or not, and send the suitable data
  let teaches = userData.search_classes_other_teacher.block
  ? userData.search_classes_other_teacher.teaches
  : userData.main_teach_schedule;
  if(day === "Tất cả") {
    let text = `Lịch dạy tuần này: `;
    teaches.forEach((data, days) => {
      text += `
Thứ ${days + 2}:
 - Sáng: `;
      if(data.morning.length === 0) text += "Trống";
      else {
        data.morning.forEach((subdata) => {
          text += `
   + Tiết ${subdata.class}: ${subdata.group}`;
        });
      }
      //    ------------------------
      text += `
 - Chiều: `;
      //
      if(data.afternoon.length === 0) text += "Trống";
      else {
        data.afternoon.forEach((subdata) => {
          text += `
   + Tiết ${subdata.class}: ${subdata.group}`;
        });
      }
      //    ------------------------
    });
    text += "\n-----------\nNgày cập nhật thời khoá biểu: ";
    text += convertTimestamp(updated_time ? updated_time : "Not found");
    response.text = text;
    sendResponse(userData.sender_psid, response);
  }
  else if(!isNaN(day)){
    if(day == 8) {
      response.text = "Chủ nhật thì ai chẳng ở nhà bận yêu gia đình :3";
      sendResponse(userData.sender_psid, response);
    }
    else if(day - 1 > teaches.length || day - 2 < 0) {
      response.text = `Eee, đừng nhắn gì ngoài phần gợi ý bên dưới nhé 😑`;
      sendResponse(userData.sender_psid, response);
    }
    else {
      const data = teaches[day - 2];
      let text = `Lịch dạy thứ ${day}:
 - Sáng: `;
      if(data.morning.length === 0) text += "Trống";
      else {
        data.morning.forEach((subdata) => {
          text += `
   + Tiết ${subdata.class}: ${subdata.group}`;
        });
      }
      //    ------------------------
      text += `
 - Chiều: `;
      //
      if(data.afternoon.length === 0) text += "Trống";
      else {
        data.afternoon.forEach((subdata) => {
          text += `
   + Tiết ${subdata.class}: ${subdata.group}`;
        });
      }
      text += "\n-----------\nNgày cập nhật thời khoá biểu: ";
      text += convertTimestamp(updated_time ? updated_time : "Not found");
      response.text = text;
      sendResponse(userData.sender_psid, response);
    }
  }
  else {
    response.text = `Eee, đừng nhắn gì ngoài phần gợi ý bên dưới nhé 😑`;
    sendResponse(userData.sender_psid, response);
  }
}
