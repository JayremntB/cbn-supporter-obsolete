(async function () {
	'use strict'
// node_modules
	const express = require('express');
	const bodyParser = require('body-parser');
	const request = require('request');
	const {MongoClient} = require('mongodb');
// features
	const getStarted = require('./src/utils/get-started');
	const setting = require('./src/utils/setting');
	const estimateWakeUpTime = require('./src/utils/estimate-wake-up-time');
	const estimateSleepTime = require('./src/utils/estimate-sleep-time');
	const searchSchedule = require('./src/utils/search-schedule');
	const searchClasses = require('./src/utils/search-classes');
	const searchGroupsTaught = require('./src/utils/search-groups-taught');
	const findGroupsWithClassesCondition = require('./src/utils/find-groups-have-4-or-5-classes');
	const findImages = require('./src/utils/find-images');
	const liveChat = require('./src/utils/live-chat');
	const chatRoom = require('./src/utils/chat-room');
	const checkCovid = require('./src/utils/check-covid');
	const simsimi = require('./src/utils/simsimi');
// general
	const sendResponse = require('./src/general/sendResponse');
	const textResponse = require('./src/general/textResponse');
	const templateResponse = require('./src/general/templateResponse');
	const port = (process.env.PORT) || 5000;
	const app = express().use(bodyParser.json());
// prepare
	app.listen(port, () => {
		console.log('webhook is listening on port ' + port);
	});
	const {userDataUnblockSchema, userDataFrame} = require('./src/general/template');
	const connectionUrl = process.env.DATABASE_URI;
// const connectionUrl = "mongodb://127.0.0.1:27017";
	const dbName = 'database-for-cbner';
	const listSingleWordCommands = ['dạy', 'simvi', 'simen', 'timanh', 'doianh', 'doiten', 'chattong', 'chatnn', 'timphong', 'taophong', 'nhapid', 'phongcu', '4tiet', '5tiet', 'menu', 'hd', 'help', 'ngủ', 'dậy', 'lop', 'xemlop', 'xoalop', 'gv', 'xemgv', 'xoagv', 'wd', 'xemwd', 'xoawd'];
	const listNonSingleWordCommands = ['danh sách lớp', 'dsl', 'đặt lớp mặc định', 'đặt gv mặc định', 'đổi thời gian tb'];
	const userInputSearchScheduleKey = ["thời khoá biểu", "thời khoá", "thoi khoa bieu", "tkb"];
	const userInputSearchClassesKey = ["lịch dạy", "lich day", 'giáo viên', 'giao vien'];
	const userInputChatRoomKey = ["ẩn danh", "an danh", "tìm bạn", "chat nhóm", "người lạ", "nguoi la"];
	const userInputCheckCovidKey = ["covid", "covi"];
// connect to database
	const client = await MongoClient.connect(connectionUrl, {useNewUrlParser: true, useUnifiedTopology: true});
// 
	app.get('/', (req, res) => {
		res.send("ok");
	});

	app.get('/webhook', (req, res) => {
		let mode = req.query['hub.mode'];
		let challenge = req.query['hub.challenge'];
		let token = req.query['hub.verify_token'];

		if (mode && token) {
			if (mode === 'subscribe' && token === process.env.VERIFY_TOKEN) {
				console.log('WEBHOOK_VERIFIED');
				res.status(200).send(challenge);
			}
			else {
				res.send("Wrong token");
			}
		}
	});

// Received messages
	app.post('/webhook', (req, res) => {
		let body = req.body;
		if (body.object === 'page') {
			body.entry.forEach((entry) => {
				// Get "body" of webhook event
				let webhook_event = entry.messaging[0];
				console.log("RECEIVED  A  MESSAGE");
				// Get the sender PSID
				let sender_psid = webhook_event.sender.id;
				console.log(sender_psid);
				// check if the webhook_event is a normal message or a Postback message
				let userData = client.db(dbName).collection('users-data').findOne({sender_psid: sender_psid}, async (err, userData) => {
					if (!userData) userData = await initUserData(sender_psid);
					if (webhook_event.message) {
						handleMessage(webhook_event.message, userData);
					}
					else if (webhook_event.postback) {
						handlePostback(webhook_event.postback, userData);
					}
				});
			});
			res.status(200).send('EVENT_RECEIVED');
		}
		else {
			res.sendStatus(404);
		}
	});

	function handleMessage(received_message, userData) {
		let response = {
			"text": ""
		};
		if (received_message.text) {
			const defaultText = received_message.text;
			let text = received_message.text.toLowerCase();
			// check if have keyword for search schedule/classes
			let
				keySearchSchedule = false,
				keySearchClasses = false,
				keyChatRoom = false,
				keyCheckCovid = false;
			userInputSearchScheduleKey.forEach((input) => {
				if (text.includes(input)) {
					keySearchSchedule = true;
					return;
				}
			});
			userInputSearchClassesKey.forEach((input) => {
				if (text.includes(input)) {
					keySearchClasses = true;
					return;
				}
			});
			const textSplit = defaultText.split(" ");
			textSplit[0] = textSplit[0].toLowerCase();
			userInputChatRoomKey.forEach((input) => {
				if (text.includes(input)) {
					keyChatRoom = true;
					return;
				}
			});
			userInputCheckCovidKey.forEach((input) => {
				if (text.includes(input)) {
					keyCheckCovid = true;
					return;
				}
			});
			console.log("message: " + text + "\n--------------------------------");
			//
			if (userData.room_chatting.has_joined) {
				if (text === 'exit') chatRoom.leaveRoom(client, userData);
				else if (text === 'menu') response = templateResponse.roomChattingMenu;
				else chatRoom.handleMessage(client, defaultText, userData);
			}
			else if (text === 'exit') {
				if (userData.live_chat) liveChat.endLiveChat(client, userData);
				unblockAll(userData);
				response = textResponse.exitResponse;
			}
			else if (listNonSingleWordCommands.includes(text)) {
				if (userData.live_chat) {
					liveChat.deniedUsingOtherFeatures(userData);
				}
				else {
					switch (text) {
						case 'danh sách lớp':
						case 'dsl':
							response = textResponse.groupList;
							break;
						case 'đặt lớp mặc định':
							unblockAll(userData);
							response = textResponse.recommendedSetGroup;
							break;
						case 'đặt gv mặc định':
							unblockAll(userData);
							response = textResponse.recommendedSetTeacher;
							break;
						case 'đổi thời gian tb':
							unblockAll(userData);
							response = textResponse.recommendedSetWindDown;
							break;
					}
				}
			}
			else if (listSingleWordCommands.includes(textSplit[0])) {
				if (userData.live_chat) {
					liveChat.deniedUsingOtherFeatures(userData);
				}
				else {
					switch (textSplit[0]) {
						case 'dạy':
							searchClasses.init(client, userData);
							break;
						case 'simvi':
							simsimi.changeLang(client, userData, 'vi');
							break;
						case 'simen':
							simsimi.changeLang(client, userData, 'en');
							break;
						case 'timanh':
							findImages.init(client, userData);
							break;
						case 'chattong':
							chatRoom.joinGeneralRoom(client, userData);
							break;
						case 'chatnn':
							chatRoom.joinRandomRoom(client, userData);
							break;
						case 'timphong':
							response = chatRoom.joinSubRoom(client, userData);
							break;
						case 'taophong':
							chatRoom.createSubRoom(client, userData);
							break;
						case 'nhapid':
							chatRoom.selectRoom(client, userData);
							break;
						case 'phongcu':
							chatRoom.joinPreRoom(client, userData);
							break;
						case 'doiten':
							chatRoom.settingName(client, userData);
							break;
						case 'doianh':
							chatRoom.settingAvatar(client, userData);
							break;
						case '4tiet':
							response = findGroupsWithClassesCondition(client, userData);
							break;
						case '5tiet':
							response = findGroupsWithClassesCondition(client, userData);
							break;
						case 'menu':
							unblockAll(userData);
							response = templateResponse.menu;
							break;
						case 'help':
							liveChat.startLiveChat(client, userData);
							break;
						case 'hd':
							unblockAll(userData);
							response = textResponse.defaultResponse;
							response.text = "https://github.com/JayremntB/CBN-Supporter-How-to-use/blob/master/README.md";
							break;
						case 'lop':
						case 'xemlop':
						case 'xoalop':
							setting.handleSetGroupMessage(client, textSplit, userData);
							break;
						case 'gv':
						case 'xemgv':
						case 'xoagv':
							setting.handleSetTeacherMessage(client, textSplit, userData, defaultText);
							break;
						case 'wd':
						case 'xemwd':
						case 'xoawd':
							setting.handleWindDownMessage(client, textSplit, userData);
							break;
						case 'tkb':
							searchSchedule.init(client, userData);
							break;
						case 'dậy':
							unblockAll(userData);
							estimateSleepTime(textSplit, userData);
							break;
						case 'ngủ':
							unblockAll(userData);
							estimateWakeUpTime(textSplit, userData);
							break;
					}
				}
			}
			else if (userData.search_schedule_block) {
				searchSchedule.handleMessage(client, text, userData);
			}
			else if (userData.search_classes_block) {
				searchClasses.handleMessage(client, defaultText, userData);
			}
			else if (userData.search_groups_taught.block) {
				searchGroupsTaught.handleMessage(client, defaultText, userData);
			}
			else if (userData.find_images.block) {
				findImages.handleMessage(client, text, userData);
			}
			else if (userData.room_chatting.block) {
				chatRoom.handleMessage(client, defaultText, userData);
			}
			else if (!userData.live_chat) {
				if (keySearchSchedule) {
					searchSchedule.init(client, userData);
				}
				else if (keySearchClasses) {
					searchClasses.init(client, userData);
				}
				else if (keyChatRoom) {
					unblockAll(userData);
					response = templateResponse.chatRoom;
				}
				else if (keyCheckCovid) {
					unblockAll(userData);
					checkCovid(userData.sender_psid);
				}
				else simsimi.response(userData, defaultText);
			}
			else sendMessageToAuthor(userData, defaultText);
		}
		else if (received_message.attachments) {
			// Gets the URL of the message attachment
			let attachment_url = received_message.attachments[0].payload.url;
			chatRoom.handleMessage(client, "", userData, attachment_url);
		}
		sendResponse(userData.sender_psid, response);
		// author action
		if (userData.sender_psid === "3785286158180365") {
			const sendUser = received_message.text.split(" ")[0];
			response.text = received_message.text.substring(sendUser.length, received_message.text.length);
			sendResponse(sendUser, response);
		}
	}

	function handlePostback(received_postback, userData) {
		// Get the payload of receive postback
		let payload = received_postback.payload;
		let response = {
			"text": ""
		};
		console.log('postback: ' + payload + "\n---------------------------------");
		//
		if (userData.room_chatting.has_joined && userData.room_chatting.block) {
			switch (payload) {
				case 'menu':
					response = templateResponse.roomChattingMenu;
					break;
				case 'leaveRoom':
					chatRoom.leaveRoom(client, userData);
					break;
				case 'roomInfo':
					chatRoom.roomInfo(client, userData);
					break;
				case 'userInfo':
					chatRoom.userInfo(userData);
					break;
				case 'settingProfile':
					const response1 = {
						"text": "Đã thoát phòng để bảo vệ quyền riêng tư :<"
					};
					sendResponse(userData.sender_psid, response1);
					chatRoom.leaveRoom(client, userData);
					response = templateResponse.chatRoomSetting;
					break;
				case 'chatbotInformation':
					response = templateResponse.chatbotInformationResponse;
					break;
				default:
					response = templateResponse.exitTemplate;
					response.attachment.payload.text = 'Thoát phòng để sử dụng các tính năng...'
			}
		}
		else if (userData.live_chat) {
			liveChat.deniedUsingOtherFeatures(userData);
		}
		else {
			switch (payload) {
				case 'getStarted':
					getStarted(userData.sender_psid);
					break;
				// Menu possess
				case 'menu':
					unblockAll(userData);
					response = templateResponse.menu;
					break;
				//
				case 'roomInfo':
				case 'leaveRoom':
					unblockAll(userData);
					response.text = "Bạn hiện không ở trong phòng nào...";
					break;
				case 'userInfo':
					unblockAll(userData);
					chatRoom.userInfo(userData);
					break;
				case 'searchSchedule':
					searchSchedule.init(client, userData);
					break;
				case 'searchClasses':
					searchClasses.init(client, userData);
					break;
				case 'searchGroupsTaught':
					searchGroupsTaught.init(client, userData);
					break;
				case 'findGroupsWithClassesCondition':
					response = findGroupsWithClassesCondition(client, userData);
					break;
				case 'findGroupsWithClassesConditionFullWeek':
					response = findGroupsWithClassesCondition(client, userData, false);
					break;
				case 'findImages':
					findImages.init(client, userData);
					break;
				//
				case 'otherFeatures':
					unblockAll(userData);
					response = templateResponse.otherFeatures;
					break;
				// chatRoom
				case 'chatRoom':
					unblockAll(userData);
					response = templateResponse.chatRoom;
					break;
				//
				case 'generalRoom':
					chatRoom.joinGeneralRoom(client, userData);
					break;
				case 'subRoom':
					response = chatRoom.joinSubRoom(client, userData);
					break;
				case 'createSubRoom':
					chatRoom.createSubRoom(client, userData);
					break;
				case 'randomSubRoom':
					chatRoom.joinRandomRoom(client, userData);
					break;
				case 'joinPreRoom':
					chatRoom.joinPreRoom(client, userData);
					break;
				case 'selectRoom':
					chatRoom.selectRoom(client, userData);
					break;
				case 'chatRoomOtherOptions':
					response = templateResponse.chatRoomOtherOptions;
					break;
				//
				case 'chatRoomSetting':
					response = templateResponse.chatRoomSetting;
					break;
				case 'settingProfile':
					unblockAll(userData);
					response = templateResponse.chatRoomSetting;
					break;
				//
				case 'settingName':
					chatRoom.settingName(client, userData);
					break;
				case 'settingAvatar':
					chatRoom.settingAvatar(client, userData);
					break;
				case 'ChatRoomChangeToRealInfor':
					chatRoom.changeToRealInfor(client, userData);
					break;
				case 'ChatRoomChangeInforToDefault':
					chatRoom.changeInforToDefault(client, userData);
					break;
				case 'countSleepTime':
					unblockAll(userData);
					response = textResponse.countSleepTimeResponse;
					break;
				case 'checkCovid':
					checkCovid(userData.sender_psid);
					break;
				// Information and help possess
				case 'chatbotInformation':
					response = templateResponse.chatbotInformationResponse;
					break;
				case 'help':
					liveChat.startLiveChat(client, userData);
					break;
				// SimSimi setting
				case 'SimSimiSetting':
					response.text = "Nhập simvi/simen để chuyển ngôn ngữ sang tiếng Việt/tiếng Anh.\nĐể nói chuyện với Sim, cứ nhắn tin bình thường nhé!";
					// response.text = "SimSimi hiện đang dừng hoạt động, vui lòng thử lại sau..."
					break;
			}
		}
		sendResponse(userData.sender_psid, response);
	}

	function initUserData(sender_psid) {
		request({
			"uri": `https://graph.facebook.com/${sender_psid}`,
			// "qs": { "access_token": process.env.TEST_PAGE_ACCESS_TOKEN },
			"qs": {
				"access_token": process.env.PAGE_ACCESS_TOKEN,
				"fields": "name,profile_pic"
			},
			"method": "GET"
		}, (err, res, body) => {
			body = JSON.parse(body);
			client.db(dbName).collection('users-data').insertOne(userDataFrame(sender_psid, body.name));
		});
		return userDataFrame(sender_psid);
	}

	function unblockAll(userData) {
		client.db(dbName).collection('users-data').updateOne({sender_psid: userData.sender_psid}, {
			$set: userDataUnblockSchema(userData)
		});
	}

	function sendMessageToAuthor(userData, message) {
		request({
			"uri": `https://graph.facebook.com/${userData.sender_psid}`,
			"qs": {
				"fields": "name",
				"access_token": process.env.PAGE_ACCESS_TOKEN
			},
			"method": "GET"
		}, (err, res, body) => {
			if (err) {
				console.error("Unable to send message:" + err);
			}
			else {
				let userName = JSON.parse(body);
				const response = {
					"text": `User: ${userName.name}\nID: ${userData.sender_psid}\nMessage: ${message}\nNeed to support: ${userData.live_chat}`
				};
				sendResponse("3785286158180365", response);
			}
		});
	}
})();