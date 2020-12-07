const { MongoClient } = require('mongodb');
const sendResponse = require('../general/sendResponse');
// const connectionUrl = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0-obtbe.mongodb.net/test`;
// const connectionUrl = "mongodb://127.0.0.1:27017";

const connectionUrl = process.env.DATABASE_URI;
const dbName = "database-for-cbner";
const response = {
  'text': 'Thông báo: do lệnh rời phòng hiện đang gặp lỗi, người rời được người không nên có thể bạn vẫn sẽ nhận được tin nhắn từ các phòng trước, hoặc số lượng người trong phòng của bạn đang là con số ảo. Lỗi này đang trong quá trình fix, bạn có thể tắt thông báo tạm thời để không bị làm phiền bởi tin nhắn của những phòng đã thoát nhé!'
};

MongoClient.connect(connectionUrl, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
  if(err) {
    return console.log('Failed to connect to database');
  }
  console.log("Connect successfully");
  client.db(dbName).collection('room-chatting').find({
    "list_users.0": {
      $exists: true
    }
  }).toArray((err, rooms) => {
    // console.log(rooms);
		let listPSID = [];
    rooms.forEach((room) => {
      room.list_users.forEach((user_psid) => {
				if(!listPSID.includes(user_psid)) listPSID.push(user_psid);
			});
    });
    listPSID.forEach((user_psid) => {
			sendResponse(user_psid, response);
    });
    console.log("successfully send message to all server");
  });
  // client.db(dbName).collection('users-data').find({}).toArray((err, usersData) => {
  //   usersData.forEach((userData) => {
  //     sendResponse(userData.sender_psid, response);
  //   });
  //   console.log("successfully send message to all server");
  // });
});
