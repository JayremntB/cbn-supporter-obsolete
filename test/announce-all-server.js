const { MongoClient } = require('mongodb');
const sendResponse = require('../src/general/sendResponse');
// const connectionUrl = "mongodb://127.0.0.1:27017"
const connectionUrl = process.env.DATABASE_URI;
const dbName = "database-for-cbner";
MongoClient.connect(connectionUrl, { useNewUrlParser: true, useUnifiedTopology: true }, async (err, client) => {
  if(err) {
    return console.log('Failed to connect to database');
  }
  console.log("Connect successfully");
  const users = await client.db(dbName).collection('users-data').find({}).toArray();
  let userIndex = 0;
  const response = {
      "text": "Năm học sắp hết, cũng là lúc sắp đến hồi kết của tiếng chuông đã thành một biểu tượng...\nNhưng tính năng CHAT ẨN DANH thì không bao giờ đến hồi kết đâu nha 🐧\nMong tất cả các sĩ tử 2k2 cùng bước lên chiếc chảo lửa khổng lồ, sống sót với bàn tay ứa máu cầm những chiếc bút đã đi trọn vẹn một thanh xuân và mảnh giấy thông báo đỗ NV1 nhé!\nHẹn gặp lại mọi người vào năm học kế tiếp <3",
      "quick_replies": [
        {
          "content_type": "text",
          "title": "Menu",
          "payload": "menu",
          "image_url": ""
        }
      ]
  };
  setTimeout(function nextUser() {
      if(userIndex > users.length - 1) console.log("End of users");
      sendResponse(users[userIndex ++].sender_psid, response);
      console.log(`Announce ${users[userIndex].sender_psid} - index: ${userIndex}!`);
      setTimeout(nextUser, 500);
  }, 0);
});
