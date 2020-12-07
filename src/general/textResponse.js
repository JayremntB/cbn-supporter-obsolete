// This file is just for structure TEXT responses, and just like JSON file

module.exports = {
  "defaultResponse": {
    "text": "",
    "quick_replies": [
      {
        "content_type": "text",
        "title": "Menu",
        "payload": "menu",
        "image_url": ""
      }
    ]
  },
  "exitResponse": {
    "text": "(!) Thoát thành công! Trở lại với Jay :3",
    "quick_replies": [
      {
        "content_type": "text",
        "title": "Menu",
        "payload": "menu",
        "image_url": ""
      }
    ]
  },
  "liveChatExitResponse": {
    "text": "Không muốn tiếp tục trò chuyện nữa thì nhập Exit nha 🐧",
    "quick_replies": [
      {
        "content_type": "text",
        "title": "Exit",
        "payload": "exit",
        "image_url": ""
      }
    ]
  },
  "subRoomResponse": {
    "text": "",
    "quick_replies": [
      {
        "content_type": "text",
        "title": "2 người",
        "payload": "menu",
        "image_url": ""
      },
      {
        "content_type": "text",
        "title": "3 người",
        "payload": "menu",
        "image_url": ""
      },
      {
        "content_type": "text",
        "title": "4 người",
        "payload": "menu",
        "image_url": ""
      },
      {
        "content_type": "text",
        "title": "Exit",
        "payload": "exit",
        "image_url": ""
      }
    ]
  },
  "countSleepTimeResponse": {
    "text": `- Nhập ngủ + thời điểm ngủ để xác định thời điểm nên thức dậy.
VÍ DỤ: ngủ 21h30
(Nếu bạn bỏ trống thời điểm ngủ, tớ sẽ lấy thời điểm hiện tại)

- Nhập dậy + thời điểm dậy để xác định thời điểm nên ngủ.
VÍ DỤ: dậy 6h15
(Nếu bạn bỏ trống thời điểm dậy, tớ sẽ lấy mặc định 6h)`
  },
  "recommendedSetGroup": {
    "text": "Để mỗi lần sử dụng tính năng tra thời khoá biểu bạn không phải mất công ghi lại tên lớp nhiều lần nếu phải tra lớp đó thường xuyên (lớp bạn chẳng hạn), nhập lop + tên lớp.\nVí dụ: lop 12ti",
    "quick_replies": [
      {
        "content_type": "text",
        "title": "Danh sách lớp",
        "payload": "groupsList",
        "image_url": ""
      },
      {
        "content_type": "text",
        "title": "xemlop",
        "payload": "xemlop",
        "image_url": ""
      },
      {
        "content_type": "text",
        "title": "xoalop",
        "payload": "xoalop",
        "image_url": ""
      }
    ]
  },
  "recommendedSetTeacher": {
    "text": "Để mỗi lần sử dụng tính năng tra tiết dạy (tìm giáo viên) bạn không phải mất công ghi lại tên giáo viên nhiều lần nếu phải tra lịch dạy của giáo viên đó thường xuyên, nhập gv + tên giáo viên.\nVí dụ: gv NH.Khánh",
    "quick_replies": [
      {
        "content_type": "text",
        "title": "xemgv",
        "payload": "xemgv",
        "image_url": ""
      },
      {
        "content_type": "text",
        "title": "xoagv",
        "payload": "xoagv",
        "image_url": ""
      }
    ]
  },
  "recommendedSetWindDown": {
    "text": "Trung bình một người thường mất 14' để chìm vào giấc ngủ. Để thuận tiện hơn trong việc xác định thời điểm dậy (ngủ) dựa trên thời gian trung bình để chìm vào giấc ngủ của bạn khi sử dụng các tính năng Tính giờ dậy và Tính giờ ngủ, nhập wd + thời gian (tính theo phút)\nVí dụ: wd 480",
    "quick_replies": [
      {
        "content_type": "text",
        "title": "xemwd",
        "payload": "xemwd",
        "image_url": ""
      },
      {
        "content_type": "text",
        "title": "xoawd",
        "payload": "xoawd",
        "image_url": ""
      }
    ]
  },
  "lopResponse": {
    "text": "",
    "quick_replies": [
      {
        "content_type": "text",
        "title": "tkb",
        "payload": "tkb",
        "image_url": ""
      },
      {
        "content_type": "text",
        "title": "xemlop",
        "payload": "xemlop",
        "image_url": ""
      },
      {
        "content_type": "text",
        "title": "xoalop",
        "payload": "xoalop",
        "image_url": ""
      },
      {
        "content_type": "text",
        "title": "Menu",
        "payload": "menu",
        "image_url": ""
      }
    ]
  },
  "gvResponse": {
    "text": "",
    "quick_replies": [
      {
        "content_type": "text",
        "title": "xemgv",
        "payload": "xemgv",
        "image_url": ""
      },
      {
        "content_type": "text",
        "title": "xoagv",
        "payload": "xoagv",
        "image_url": ""
      },
      {
        "content_type": "text",
        "title": "Menu",
        "payload": "menu",
        "image_url": ""
      }
    ]
  },
  "wdResponse": {
    "text": "",
    "quick_replies": [
      {
        "content_type": "text",
        "title": "xemwd",
        "payload": "xemwd",
        "image_url": ""
      },
      {
        "content_type": "text",
        "title": "xoawd",
        "payload": "xoawd",
        "image_url": ""
      },
      {
        "content_type": "text",
        "title": "Menu",
        "payload": "menu",
        "image_url": ""
      }
    ]
  },
  "xemlopResponse": {
    "text": "",
    "quick_replies": [
      {
        "content_type": "text",
        "title": "tkb",
        "payload": "tkb",
        "image_url": ""
      },
      {
        "content_type": "text",
        "title": "xoalop",
        "payload": "xoalop",
        "image_url": ""
      },
      {
        "content_type": "text",
        "title": "Menu",
        "payload": "menu",
        "image_url": ""
      }
    ]
  },
  "xemgvResponse": {
    "text": "",
    "quick_replies": [
      {
        "content_type": "text",
        "title": "xoagv",
        "payload": "xoagv",
        "image_url": ""
      },
      {
        "content_type": "text",
        "title": "Menu",
        "payload": "menu",
        "image_url": ""
      }
    ]
  },
  "xemwdResponse": {
    "text": "",
    "quick_replies": [
      {
        "content_type": "text",
        "title": "xoawd",
        "payload": "xoawd",
        "image_url": ""
      },
      {
        "content_type": "text",
        "title": "Menu",
        "payload": "menu",
        "image_url": ""
      }
    ]
  },
  "searchScheduleAskGroup": {
    "text": "Bạn tìm lớp nào? \n(Ví dụ: 12ti, ...)",
    "quick_replies": [
      {
        "content_type": "text",
        "title": "Danh sách lớp",
        "payload": "groupsList",
        "image_url": ""
      },
      {
        "content_type": "text",
        "title": "Đặt lớp mặc định",
        "payload": "lop",
        "image_url": ""
      },
      {
        "content_type": "text",
        "title": "Exit",
        "payload": "exit",
        "image_url": ""
      }
    ]
  },
  "searchClassesAskTeacher": {
    "text": "Tên của giáo viên bạn tìm?\nVí dụ: NT.Anh\nMẹo: Bạn có thể gõ ví dụ chữ Anh hoặc A, tớ sẽ đề xuất những giáo viên có chữ Anh hoặc A trong tên nhé!",
    "quick_replies": [
      {
        "content_type": "text",
        "title": "Đặt gv mặc định",
        "payload": "setTeacher",
        "image_url": ""
      },
      {
        "content_type": "text",
        "title": "Exit",
        "payload": "exit",
        "image_url": ""
      }
    ]
  },
  "searchClassesAskSubject": {
    "text": "Nhập tên môn học mà bạn cần tìm lớp được dạy\nVí dụ: Tin",
    "quick_replies": [
      {
        "content_type": "text",
        "title": "Toán",
        "payload": "",
        "image_url": ""
      },
      {
        "content_type": "text",
        "title": "Lý",
        "payload": "",
        "image_url": ""
      },
      {
        "content_type": "text",
        "title": "Hoá",
        "payload": "",
        "image_url": ""
      },
      {
        "content_type": "text",
        "title": "Sinh",
        "payload": "",
        "image_url": ""
      },
      {
        "content_type": "text",
        "title": "Tin",
        "payload": "",
        "image_url": ""
      },
      {
        "content_type": "text",
        "title": "Văn",
        "payload": "",
        "image_url": ""
      },
      {
        "content_type": "text",
        "title": "Anh",
        "payload": "",
        "image_url": ""
      },
      {
        "content_type": "text",
        "title": "Sử",
        "payload": "",
        "image_url": ""
      },
      {
        "content_type": "text",
        "title": "Địa",
        "payload": "",
        "image_url": ""
      },
      {
        "content_type": "text",
        "title": "GDCD",
        "payload": "",
        "image_url": ""
      },
      {
        "content_type": "text",
        "title": "Thể dục",
        "payload": "",
        "image_url": ""
      }
    ]
  },
  "checkGroupResponse": {
    "text": "",
    "quick_replies": [
      {
        "content_type": "text",
        "title": "Danh sách lớp",
        "payload": "groupsList",
        "image_url": ""
      },
      {
        "content_type": "text",
        "title": "Exit",
        "payload": "exit",
        "image_url": ""
      }
    ]
  },
  "estimateTimeResponse": {
    "text": "",
    "quick_replies": [
      {
        "content_type": "text",
        "title": "Đổi thời gian tb",
        "payload": "changeAverageWdTime",
        "image_url": ""
      },
      {
        "content_type": "text",
        "title": "xemwd",
        "payload": "xemwd",
        "image_url": ""
      },
      {
        "content_type": "text",
        "title": "xoawd",
        "payload": "xoawd",
        "image_url": ""
      }
    ]
  },
  "askDay": {
    "text": "",
    "quick_replies": [
      {
        "content_type": "text",
        "title": "",
        "payload": "",
        "image_url": ""
      },
      {
        "content_type": "text",
        "title": "Hôm nay",
        "payload": "day",
        "image_url": ""
      },
      {
        "content_type": "text",
        "title": "Ngày mai",
        "payload": "day",
        "image_url": ""
      },
      {
        "content_type": "text",
        "title": "Hôm qua",
        "payload": "day",
        "image_url": ""
      },
      {
        "content_type": "text",
        "title": "Tất cả",
        "payload": "day",
        "image_url": ""
      },
      {
        "content_type": "text",
        "title": "2",
        "payload": "day",
        "image_url": ""
      },
      {
        "content_type": "text",
        "title": "3",
        "payload": "day",
        "image_url": ""
      },
      {
        "content_type": "text",
        "title": "4",
        "payload": "day",
        "image_url": ""
      },
      {
        "content_type": "text",
        "title": "5",
        "payload": "day",
        "image_url": ""
      },
      {
        "content_type": "text",
        "title": "6",
        "payload": "day",
        "image_url": ""
      },
      {
        "content_type": "text",
        "title": "7",
        "payload": "day",
        "image_url": ""
      },
      {
        "content_type": "text",
        "title": "Chủ nhật",
        "payload": "day",
        "image_url": ""
      },
      {
        "content_type": "text",
        "title": "Exit",
        "payload": "exit",
        "image_url": ""
      }
    ]
  },
  "searchGroupsAskDay": {
    "text": "",
    "quick_replies": [
      {
        "content_type": "text",
        "title": "Tra môn học khác",
        "payload": "overwriteSubject",
        "image_url": ""
      },
      {
        "content_type": "text",
        "title": "Hôm nay",
        "payload": "day",
        "image_url": ""
      },
      {
        "content_type": "text",
        "title": "Ngày mai",
        "payload": "day",
        "image_url": ""
      },
      {
        "content_type": "text",
        "title": "2",
        "payload": "day",
        "image_url": ""
      },
      {
        "content_type": "text",
        "title": "3",
        "payload": "day",
        "image_url": ""
      },
      {
        "content_type": "text",
        "title": "4",
        "payload": "day",
        "image_url": ""
      },
      {
        "content_type": "text",
        "title": "5",
        "payload": "day",
        "image_url": ""
      },
      {
        "content_type": "text",
        "title": "6",
        "payload": "day",
        "image_url": ""
      },
      {
        "content_type": "text",
        "title": "7",
        "payload": "day",
        "image_url": ""
      },
      {
        "content_type": "text",
        "title": "Exit",
        "payload": "exit",
        "image_url": ""
      }
    ]
  },
  'groupList': {
    "text": `
+ Lớp 10: 10t1, 10t2, 10l, 10h, 10si, 10ti, 10v1, 10v2, 10su, 10d, 10a1, 10a2.

+ Lớp 11: 11t1, 11t2, 11l, 11h, 11si, 11ti, 11v1, 11v2, 11su, 11d, 11a1, 11a2.

+ Lớp 12: 12t, 12l, 12h, 12si, 12ti, 12v, 12su, 12d, 12c1, 12c2, 12a1, 12a2.`
  },
  "teacherList": {
    "text": `
Danh sách giáo viên bạn có thể tra:
( A ) PN.An HTN.Ánh
-----
( B ) NT.Bình NV.Bảo PT.Bằng NV.Bình
-----
( C ) NT.Chinh LX.Cường
-----
( D ) NTT.Dung NT.Dịu NT.Dung
-----
( Đ ) TN.Điệp LĐ.Điển NT.Đô NT.Đức
-----
( G ) LT.Giang NT.Giang
-----
( H ) NT.Huyền NTT.Huyền HT.Hà VT.Huyến NK.Hoàn NT.Hương BT.Hưng ĐT.Hường NT.Huế ĐT.Hương NT.Hà(h) VTT.Hằng HL.Hương ĐT.Hiền NT.Hường NT.Hà(su) NT.Hòa LTT.Hiền PĐ.Hiệp VT.Huê NT.Hoa NQ.Huy VB.Huy LN.Hân
-----
( K ) TV.Kỷ NH.Khánh TT.Khanh VD.Khanh
-----
( L ) TK.Linh LT.Loan NT.Linh VT.Len D.Liễu NTM.Loan NT.Loan NTH.Liên NT.Lê NT.Lệ VT.Lợi NM.Lan (NP.Ly Ly) NT.Lương
-----
( M ) LT.Mùi NQ.Minh NV.Mạnh
-----
( N ) NT.Nga TTB.Ngọc NT.Nhung HT.Nhân LV.Ngân NP.Nga DTT.Nga NV.Nga NT.Nguyệt HD.Ngọc NTT.Nhung
-----
( O ) VK.Oanh
-----
( P ) NV.Phán NT.Phương NTT.Phương
-----
( Q ) TH.Quang
-----
( S ) Shaine
-----
( T ) NV.Tuấn HT.Thảo TT.Trang NTH.Trang NT.Thu HTT.Thủy NTT.Thuỷ LH.Trang NTP.Thảo NT.Tuyết CT.Thúy NT.Thuý NP.Thảo NC.Trung BM.Thủy HT.Toan ĐTT.Toàn
-----
( V ) NH.Vân PH.Vân NT.Vân TTB.Vân NĐ.Vang LT.Vui
-----
( X ) TH.Xuân
-----
( Y ) (NT.Yến (địa)) (NT.Yến (anh))`
  }
}
