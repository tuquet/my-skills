---
name: automa
description: Hiểu và thao tác với cấu trúc kịch bản Automa (JSON).
---

# Cấu trúc Kịch bản Automa

Các file `*.automa.json` là các workflow tự động hóa của Automa.

## Vị trí khai báo khối Node (Blocks) trong Automa
Dựa trên kiến trúc của dự án, các blocks được định nghĩa và xử lý tại:
1. **Giao diện chỉnh sửa thông số (Vue Components):** Chứa các form để nhập liệu cấu hình của node.
2. **Logic thực thi Background (Workflow Engine):** Chứa các file handler xử lý logic chạy ngầm độc lập với DOM.
3. **Logic thực thi Content Script:** Chứa các logic tương tác trực tiếp lên DOM của trang web đang mở.

## Danh sách Toàn bộ các khối Node (Blocks) và Phân loại

Trong file JSON, các khối Node được khai báo trong `drawflow.nodes`. Trường `label` quy định tên của khối (định dạng kebab-case). Dưới đây là danh sách phân tích toàn bộ các blocks hiện có trong mã nguồn:

### 1. Khối Khởi tạo & Sự kiện (Triggers & Events)
- **`trigger`**: Bắt đầu kịch bản. `data` chứa cấu hình khởi chạy (manual, interval, cron, v.v.).
- **`browser-event`**: Lắng nghe sự kiện từ trình duyệt.
- **`trigger-event`**: Bắn một sự kiện DOM giả lập.
- **`workflow-state`**: Quản lý và thay đổi trạng thái của kịch bản đang chạy.

### 2. Khối Trình duyệt & Cửa sổ (Browser & Tabs)
- **`new-tab`**: Mở tab mới (`data.url`, `data.active`).
- **`new-window`**: Mở một cửa sổ trình duyệt mới.
- **`active-tab`**: Đổi focus sang một tab đã chỉ định.
- **`close-tab`**: Đóng tab hiện hành.
- **`switch-tab`**: Chuyển đổi qua lại giữa các tab đang mở.
- **`switch-to`**: Chuyển vùng focus (thường dùng để nhảy vào trong `iframe`).
- **`reload-tab`**: Tải lại trang (F5).
- **`go-back`** / **`forward-page`**: Quay lại trang trước / Tiến tới trang sau trong lịch sử tab.
- **`tab-url`**: Điều hướng URL trực tiếp trên tab hiện tại.

### 3. Khối Tương tác DOM & Website (Web Interactions)
- **`event-click`**: Click phần tử (`data.selector`).
- **`forms`**: Nhập liệu vào form (`data.selector`, `data.value`).
- **`get-text`**: Trích xuất text từ trang (`data.selector`, `data.regex`).
- **`attribute-value`**: Lấy giá trị của một thuộc tính HTML (ví dụ `href`, `src`).
- **`press-key`**: Mô phỏng hành động gõ phím máy tính.
- **`element-exists`**: Chờ hoặc kiểm tra xem DOM có xuất hiện không.
- **`element-scroll`**: Cuộn màn hình trang web tới một vị trí hoặc phần tử cụ thể.
- **`hover-element`**: Mô phỏng thao tác di chuột (mouseover/hover) vào phần tử.
- **`create-element`**: Khởi tạo thẻ HTML mới và tiêm vào DOM của trang.
- **`verify-selector`**: Xác minh thẻ CSS hợp lệ và tồn tại.
- **`take-screenshot`**: Chụp màn hình trang web hiện tại.
- **`save-assets`**: Tự động lưu tài nguyên (hình ảnh, video) từ trang.
- **`upload-file`**: Mô phỏng việc chọn và tải file lên qua thẻ `<input type="file">`.
- **`link`**: Tìm và trích xuất đường dẫn liên kết.

### 4. Khối Điều khiển & Vòng lặp (Flow & Logic)
- **`delay`**: Tạm dừng kịch bản (`data.time`).
- **`conditions`**: Rẽ nhánh điều kiện (If/Else) phân luồng đồ thị.
- **`loop-data`**: Vòng lặp qua một mảng dữ liệu nội bộ.
- **`loop-elements`**: Lặp qua danh sách các thẻ DOM tìm được trên trang.
- **`while-loop`**: Vòng lặp chạy cho đến khi sai điều kiện.
- **`loop-breakpoint`**: Điểm ngắt điều khiển vòng lặp (`break` hoặc `continue`).
- **`repeat-task`**: Lặp lại một tập hợp các tác vụ theo số lần định trước.
- **`execute-workflow`**: Gọi và thực thi một kịch bản Automa khác như một hàm (sub-workflow).
- **`blocks-group`**: Nhóm các khối lại với nhau để dễ quản lý.
- **`block-package`**: Sử dụng một gói tính năng mở rộng.
- **`ai-workflow`**: Khối hỗ trợ tích hợp gọi AI.

### 5. Khối Xử lý Dữ liệu & Biến (Data & Variables)
- **`insert-data`**: Lưu dữ liệu vào biến lưu trữ hoặc bảng (table).
- **`export-data`**: Xuất dữ liệu nội bộ ra file định dạng CSV/JSON.
- **`delete-data`**: Xóa nội dung biến hoặc dòng trong bảng.
- **`data-mapping`**: Chuyển đổi và ánh xạ cấu trúc dữ liệu.
- **`sort-data`**: Sắp xếp dữ liệu trong mảng hoặc bảng.
- **`increase-variable`**: Tăng/giảm giá trị dạng số của biến.
- **`slice-variable`**: Cắt chuỗi string hoặc mảng array.
- **`regex-variable`**: Áp dụng biểu thức chính quy (Regex) vào biến.
- **`log-data`**: In log ra console hoặc màn hình lịch sử chạy.

### 6. Khối Tích hợp & Nâng cao (Integrations & Advanced)
- **`javascript-code`**: Thực thi mã JavaScript tùy chỉnh trong Sandbox (`data.code`).
- **`webhook`**: Gửi API request ra ngoài (HTTP request).
- **`proxy`**: Thiết lập Proxy HTTP/SOCKS cho các request mạng.
- **`google-sheets`** / **`google-drive`** / **`google-sheets-drive`**: Gọi Google API để đọc/ghi file và Sheet.
- **`parameter-prompt`**: Hiển thị popup yêu cầu người dùng phải nhập thông số trước khi chạy tiếp.
- **`handle-dialog`**: Tự động xử lý các hộp thoại javascript alert/confirm/prompt của trang web.
- **`handle-download`**: Bắt sự kiện tải file và quản lý thư mục lưu.
- **`wait-connections`**: Chờ cho đến khi Network nhàn rỗi (Network idle).
- **`interaction-block`**: Khối chờ người dùng tương tác thủ công.
- **`clipboard`**: Đọc/ghi bộ nhớ tạm (copy/paste).
- **`notification`**: Hiển thị thông báo đẩy (toast / web notification).

## Hướng dẫn ứng dụng thực tế
- **Sửa cấu hình:** Khi đọc file `*.automa.json`, hãy tìm `label` để nhận diện chức năng của khối. Sau đó sửa đổi các giá trị nằm bên trong đối tượng `data`.
- **Đọc chi tiết tham số (Input/Output):** Xem file tham chiếu chi tiết tại [references/blocks_usage.md](./references/blocks_usage.md) để biết rõ cấu trúc `data` của các khối phổ biến nhất (như `new-tab`, `forms`, `get-text`, `javascript-code`).
- **Luồng chạy:** Luôn xuất phát từ `id` của node có label là `trigger`. Lần theo mảng `drawflow.edges` bằng cách ghép `source` (id đầu ra) sang `target` (id đầu vào) để biết trình tự thực thi.
- **Cấu trúc mã nguồn:** Tra cứu chi tiết kiến trúc file và vị trí sửa đổi source code tại [references/directoring_structure.md](./references/directoring_structure.md).
