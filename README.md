# CBN Supporter
[*Chatbot for supporting CBNer*](https://m.me/cbnsupporter)

## TÍNH NĂNG

* Chat ẩn danh
* Tra thời khoá biểu
* Tra lịch dạy
* Tìm lớp học
* Tìm lớp 4 tiết
* Tìm lớp 5 tiết
* Tìm ảnh (nguồn Pixabay)
* Tính giờ ngủ
* Tính giờ dậy
* (Cập nhật thêm)

## HƯỚNG DẪN SỬ DỤNG CHATBOT (Không cần thiết với phiên bản Messenger thường)
``
Lưu ý: Nếu bạn đang sử dụng nền tảng Facebook/Messenger Lite, bạn có thể update lên bản beta để hiển thị các gợi ý có sẵn.
``

``
Nếu bạn sử dụng phiên bản thường, chatbot sẽ hiển thị Menu cố định và các gợi ý có sẵn khi sử dụng các tính năng.
``

``
Các lệnh dưới đây có thể sử dụng cho cả hai bản.
``

Khi truy cập link [m.me](https://m.me/cbnsupporter) bằng cách bấm Gửi tin nhắn (Send Message) trên trang [CBN Supporter](https://www.facebook.com/cbnsupporter) hoặc vào thẳng đường link, bấm Bắt đầu (Get Started) để khởi động cuộc trò chuyện.
Nếu bạn đang sử dụng bản Lite, bot có thể sẽ không hiện các gợi ý có sẵn khi sử dụng các tính năng, khi đó hãy sử dụng các lệnh sau:

(Bạn có thể viết lệnh theo nhiều cách như Menu, MeNu, mENu, ...)

### DANH SÁCH CÁC LỆNH

**Lệnh chung:**

- *menu*: Menu
- *lệnh*: Danh sách tập lệnh
- *hd*: Hướng dẫn sử dụng
- *help*: Gọi người hỗ trợ (Live chat)
- *exit*: Dừng tính năng đang sử dụng
- *dsl*:  Danh sách các lớp
- *dsgv*: Danh sách giáo viên

**Lệnh tìm kiếm:**

- *tkb*: Tra thời khoá biểu
- *dạy*: Tra lịch dạy học 
- *lớp*: Tìm lớp được dạy môn nào đó
- *4tiet*: Tìm lớp 4 tiết hôm nay
- *5tiet*: Tìm lớp 5 tiết hôm nay

**Lệnh tính năng khác:**

- *dậy + thời điểm dậy*: Xác định thời điểm nên ngủ nếu bạn muốn dậy ở thời điểm bạn nhập.
- *ngủ + thời điểm ngủ*: Xác định thời điểm nên thức dậy nếu bạn ngủ ở thời điểm bạn nhập.

**Lệnh phòng chat:**
- *chattong*: Vào phòng chat tổng
- *chatnn*: Vào phòng ngẫu nhiên
- *timphong*: Tìm phòng chat
- *taophong*: Tạo phòng chat
- *nhapid*: Nhập ID phòng chat
- *phongcu*: Vào phòng cũ gần nhất
- *doiten*: Đổi tên hiển thị
- *doianh*: Đổi ảnh hiển thị

**Lệnh cài đặt:**

- *lop + tên lớp*: Cập nhật thời khoá biểu và bỏ qua bước gõ tên lớp khi sử dụng tính năng **Tra thời khoá biểu**
  - *xemlop*: Xem tên lớp đã cài đặt    
  - *xoalop*:  Xoá tên lớp đã cài đặt   
- *gv + tên giáo viên*: Cập nhật lịch dạy và bỏ qua bước nhập tên giáo viên khi sử dụng tính năng **Tra lịch dạy**
  - *xemgv*: Xem tên giáo viên đã cài đặt
  - *xoagv*: Xoá lịch dạy giáo viên đã cài đặt
- *wd + thời gian (tính theo phút)*: Cập nhật thời gian trung bình để chìm vào giấc ngủ (Tạm gọi: Wind-down)
  - *xemwd*: Xem thời gian trung bình để chìm vào giấc ngủ đã cài đặt
  - *xoawd*: Đổi thời gian trung bình để chìm vào giấc ngủ về mặc định (14')
    
``
Lưu ý: với các lệnh hd, dsl, dsgv, sau khi nhập xong bạn vẫn có thể tiếp tục quá trình nhập dữ liệu khi bạn sử dụng các tính năng như tra thời khoá biểu, tra lịch dạy.
``

### CHI TIẾT TÍNH NĂNG

#### Tra thời khoá biểu (*tkb*)
* Nhập lệnh
* Nếu bạn đã cài đặt tên lớp mặc định hoặc sau khi nhập tên lớp cần tra, bot sẽ hỏi ngày bạn muốn tra thời khoá biểu. Lúc này bạn có thể nhập các lựa chọn sau:
  - Tra lớp khác
  - Hôm nay, hôm qua, ngày mai
  - 2, 3, 4, 5, 6, 7, chủ nhật
> **Lưu ý**: Sau khi gửi lựa chọn của bạn, nếu như không sử dụng lệnh *Exit* hoặc các lệnh khác, bạn vẫn sẽ nằm trong **vòng lặp chọn ngày** và sử dụng các lựa chọn bên trên. Nghĩa là, bạn sẽ tiếp tục chọn ngày ngay sau khi vừa chọn ngày thay vì phải nhập lớp khác.
* Nếu bạn chưa cài đặt tên lớp mặc định hoặc nhập "Tra lớp khác" trong quá trình chọn ngày, bạn sẽ cần nhập tên lớp cần tra. Nếu bot thông báo không tìm thấy lớp hoặc bạn không biết form nhập tên, nhập **dsl** để xem danh sách các lớp.

``
 Nhập Exit để thoát.
``

#### Tra lịch dạy (*dạy*)
* Nhập lệnh
* Nếu bạn đã cài đặt lịch dạy mặc định hoặc sau khi nhập tên giáo viên cần tra, bot sẽ hỏi ngày bạn muốn tra lịch dạy. Lúc này bạn có thể nhập các lựa chọn sau:
  - Tra giáo viên khác
  - Hôm nay, hôm qua, ngày mai
  - 2, 3, 4, 5, 6, 7, chủ nhật
> **Lưu ý**: Sau khi gửi lựa chọn của bạn, nếu như không sử dụng lệnh *Exit* hoặc các lệnh khác, bạn vẫn sẽ nằm trong **vòng lặp chọn ngày** và sử dụng các lựa chọn bên trên. Nghĩa là, bạn sẽ tiếp tục chọn ngày ngay sau khi vừa chọn ngày thay vì phải nhập giáo viên khác.
* Nếu bạn chưa cài đặt lịch dạy mặc định hoặc nhập "Tra giáo viên khác" trong quá trình chọn ngày, bạn sẽ cần nhập tên giáo viên cần tra. Nếu bot thông báo không tìm thấy giáo viên hoặc bạn không biết form nhập tên, nhập **dsgv** để xem danh sách giáo viên.

``
 Nhập Exit để thoát.
``

####  Tính giờ dậy (*ngủ + thời điểm ngủ*)

Nhập *ngủ + thời điểm ngủ* để xác định thời điểm nên thức dậy nếu bạn ngủ ở thời điểm bạn nhập.

Ví dụ: ngủ 21h15/ngủ 21h
> Lưu ý: Nếu bạn bỏ trống thời điểm ngủ, bot sẽ lấy thời điểm lúc bạn nhập lệnh.

#### Tính giờ ngủ (*dậy + thời điểm dậy*)

Nhập *dậy +  thời điểm dậy* để xác định thời điểm nên ngủ nếu bạn muốn dậy ở thời điểm bạn nhập.

Ví dụ: dậy 6h15/dậy 6h
> Lưu ý: Nếu bạn bỏ trống thời điểm dậy, bot sẽ lấy mặc định 6h sáng.

### CHI TIẾT LỆNH CÀI ĐẶT

#### Cài đặt thời khoá biểu (tên lớp) mặc định (*lop + tên lớp*)

Để mỗi lần sử dụng tính năng tra thời khoá biểu bạn không phải mất công ghi lại tên lớp nhiều lần nếu phải tra lớp đó thường xuyên (lớp bạn chẳng hạn), nhập **lop + tên lớp**. Nếu bot thông báo không tìm thấy lớp hoặc bạn không biết form nhập tên lớp, nhập **dsl** để xem danh sách các lớp.
Đừng lo, khi bạn muốn tra lớp khác, bot sẽ có một cái button để giúp bạn tra mà không ảnh hưởng đến lớp đã cài đặt.

Các lệnh đi kèm:
* *xemlop*: Xem tên lớp đã cài đặt
* *xoalop*:  Xoá tên lớp đã cài đặt
#### Cài đặt lịch dạy (tên giáo viên) mặc định (*gv + tên giáo viên*)

Để mỗi lần sử dụng tính năng tìm tiết dạy bạn không phải mất công ghi lại tên giáo viên nhiều lần nếu phải tra lịch dạy của giáo viên đó thường xuyên, nhập **gv + tên giáo viên**. Tương tự, nếu bot thông báo không tìm thấy giáo viên hoặc bạn không biết form nhập tên giáo viên, nhập **dsgv** để xem danh sách giáo viên.
Đừng lo, khi bạn muốn tra lịch dạy của giáo viên khác, bot sẽ có một cái button để giúp bạn tra mà không ảnh hưởng đến giáo viên đã cài đặt.

Các lệnh đi kèm:
* *xemgv*: Xem tên lớp đã cài đặt
* *xoagv*:  Xoá tên lớp đã cài đặt
#### Cài đặt thời gian trung bình để chìm vào giấc ngủ (setwd + thời gian (phút))
Để thuận tiện hơn trong việc xác định thời điểm ngủ, dậy dựa trên thời gian trung bình để chìm vào giấc ngủ của bạn khi sử dụng các tính năng Tính giờ dậy và Tính giờ ngủ, nhập wd + thời gian (phút).

Các lệnh đi kèm:

* *xemwd*: Xem thời gian trung bình để chìm vào giấc ngủ đã cài đặt
* *xoawd*: Đổi thời gian trung bình để chìm vào giấc ngủ về mặc định (14')
### Hỗ trợ (*help*)
Nếu bạn có thắc mắc cần hỗ trợ, cần góp ý hay muốn gợi ý một tính năng nào đó cho bot, nhập *help* và bot sẽ kết nối bạn với coder để trao đổi. Lúc này, bạn sẽ **KHÔNG** thể sử dụng các tính năng được cung cấp sẵn.

Nếu bạn không muốn tiếp tục chat hoặc muốn sử dụng các tính năng được cung cấp, nhập *Exit* để thoát.

## PHÁT TRIỂN CHATBOT

[**JayremntB**](https://www.facebook.com/jayremnt)

*Enjoy!*
