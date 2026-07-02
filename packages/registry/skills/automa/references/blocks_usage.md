# Chi tiết Input / Output các khối Node (Blocks)

Dưới đây là chi tiết cấu hình đầu vào (`data`) và đầu ra của tất cả các block trong Automa. Các tham số này được thiết lập trong thuộc tính `data` của mỗi block.

> **Trường chung của mọi block**: `description` (string), `disableBlock` (boolean), `selected` (boolean), `inGroup` (boolean), `onError` (string). Các trường này không được liệt kê lại ở từng block để tránh trùng lặp.

## Mục lục

### 1. Khối Khởi tạo & Sự kiện
- [`trigger`](#trigger) — Bắt đầu workflow
- [`browser-event`](#browser-event) — Lắng nghe sự kiện trình duyệt
- [`trigger-event`](#trigger-event) — Bắn sự kiện DOM giả lập
- [`workflow-state`](#workflow-state) — Quản lý trạng thái workflow

### 2. Khối Trình duyệt & Cửa sổ
- [`new-tab`](#new-tab) — Mở tab mới
- [`go-back`](#go-back) — Quay lại trang trước
- [`reload-tab`](#reload-tab) — Tải lại trang
- [`close-tab`](#close-tab) — Đóng tab
- [`active-tab`](#active-tab) — Chuyển focus tab
- [`switch-tab`](#switch-tab) — Chuyển tab
- [`new-window`](#new-window) — Mở cửa sổ mới
- [`switch-to`](#switch-to) — Chuyển iframe/shadow DOM
- [`forward-page`](#forward-page) — Tiến trang
- [`tab-url`](#tab-url) — Điều hướng URL

### 3. Khối Tương tác DOM & Website
- [`event-click`](#event-click) — Click phần tử
- [`forms`](#forms) — Nhập/đọc form
- [`get-text`](#get-text) — Trích xuất text
- [`element-scroll`](#element-scroll) — Cuộn trang
- [`hover-element`](#hover-element) — Hover chuột
- [`attribute-value`](#attribute-value) — Lấy thuộc tính HTML
- [`element-exists`](#element-exists) — Kiểm tra phần tử
- [`take-screenshot`](#take-screenshot) — Chụp màn hình
- [`upload-file`](#upload-file) — Tải file lên
- [`press-key`](#press-key) — Gõ phím
- [`create-element`](#create-element) — Tạo thẻ HTML
- [`verify-selector`](#verify-selector) — Xác minh selector
- [`link`](#link) — Trích xuất link
- [`save-assets`](#save-assets) — Lưu tài nguyên

### 4. Khối Điều khiển & Vòng lặp
- [`delay`](#delay) — Tạm dừng
- [`conditions`](#conditions) — Rẽ nhánh If/Else
- [`loop-data`](#loop-data) — Lặp qua mảng
- [`loop-elements`](#loop-elements) — Lặp qua DOM
- [`loop-breakpoint`](#loop-breakpoint) — Break/Continue loop
- [`while-loop`](#while-loop) — Lặp theo điều kiện
- [`repeat-task`](#repeat-task) — Lặp số lần cố định
- [`execute-workflow`](#execute-workflow) — Gọi sub-workflow
- [`blocks-group`](#blocks-group) — Nhóm block
- [`block-package`](#block-package) — Gói mở rộng
- [`ai-workflow`](#ai-workflow) — Tích hợp AI

### 5. Khối Xử lý Dữ liệu & Biến
- [`insert-data`](#insert-data) — Lưu vào bảng
- [`export-data`](#export-data) — Xuất file
- [`log-data`](#log-data) — Ghi log
- [`increase-variable`](#increase-variable) — Tăng/giảm biến
- [`slice-variable`](#slice-variable) — Cắt chuỗi/mảng
- [`regex-variable`](#regex-variable) — Regex trên biến
- [`data-mapping`](#data-mapping) — Ánh xạ dữ liệu
- [`sort-data`](#sort-data) — Sắp xếp
- [`delete-data`](#delete-data) — Xóa dữ liệu

### 6. Khối Tích hợp & Nâng cao
- [`javascript-code`](#javascript-code) — Chạy JS tùy chỉnh
- [`webhook`](#webhook) — Gọi HTTP API
- [`google-sheets`](#google-sheets) — Google Sheets
- [`notification`](#notification) — Thông báo
- [`parameter-prompt`](#parameter-prompt) — Popup nhập liệu
- [`clipboard`](#clipboard) — Copy/Paste
- [`handle-dialog`](#handle-dialog) — Xử lý alert/confirm
- [`handle-download`](#handle-download) — Quản lý tải file
- [`wait-connections`](#wait-connections) — Chờ network idle
- [`proxy`](#proxy) — Thiết lập proxy
- [`interaction-block`](#interaction-block) — Chờ tương tác thủ công
- [`google-drive`](#google-drive) — Google Drive
- [`google-sheets-drive`](#google-sheets-drive) — Sheets + Drive
- [`note`](#note) — Ghi chú

---

## 1. Khối Khởi tạo & Sự kiện (Triggers & Events)

### `trigger`
Block khởi đầu workflow, định nghĩa cách kịch bản được kích hoạt.
- **Input (`data`)**:
  - `type` (string): Cách khởi chạy. Các giá trị: `"manual"`, `"interval"`, `"context-menu"`, `"specific-day"`, `"cron"`, `"on-element"`, `"webhook"`.
  - `interval` (number): Chu kỳ lặp (giây) — dùng khi `type = "interval"`.
  - `delay` (number): Độ trễ trước khi chạy (giây).
  - `shortcut` (string): Phím tắt bàn phím để kích hoạt.
  - `url` (string): Pattern URL để tự động kích hoạt.
  - `isUrlRegex` (boolean): Cho phép dùng regex trong `url`.
  - `contextMenuName` (string): Tên hiển thị trong menu chuột phải.
  - `contextTypes` (array): Kiểu context menu (`["selection"]`, `["link"]`, `["image"]`, `["page"]`...).
  - `parameters` (array): Danh sách tham số đầu vào — mỗi phần tử gồm `id`, `label`, `type` (`"text"`, `"number"`, `"select"`, `"file"`), `defaultValue`, `required`, `options`.
  - `activeInInput` (boolean): Kích hoạt ngay cả khi con trỏ đang ở ô input.
  - `date` (string): Ngày chạy (yyyy-MM-dd).
  - `time` (string): Giờ chạy (HH:mm).
  - `days` (array): Các ngày trong tuần (`["mon","tue","wed","thu","fri","sat","sun"]`).
  - `observeElement` (object): Cấu hình theo dõi phần tử DOM — gồm `selector`, `baseSelector`, `baseElOptions`, `targetOptions`, `matchPattern`.
  - `preferParamsInTab` (boolean): Hiện popup nhập tham số trong tab thay vì popup nhỏ.
- **Output**: Khởi tạo workflow context và truyền điều khiển tới block kế tiếp. Nếu có `parameters`, dữ liệu nhập từ người dùng được lưu vào biến `$params.<tên>`.

### `browser-event`
Lắng nghe sự kiện từ trình duyệt (như tab được tạo, tab được cập nhật, tab được đóng, cửa sổ thay đổi).
- **Input (`data`)**:
  - `eventType` (string): Loại sự kiện — `"tab-created"`, `"tab-updated"`, `"tab-removed"`, `"tab-activated"`, `"window-created"`, `"window-removed"`, `"download-completed"`.
  - `urlFilter` (string): Pattern URL để lọc sự kiện (chỉ kích hoạt khi URL khớp).
  - `isUrlRegex` (boolean): Cho phép regex trong `urlFilter`.
- **Output**: Khi sự kiện xảy ra, thông tin chi tiết về sự kiện được lưu vào biến (ví dụ `$tabId`, `$url`, `$windowId`).

### `trigger-event`
Bắn một sự kiện DOM giả lập lên phần tử trang web.
- **Input (`data`)**:
  - `selector` (string): CSS selector của phần tử đích.
  - `eventType` (string): Loại sự kiện — `"click"`, `"mouseover"`, `"mouseout"`, `"keydown"`, `"keyup"`, `"focus"`, `"blur"`, `"change"`, `"submit"`, `"scroll"`, `"custom"`.
  - `eventDetail` (object): Dữ liệu bổ sung cho sự kiện (ví dụ `keyCode` cho keyboard event, `clientX`/`clientY` cho mouse event).
- **Output**: Sự kiện được kích hoạt trên DOM, không trả về dữ liệu.

### `workflow-state`
Quản lý trạng thái của workflow đang chạy (tạm dừng, dừng, chờ).
- **Input (`data`)**:
  - `action` (string): Hành động — `"pause"`, `"stop"`, `"wait"`, `"resume"`.
  - `condition` (string): Điều kiện kích hoạt (ví dụ dựa trên biến hoặc kết quả block trước).
- **Output**: Workflow chuyển trạng thái theo hành động đã chỉ định.

---

## 2. Khối Trình duyệt & Cửa sổ (Browser & Tabs)

### `new-tab`
Mở một tab mới trên trình duyệt.
- **Input (`data`)**:
  - `url` (string): Đường dẫn trang web cần mở (bắt buộc). Hỗ trợ nội suy biến `{{variable}}`.
  - `updatePrevTab` (boolean): Nếu `true`, cập nhật tab hiện hành thay vì mở tab mới.
  - `active` (boolean): Chuyển focus sang tab này ngay sau khi mở.
  - `customUserAgent` (boolean) + `userAgent` (string): Bật/tắt và thiết lập User-Agent giả lập thiết bị.
  - `waitTabLoaded` (boolean): Chờ cho đến khi tab tải xong hoàn toàn.
- **Output**: Tab mới được tạo và kích hoạt. URL vừa mở được lưu vào biến nội bộ của engine.

### `go-back`
Quay lại trang trước trong lịch sử tab hiện tại.
- **Input (`data`)**:
  - `onError` (string): Hành vi khi lỗi (`"stop-workflow"`, `"continue"`,...).
- **Output**: Quay lại trang trước, không trả về dữ liệu.

### `reload-tab`
Tải lại trang hiện tại.
- **Input (`data`)**: Không có tham số đặc biệt.
- **Output**: Trang được reload, không trả về dữ liệu.

### `close-tab`
Đóng tab hiện tại.
- **Input (`data`)**: Không có tham số.
- **Output**: Tab đóng, workflow chuyển sang block tiếp theo.

### `active-tab`
Chuyển focus về một tab cụ thể theo chỉ số hoặc URL.
- **Input (`data`)**:
  - `tab` (string): Cách xác định tab — `"by-index"`, `"by-url"`, `"last-tab"`, `"next-tab"`, `"previous-tab"`, `"first-tab"`.
  - `value` (string): Giá trị tương ứng — chỉ số tab (số) hoặc URL pattern.
- **Output**: Chuyển focus tới tab đích, không trả về dữ liệu.

### `switch-tab`
Chuyển đổi qua lại giữa các tab đang mở (tương tự tổ hợp phím Ctrl+Tab).
- **Input (`data`)**:
  - `direction` (string): Hướng chuyển — `"next"` hoặc `"previous"`.
  - `times` (number): Số lần chuyển (mặc định 1).
- **Output**: Chuyển tab, không trả về dữ liệu.

### `new-window`
Mở một cửa sổ trình duyệt mới.
- **Input (`data`)**:
  - `url` (string): URL mở trong cửa sổ mới.
  - `active` (boolean): Focus vào cửa sổ mới ngay sau khi mở.
  - `width` / `height` (number): Kích thước cửa sổ (pixel).
  - `left` / `top` (number): Vị trí cửa sổ trên màn hình.
  - `incognito` (boolean): Mở ở chế độ ẩn danh.
- **Output**: Cửa sổ mới được tạo, tab được kích hoạt.

### `switch-to`
Chuyển vùng focus sang iframe, shadow DOM hoặc cửa sổ khác.
- **Input (`data`)**:
  - `target` (string): Đích chuyển đến — `"iframe"`, `"shadow-dom"`, `"parent-frame"`, `"default-content"`.
  - `selector` (string): CSS selector của iframe hoặc shadow host (dùng khi `target = "iframe"` hoặc `"shadow-dom"`).
  - `index` (number): Chỉ số iframe nếu có nhiều iframe (0-indexed).
- **Output**: Context được chuyển sang vùng mới, các block DOM phía sau sẽ tương tác trong vùng đó.

### `forward-page`
Tiến tới trang tiếp theo trong lịch sử trình duyệt của tab hiện tại.
- **Input (`data`)**: Không có tham số đặc biệt.
- **Output**: Tiến trang, không trả về dữ liệu.

### `tab-url`
Điều hướng URL trực tiếp trên tab hiện tại.
- **Input (`data`)**:
  - `url` (string): URL cần điều hướng đến.
- **Output**: Tab được điều hướng tới URL mới.

---

## 3. Khối Tương tác DOM & Website (Web Interactions)

### `event-click`
Mô phỏng thao tác nhấp chuột (click) vào một phần tử trên trang.
- **Input (`data`)**:
  - `selector` (string): CSS selector của thẻ HTML cần click. Hỗ trợ nội suy biến.
  - `findBy` (string): Phương thức tìm kiếm phần tử. Thường là `"cssSelector"`.
  - `waitForSelector` (boolean): Chờ phần tử xuất hiện trước khi click.
  - `waitSelectorTimeout` (number): Thời gian chờ tối đa (ms).
  - `multiple` (boolean): Click lần lượt vào tất cả phần tử khớp selector.
  - `markEl` (boolean): Đánh dấu phần tử bằng viền đỏ để dễ debug.
- **Output**: Không có dữ liệu trả về trực tiếp, tự động chuyển điều khiển sang node tiếp theo sau khi click thành công.

### `forms`
Nhập liệu hoặc lấy dữ liệu từ các form (input, textarea, select, checkbox).
- **Input (`data`)**:
  - `selector` (string): CSS selector của thẻ input. Hỗ trợ nội suy biến.
  - `type` (string): Loại thẻ form: `"text-field"`, `"checkbox"`, `"select"`, `"radio"`, `"file"`.
  - `value` (string/number): Giá trị cần điền (áp dụng khi `getValue = false`). Hỗ trợ nội suy biến `{{variable}}`.
  - `getValue` (boolean): Nếu `true`, block sẽ **lấy** giá trị hiện hành thay vì **nhập**.
  - `clearValue` (boolean): Xóa sạch khung nhập liệu trước khi điền.
  - `multiple` (boolean): Áp dụng thao tác lên tất cả các thẻ khớp với selector.
  - `delay` (number): Độ trễ (ms) giữa mỗi lần gõ phím nhằm vượt qua cơ chế chống bot.
  - `assignVariable` (boolean): Gán kết quả vào biến.
  - `variableName` (string): Tên biến để lưu kết quả.
  - `saveData` (boolean): Lưu kết quả vào bảng dữ liệu.
  - `dataColumn` (string): ID cột trong bảng để lưu.
  - `selectOptionBy` (string): Chọn option trong dropdown theo `"value"` hoặc `"text"`.
  - `optionPosition` (number): Vị trí option trong dropdown (1-indexed).
  - `waitForSelector` (boolean) + `waitSelectorTimeout` (number): Chờ phần tử xuất hiện.
  - `markEl` (boolean): Đánh dấu phần tử để debug.
  - `findBy` (string): Phương thức tìm kiếm (`"cssSelector"`).
  - `events` (array): Danh sách event phụ (ví dụ `change`, `blur`) kích hoạt sau khi nhập.
- **Output**: 
  - Nếu `getValue = true`: Trả về giá trị chuỗi (string) hoặc mảng (array) nếu `multiple = true`.
  - Nếu `getValue = false`: Trả về `null`.

### `get-text`
Trích xuất nội dung văn bản từ một hoặc nhiều phần tử.
- **Input (`data`)**:
  - `selector` (string): CSS selector phần tử. Hỗ trợ nội suy biến `{{loopData@items}}` để dùng với `loop-elements`.
  - `multiple` (boolean): Trích xuất từ tất cả thẻ khớp (trả về mảng).
  - `includeTags` (boolean): Lấy `outerHTML` thay vì text.
  - `useTextContent` (boolean): Lấy qua `textContent` thay cho `innerText` (giữ lại khoảng trắng nguyên thủy).
  - `regex` (string) + `regexExp` (array): Regex và flags (`"g"`, `"i"`) để bóc tách phần cụ thể.
  - `prefixText` / `suffixText` (string): Chuỗi chèn thêm trước/sau text trích xuất.
  - `findBy` (string): Phương thức tìm kiếm.
  - `saveData` (boolean): Lưu vào bảng dữ liệu.
  - `dataColumn` (string): ID cột trong bảng.
  - `assignVariable` (boolean) + `variableName` (string): Lưu vào biến.
  - `addExtraRow` (boolean) + `extraRowDataColumn` (string) + `extraRowValue` (string): Thêm dòng phụ với giá trị tĩnh.
  - `waitForSelector` (boolean) + `waitSelectorTimeout` (number): Chờ phần tử xuất hiện.
  - `markEl` (boolean): Đánh dấu phần tử để debug.
- **Output**: Trả về `string` (nếu `multiple = false`) hoặc `array` (nếu `multiple = true`).

### `element-scroll`
Cuộn trang web tới một phần tử hoặc vị trí cụ thể.
- **Input (`data`)**:
  - `selector` (string): CSS selector phần tử cần cuộn tới.
  - `findBy` (string): Phương thức tìm kiếm.
  - `scrollIntoView` (boolean): Cuộn phần tử vào khung nhìn.
  - `scrollX` / `scrollY` (number): Cuộn tới tọa độ pixel cụ thể.
  - `incX` / `incY` (boolean): Cuộn tương đối (thêm vào vị trí hiện tại).
  - `smooth` (boolean): Cuộn mượt (smooth scroll).
  - `waitForSelector` (boolean) + `waitSelectorTimeout` (number): Chờ phần tử xuất hiện.
  - `markEl` (boolean): Đánh dấu phần tử để debug.
- **Output**: Không trả về dữ liệu, chỉ thao tác cuộn.

### `hover-element`
Mô phỏng di chuột (hover) vào phần tử.
- **Input (`data`)**:
  - `selector` (string): CSS selector phần tử cần hover.
- **Output**: Không trả về dữ liệu.

### `attribute-value`
Lấy giá trị thuộc tính HTML của phần tử.
- **Input (`data`)**:
  - `selector` (string): CSS selector.
  - `attributeName` (string): Tên thuộc tính (ví dụ `href`, `src`, `data-id`).
- **Output**: Trả về giá trị thuộc tính dưới dạng string.

### `element-exists`
Chờ hoặc kiểm tra sự tồn tại của phần tử trên DOM.
- **Input (`data`)**:
  - `selector` (string): CSS selector.
  - `timeout` (number): Thời gian chờ tối đa (ms).
- **Output**: Boolean — `true` nếu phần tử tồn tại, `false` nếu hết thời gian chờ.

### `take-screenshot`
Chụp màn hình trang web hiện tại.
- **Input (`data`)**:
  - `type` (string): Kiểu chụp — `"full-page"` (toàn trang), `"viewport"` (vùng nhìn thấy), `"element"` (chụp phần tử).
  - `selector` (string): CSS selector phần tử cần chụp (dùng khi `type = "element"`).
  - `format` (string): Định dạng ảnh — `"png"`, `"jpeg"`, `"webp"`.
  - `quality` (number): Chất lượng ảnh (0-100, chỉ dùng cho JPEG/WebP).
  - `saveData` (boolean): Lưu vào bảng dữ liệu.
  - `assignVariable` (boolean) + `variableName` (string): Lưu vào biến dạng base64.
- **Output**: Trả về dữ liệu ảnh dạng base64 string hoặc đường dẫn file đã lưu.

### `upload-file`
Mô phỏng tải file lên qua `<input type="file">`.
- **Input (`data`)**:
  - `selector` (string): CSS selector của thẻ input file.
  - `filePath` (string): Đường dẫn file cần tải lên.
  - `multiple` (boolean): Chọn nhiều file cùng lúc.
  - `filePaths` (array): Danh sách nhiều file (dùng khi `multiple = true`).
- **Output**: File được chọn, không trả về dữ liệu.

### `press-key`
Mô phỏng gõ phím trên trang web.
- **Input (`data`)**:
  - `keys` (array): Danh sách phím cần gõ — mỗi phần tử là key code (ví dụ `"Tab"`, `"Enter"`, `"Escape"`, `"ArrowDown"`, `"a"`, `"ctrl+c"`, `"Control"`, `"Shift"`, `"Alt"`).
  - `target` (string): CSS selector phần tử đích để gửi sự kiện phím (nếu để trống thì gửi lên document).
  - `delay` (number): Độ trễ (ms) giữa mỗi lần gõ phím.
  - `times` (number): Số lần lặp lại tổ hợp phím.
- **Output**: Thao tác bàn phím được thực thi, không trả về dữ liệu.

### `create-element`
Tạo một thẻ HTML mới và tiêm (inject) vào DOM của trang hiện tại.
- **Input (`data`)**:
  - `html` (string): Chuỗi HTML của phần tử cần tạo (ví dụ `'<div class="my-banner">Hello</div>'`).
  - `targetSelector` (string): CSS selector phần tử cha để chèn vào.
  - `position` (string): Vị trí chèn — `"beforebegin"`, `"afterbegin"`, `"beforeend"`, `"afterend"` (tương tự `insertAdjacentHTML`).
- **Output**: Phần tử HTML được tiêm vào DOM, không trả về dữ liệu.

### `verify-selector`
Xác minh CSS selector hợp lệ và tồn tại trên trang.
- **Input (`data`)**:
  - `selector` (string): CSS selector cần kiểm tra.
- **Output**: Boolean — `true` nếu selector hợp lệ và phần tử tồn tại, `false` nếu không.

### `link`
Tìm và trích xuất đường dẫn liên kết từ các thẻ `<a>` trên trang.
- **Input (`data`)**:
  - `selector` (string): CSS selector (mặc định `"a"`).
  - `attribute` (string): Thuộc tính cần lấy — `"href"`, `"text"`, `"title"`.
- **Output**: Trả về mảng các URL hoặc text của các liên kết tìm được.

### `save-assets`
Tự động tải và lưu tài nguyên (hình ảnh, video, file) từ trang web.
- **Input (`data`)**:
  - `assetType` (string): Loại tài nguyên — `"images"`, `"videos"`, `"audios"`, `"documents"`, `"all"`.
  - `selector` (string): CSS selector để lọc tài nguyên cụ thể.
  - `downloadPath` (string): Thư mục lưu file trên máy.
  - `renamePattern` (string): Pattern đặt tên file (ví dụ `"image_{index}"`).
- **Output**: Tài nguyên được tải xuống thư mục chỉ định, trả về danh sách đường dẫn file.

---

## 4. Khối Điều khiển & Vòng lặp (Flow & Logic)

### `delay`
Tạm dừng kịch bản trong một khoảng thời gian.
- **Input (`data`)**:
  - `time` (number): Thời gian chờ tính bằng milliseconds (mặc định 500ms).
- **Output**: Tiếp tục block kế sau khi hết thời gian chờ.

### `conditions`
Rẽ nhánh kịch bản (If/Else) theo nhiều điều kiện.
- **Input (`data`)**:
  - `conditions` (array): Danh sách điều kiện. Mỗi điều kiện gồm `id` (định danh nhánh) và biểu thức so sánh.
  - `retryConditions` (boolean): Lặp lại kiểm tra nếu không có điều kiện nào đúng.
- **Output**: Chuyển hướng luồng tới nhánh có điều kiện khớp.

### `loop-data`
Vòng lặp qua một mảng dữ liệu.
- **Input (`data`)**:
  - `loopId` (string): UUID định danh vòng lặp.
  - `loopThrough` (string): Kiểu dữ liệu lặp — `"custom-data"`, `"numbers"`, `"table"`, `"elements"`, `"google-sheets"`, `"variable"`.
  - `loopData` (array): Mảng dữ liệu tĩnh (dùng khi `loopThrough = "custom-data"`).
  - `variableName` (string): Tên biến chứa mảng (dùng khi `loopThrough = "variable"`).
  - `referenceKey` (string): Key tham chiếu.
  - `fromNumber` / `toNumber` (number): Khoảng số (dùng khi `loopThrough = "numbers"`).
  - `maxLoop` (number): Giới hạn số lần lặp (0 = không giới hạn).
  - `startIndex` (number): Chỉ số bắt đầu (0-indexed).
  - `resumeLastWorkflow` (boolean): Tiếp tục từ vị trí dừng lần trước.
  - `elementSelector` (string): CSS selector (dùng khi `loopThrough = "elements"`).
  - `waitForSelector` (boolean) + `waitSelectorTimeout` (number): Chờ phần tử xuất hiện.
- **Output**: Ở mỗi chu kỳ, engine ghi:
  - `{{loopData.<loopId>.data}}` — giá trị phần tử hiện tại.
  - `{{loopData.<loopId>.<field>}}` — field cụ thể nếu phần tử là object.
  - Cú pháp `{{loopData@<loopId>}}` — tham chiếu phần tử hiện tại trong selector.

### `loop-elements`
Vòng lặp qua danh sách phần tử DOM trên trang.
- **Input (`data`)**:
  - `loopId` (string): UUID định danh vòng lặp.
  - `selector` (string): CSS selector để tìm danh sách phần tử DOM.
  - `findBy` (string): Phương thức tìm kiếm.
  - `maxLoop` (number): Giới hạn số phần tử duyệt (0 = không giới hạn).
  - `reverseLoop` (boolean): Duyệt từ cuối lên đầu.
  - `loadMoreAction` (string): Hành động tải thêm — `"scroll"`, `"click"`, hoặc `""` (không).
  - `scrollToBottom` (boolean): Cuộn xuống cuối trang để kích hoạt lazy load.
  - `actionElSelector` (string): CSS selector của nút "Load more" (dùng khi `loadMoreAction = "click"`).
  - `actionElMaxWaitTime` (number): Thời gian chờ tối đa (giây) cho nút load more.
  - `actionPageMaxWaitTime` (number): Thời gian chờ tối đa (giây) cho mỗi lần load.
  - `waitForSelector` (boolean) + `waitSelectorTimeout` (number): Chờ danh sách xuất hiện.
- **Output**: Tại mỗi chu kỳ, phần tử DOM hiện tại có thể tham chiếu qua `{{loopData.<loopId>}}` trong selector của các block con.

### `loop-breakpoint`
Điểm ngắt vòng lặp (`break`/`continue`).
- **Input (`data`)**:
  - `loopId` (string): UUID của vòng lặp cần tác động.
  - `clearLoop` (boolean): Nếu `true`, thoát vòng lặp (break). Nếu `false`, chuyển sang phần tử kế tiếp (continue).
- **Output**: Điều khiển loop, không trả về dữ liệu.
- **Vị trí**: Thường được đặt ở cuối vòng lặp, kết nối ngược về block đầu vòng lặp để tạo chu trình.

### `while-loop`
Vòng lặp chạy cho đến khi điều kiện trở thành sai.
- **Input (`data`)**:
  - `loopId` (string): UUID định danh vòng lặp.
  - `condition` (object): Cấu hình điều kiện gồm:
    - `variable` (string): Tên biến cần kiểm tra.
    - `comparison` (string): Phép so sánh — `"equals"`, `"not-equals"`, `"greater-than"`, `"less-than"`, `"contains"`, `"starts-with"`, `"ends-with"`, `"empty"`, `"not-empty"`.
    - `value` (string): Giá trị so sánh.
  - `maxLoop` (number): Giới hạn số lần lặp (tránh infinite loop).
- **Output**: Lặp cho đến khi điều kiện sai. Biến `{{loopData.<loopId>.count}}` ghi số lần đã lặp.

### `repeat-task`
Lặp lại một nhóm tác vụ theo số lần định trước.
- **Input (`data`)**:
  - `repeatFor` (number): Số lần lặp.
- **Output**: Lặp lại các block con theo số lần đã chỉ định. Biến `{{$repeatIndex}}` chứa chỉ số lần lặp hiện tại (bắt đầu từ 0).

### `execute-workflow`
Gọi và thực thi một workflow Automa khác (sub-workflow) và chờ kết quả trả về.
- **Input (`data`)**:
  - `workflowId` (string): ID của workflow cần gọi (có thể chọn từ danh sách workflow có sẵn).
  - `params` (array): Tham số truyền vào sub-workflow — mảng các object `{ name: "...", value: "..." }`.
  - `waitForResult` (boolean): Chờ sub-workflow hoàn thành trước khi tiếp tục.
  - `assignVariable` (boolean) + `variableName` (string): Lưu kết quả từ sub-workflow vào biến.
- **Output**: Kết quả từ sub-workflow được trả về (nếu `waitForResult = true`).

### `blocks-group`
Nhóm các block lại để quản lý, thu gọn giao diện canvas.
- **Input (`data`)**:
  - `groupId` (string): UUID định danh nhóm.
  - `groupName` (string): Tên hiển thị của nhóm.
  - `collapsed` (boolean): Thu gọn nhóm khi hiển thị.
  - `color` (string): Màu viền nhóm.
- **Output**: Không ảnh hưởng đến luồng dữ liệu, chỉ tổ chức giao diện.

### `block-package`
Sử dụng một gói tính năng mở rộng (extension package) trong workflow.
- **Input (`data`)**:
  - `packageId` (string): ID của gói cài đặt.
  - `blockName` (string): Tên block trong gói.
  - `config` (object): Cấu hình tùy chỉnh theo định nghĩa của gói.
- **Output**: (Phụ thuộc vào gói tính năng cụ thể)

### `ai-workflow`
Khối tích hợp AI — gọi đến các dịch vụ AI (chat, sinh text, phân tích) trong workflow.
- **Input (`data`)**:
  - `provider` (string): Nhà cung cấp AI — `"openai"`, `"google-gemini"`, `"anthropic"`, `"custom"`.
  - `model` (string): Tên model (ví dụ `"gpt-4"`, `"gpt-3.5-turbo"`, `"gemini-pro"`).
  - `prompt` (string): Prompt gửi đến AI. Hỗ trợ nội suy biến.
  - `systemPrompt` (string): System prompt để định hướng AI.
  - `temperature` (number): Độ sáng tạo (0-1, mặc định 0.7).
  - `maxTokens` (number): Số token tối đa trong response.
  - `assignVariable` (boolean) + `variableName` (string): Lưu kết quả vào biến.
- **Output**: Trả về text response từ AI model.

---

## 5. Khối Xử lý Dữ liệu & Biến (Data & Variables)

### `insert-data`
Lưu dữ liệu vào bảng (table) của workflow.
- **Input (`data`)**:
  - `dataList` (array): Danh sách các cặp column-value cần lưu. Mỗi phần tử: `{ column: "<columnId>", value: "<giá trị>" }`. Hỗ trợ nội suy biến trong `value`.
- **Output**: Dữ liệu được thêm một dòng mới vào bảng, không trả về giá trị.

### `export-data`
Xuất dữ liệu từ bảng ra file.
- **Input (`data`)**:
  - `type` (string): Định dạng xuất — `"csv"`, `"json"`, `"plain-text"`.
  - `name` (string): Tên file xuất ra.
  - `dataToExport` (string): Nguồn dữ liệu — `"data-columns"` (xuất bảng), hoặc tên biến.
  - `csvDelimiter` (string): Dấu phân cách CSV (mặc định `","`).
  - `addBOMHeader` (boolean): Thêm BOM header cho UTF-8 (hỗ trợ Excel hiển thị đúng tiếng Việt).
  - `onConflict` (string): Xử lý khi file đã tồn tại — `"uniquify"` (thêm số hậu tố), `"overwrite"` (ghi đè), `"skip"` (bỏ qua).
  - `refKey` (string): Key tham chiếu.
- **Output**: File được tải xuống hoặc lưu vào thư mục chỉ định.

### `log-data`
In log ra console hoặc lịch sử chạy (Execution Log).
- **Input (`data`)**:
  - `message` (string): Nội dung cần log. Hỗ trợ nội suy biến.
  - `level` (string): Mức độ log — `"info"`, `"warn"`, `"error"`, `"debug"`.
- **Output**: Hiển thị log, không ảnh hưởng luồng thực thi.

### `increase-variable`
Tăng hoặc giảm giá trị số của một biến.
- **Input (`data`)**:
  - `variableName` (string): Tên biến cần thay đổi.
  - `step` (number): Giá trị tăng/giảm (số âm để giảm, mặc định 1).
  - `min` (number): Giá trị tối thiểu (nếu xuống dưới sẽ gán bằng min).
  - `max` (number): Giá trị tối đa (nếu lên trên sẽ gán bằng max).
  - `loopMode` (boolean): Nếu `true`, quay vòng (về `min` khi vượt `max` và ngược lại).
- **Output**: Biến được cập nhật giá trị mới.

### `slice-variable`
Cắt (slice) chuỗi hoặc mảng từ một biến.
- **Input (`data`)**:
  - `variableName` (string): Tên biến nguồn (string hoặc array).
  - `start` (number): Chỉ số bắt đầu (0-indexed, hỗ trợ số âm).
  - `end` (number): Chỉ số kết thúc (không bao gồm, hỗ trợ số âm).
  - `assignVariable` (boolean) + `resultVariableName` (string): Tên biến để lưu kết quả.
- **Output**: Trả về phần đã cắt (string con hoặc mảng con).

### `regex-variable`
Áp dụng biểu thức chính quy (Regex) vào biến string.
- **Input (`data`)**:
  - `variableName` (string): Tên biến nguồn.
  - `pattern` (string): Pattern regex (ví dụ `\d+`, `[a-z]+`).
  - `flags` (string): Flags regex — `"g"` (global), `"i"` (case-insensitive), `"m"` (multiline).
  - `replace` (string): Nếu có, thực hiện replace thay vì match.
  - `replaceWith` (string): Giá trị thay thế (dùng khi `replace` được chỉ định).
  - `assignVariable` (boolean) + `resultVariableName` (string): Tên biến để lưu kết quả.
- **Output**: Trả về mảng kết quả match hoặc string đã được replace.

### `data-mapping`
Chuyển đổi và ánh xạ cấu trúc dữ liệu (transform object keys).
- **Input (`data`)**:
  - `inputVariable` (string): Tên biến đầu vào.
  - `mappings` (array): Danh sách quy tắc ánh xạ — mỗi phần tử: `{ from: "key_cũ", to: "key_mới", transform: "lowercase"|"uppercase"|"trim"|"number"|"string" }`.
  - `assignVariable` (boolean) + `resultVariableName` (string): Tên biến lưu kết quả.
- **Output**: Dữ liệu đã được transform với key mới.

### `sort-data`
Sắp xếp dữ liệu trong bảng hoặc mảng.
- **Input (`data`)**:
  - `sourceType` (string): Nguồn dữ liệu — `"data-columns"` (bảng) hoặc `"variable"` (biến mảng).
  - `variableName` (string): Tên biến (dùng khi `sourceType = "variable"`).
  - `sortBy` (string): Key để sắp xếp (nếu dữ liệu là object array).
  - `order` (string): Thứ tự — `"asc"` (tăng dần) hoặc `"desc"` (giảm dần).
  - `assignVariable` (boolean) + `resultVariableName` (string): Tên biến lưu kết quả.
- **Output**: Dữ liệu đã sắp xếp.

### `delete-data`
Xóa biến, dữ liệu trong bảng, hoặc toàn bộ bảng.
- **Input (`data`)**:
  - `targetType` (string): Mục tiêu — `"variable"`, `"data-columns"`, `"all-data"`.
  - `variableName` (string): Tên biến cần xóa (dùng khi `targetType = "variable"`).
  - `rowIndex` (number): Chỉ số dòng cần xóa trong bảng (-1 để xóa tất cả).
- **Output**: Dữ liệu được xóa, không trả về giá trị.

---

## 6. Khối Tích hợp & Nâng cao (Integrations & Advanced)

### `javascript-code`
Chạy mã JS tùy chỉnh với quyền truy cập API của Automa.
- **Input (`data`)**:
  - `code` (string): Đoạn mã JavaScript.
  - `everyNewTab` (boolean): Tự động inject script vào mọi tab mới.
  - `timeout` (number): Thời gian chờ tối đa (ms) trước khi timeout.
  - `preloadScripts` (array): Danh sách URL thư viện tải trước (jQuery, Lodash...).
  - `runBeforeLoad` (boolean): Chạy script trước khi trang load.
- **API functions có sẵn trong sandbox**:
  - `automaNextBlock(data)`: Kích hoạt block tiếp theo và truyền dữ liệu.
  - `automaSetVariable(name, value)`: Ghi biến.
  - `automaRefData(type, name)`: Đọc dữ liệu (variables, table, globalData...).
- **Output**: Dữ liệu từ `automaNextBlock({...})` trở thành input cho block kế tiếp.

### `webhook`
Gửi HTTP request (gọi API).
- **Input (`data`)**:
  - `url` (string): Endpoint API (bắt buộc). Hỗ trợ nội suy biến.
  - `method` (string): HTTP method — `GET`, `POST`, `PUT`, `DELETE`, `PATCH`.
  - `headers` (array): Mảng các object `{ name: "...", value: "..." }`.
  - `body` (string/object): Nội dung request body.
  - `responseType` (string): Kiểu response — `"json"`, `"text"`, `"base64"`.
  - `assignVariable` (boolean) + `variableName` (string): Lưu vào biến.
  - `saveData` (boolean) + `dataPath` (string): Lưu vào bảng theo đường dẫn object path (ví dụ `$response.data.id`).
- **Output**: Response payload. Hỗ trợ fallback — nếu request thất bại, luồng có thể rẽ nhánh theo đường nối lỗi.

### `google-sheets`
Tương tác với Google Sheets API.
- **Input (`data`)**:
  - `type` (string): Hành động — `"update"`, `"get"`, `"append"`, `"clear"`.
  - `spreadsheetId` (string): ID của Google Sheet.
  - `range` (string): Range (ví dụ `"Sheet1!A1:C10"`).
  - `dataFrom` (string): Nguồn dữ liệu — `"data-columns"` (từ bảng), `"custom-data"`.
  - `customData` (string): Dữ liệu tùy chỉnh dạng JSON string.
  - `InsertDataOption` (string): `"INSERT_ROWS"` hoặc `"OVERWRITE"`.
  - `valueInputOption` (string): `"RAW"` hoặc `"USER_ENTERED"`.
  - `assignVariable` (boolean) + `variableName` (string): Lưu kết quả từ Sheet vào biến.
  - `saveData` (boolean): Lưu kết quả vào bảng.
  - `keysAsFirstRow` (boolean): Dùng key làm hàng đầu tiên.
  - `firstRowAsKey` (boolean): Dùng hàng đầu làm key.
  - `refKey` (string): Key tham chiếu.
- **Output**: Dữ liệu từ Sheet hoặc xác nhận ghi thành công.

### `notification`
Hiển thị thông báo đẩy (browser notification) đến người dùng.
- **Input (`data`)**:
  - `title` (string): Tiêu đề thông báo. Hỗ trợ nội suy biến.
  - `message` (string): Nội dung thông báo. Hỗ trợ nội suy biến.
  - `icon` (string): URL icon hiển thị trên thông báo.
  - `silent` (boolean): Không phát âm thanh thông báo.
- **Output**: Thông báo hiển thị, workflow tiếp tục chạy.

### `parameter-prompt`
Hiển thị popup yêu cầu người dùng nhập tham số trước khi workflow tiếp tục.
- **Input (`data`)**:
  - `title` (string): Tiêu đề popup.
  - `description` (string): Mô tả hướng dẫn cho người dùng.
  - `fields` (array): Danh sách trường nhập liệu — mỗi phần tử: `{ id: "...", label: "...", type: "text"|"number"|"select"|"checkbox"|"file", defaultValue: "...", required: true/false, options: ["op1","op2"] }` (options dùng cho type select).
  - `buttonText` (string): Text trên nút xác nhận (mặc định "OK").
- **Output**: Dữ liệu người dùng nhập được lưu vào biến `$params.<id>`.

### `clipboard`
Đọc hoặc ghi dữ liệu vào clipboard (bộ nhớ tạm).
- **Input (`data`)**:
  - `action` (string): Hành động — `"copy"` (ghi) hoặc `"paste"` (đọc).
  - `value` (string): Giá trị cần copy (dùng khi `action = "copy"`). Hỗ trợ nội suy biến.
  - `assignVariable` (boolean) + `variableName` (string): Lưu kết quả paste vào biến (dùng khi `action = "paste"`).
- **Output**: 
  - Nếu `action = "copy"`: Giá trị được ghi vào clipboard, không trả về dữ liệu.
  - Nếu `action = "paste"`: Trả về nội dung clipboard.

### `handle-dialog`
Tự động xử lý các hộp thoại JavaScript (alert, confirm, prompt) của trang web.
- **Input (`data`)**:
  - `action` (string): Hành động — `"accept"` (đồng ý/OK), `"dismiss"` (hủy/Cancel).
  - `dialogType` (string): Loại hộp thoại — `"alert"`, `"confirm"`, `"prompt"`, `"beforeunload"`, `"all"`.
  - `response` (string): Giá trị trả lời cho prompt (dùng khi `dialogType = "prompt"`).
- **Output**: Hộp thoại được tự động xử lý, workflow không bị chặn.

### `handle-download`
Quản lý và theo dõi sự kiện tải file trình duyệt.
- **Input (`data`)**:
  - `action` (string): Hành động — `"allow"` (cho phép), `"block"` (chặn), `"save"` (lưu xuống thư mục chỉ định).
  - `downloadPath` (string): Thư mục lưu file (dùng khi `action = "save"`).
  - `fileTypes` (array): Danh sách đuôi file được phép (ví dụ `[".pdf", ".csv", ".xlsx"]`).
  - `renamePattern` (string): Pattern đặt tên (ví dụ `"report_{date}"`).
  - `assignVariable` (boolean) + `variableName` (string): Lưu thông tin file đã tải vào biến (gồm `filename`, `url`, `fileSize`).
- **Output**: File được quản lý theo cấu hình, trả về thông tin file nếu có.

### `wait-connections`
Chờ cho đến khi tất cả kết nối mạng (network) của tab hiện tại ở trạng thái nhàn rỗi (idle).
- **Input (`data`)**:
  - `timeout` (number): Thời gian chờ tối đa (ms) trước khi bỏ qua.
  - `idleTime` (number): Thời gian (ms) không có request nào để coi là idle.
- **Output**: Tiếp tục khi network không còn request đang xử lý hoặc hết timeout.

### `proxy`
Thiết lập proxy HTTP/SOCKS cho các request mạng của workflow.
- **Input (`data`)**:
  - `protocol` (string): Loại proxy — `"http"`, `"https"`, `"socks4"`, `"socks5"`.
  - `host` (string): Địa chỉ IP hoặc hostname của proxy.
  - `port` (number): Cổng proxy.
  - `username` (string): Tên đăng nhập (nếu proxy yêu cầu auth).
  - `password` (string): Mật khẩu (nếu proxy yêu cầu auth).
  - `bypassList` (array): Danh sách URL không qua proxy (ví dụ `["localhost", "*.internal.com"]`).
  - `enabled` (boolean): Bật/tắt proxy.
- **Output**: Proxy được áp dụng cho tất cả request từ workflow.

### `interaction-block`
Chờ người dùng tương tác thủ công — hiển thị hướng dẫn và nút xác nhận.
- **Input (`data`)**:
  - `message` (string): Nội dung hướng dẫn người dùng (ví dụ "Vui lòng nhập captcha rồi nhấn Tiếp tục").
  - `title` (string): Tiêu đề popup hướng dẫn.
  - `timeout` (number): Thời gian chờ tối đa (giây). Hết time mà không tương tác sẽ bỏ qua.
- **Output**: Workflow tiếp tục khi người dùng xác nhận đã hoàn thành thao tác thủ công.

### `google-drive`
Tương tác với Google Drive API — đọc, tạo, xóa file trên Google Drive.
- **Input (`data`)**:
  - `type` (string): Hành động — `"list"` (liệt kê file), `"upload"` (tải lên), `"download"` (tải xuống), `"delete"` (xóa), `"search"` (tìm kiếm).
  - `fileId` (string): ID của file trên Drive (dùng cho download/delete).
  - `fileName` (string): Tên file cần tìm hoặc tạo.
  - `folderId` (string): ID thư mục trên Drive.
  - `mimeType` (string): Kiểu MIME của file (ví dụ `"text/csv"`, `"application/json"`, `"application/pdf"`).
  - `dataFrom` (string): Nguồn dữ liệu upload — `"data-columns"` (từ bảng) hoặc `"variable"`.
  - `assignVariable` (boolean) + `variableName` (string): Lưu kết quả (danh sách file hoặc nội dung file) vào biến.
- **Output**: 
  - `list`/`search`: Trả về mảng thông tin file (id, name, mimeType, size, modifiedTime).
  - `download`: Trả về nội dung file.
  - `upload`/`delete`: Xác nhận thành công.

### `google-sheets-drive`
Kết hợp Google Sheets và Google Drive — tạo Sheet mới từ dữ liệu và lưu vào Drive.
- **Input (`data`)**:
  - `type` (string): Hành động — `"create"` (tạo file Google Sheets mới), `"export-to-drive"` (xuất dữ liệu bảng ra file trên Drive).
  - `spreadsheetTitle` (string): Tiêu đề file Sheets mới.
  - `folderId` (string): ID thư mục Drive để lưu file.
  - `dataFrom` (string): Nguồn dữ liệu — `"data-columns"`, `"variable"`.
  - `fileName` (string): Tên file xuất ra Drive (dùng khi `type = "export-to-drive"`).
  - `exportFormat` (string): Định dạng xuất — `"csv"`, `"xlsx"`, `"pdf"`, `"ods"`.
- **Output**: Đường dẫn file Google Sheets hoặc file trên Drive được tạo.

### `note`
Ghi chú (non-executing) — không thực thi, chỉ dùng để chú thích trên canvas.
- **Input (`data`)**:
  - `note` (string): Nội dung ghi chú.
  - `color` (string): Màu sắc (`"indigo"`, `"red"`, `"green"`, v.v.).
  - `drawing` (boolean): Chế độ vẽ tay.
  - `fontSize` (string): Kích cỡ chữ (`"regular"`, `"small"`, `"large"`).
  - `width` / `height` (number): Kích thước khung ghi chú.
- **Output**: Không thực thi, không trả về dữ liệu.

---

## Cú pháp nội suy biến (Variable Interpolation)

Các workflow sử dụng cú pháp Handlebars `{{ }}` để tham chiếu dữ liệu:

| Cú pháp | Ý nghĩa | Ví dụ |
|---|---|---|
| `{{loopData.<loopId>.<field>}}` | Field của phần tử trong vòng lặp | `{{loopData.testcases.username}}` |
| `{{loopData@<loopId>}}` | Phần tử hiện tại (dùng trong selector) | `{{loopData@options}}` |
| `{{loopData.items}}` | DOM element hiện tại (trong `loop-elements`) | `{{loopData.items}} > div` |
| `{{variables@$ctxTextSelection}}` | Text được bôi đen từ context menu | `{{variables@$ctxTextSelection}}` |

---

## Cấu trúc luồng (Flow)

Luồng chạy luôn xuất phát từ block có `label: "trigger"`. Dùng mảng `drawflow.edges` để xác định thứ tự:
- `source` → id của block nguồn.
- `target` → id của block đích.
- `sourceHandle` / `targetHandle` — xác định cổng kết nối cụ thể trên block (ví dụ `-output-1`, `-input-1`).

Đối với block `conditions` và `webhook`, có thể có nhiều cổng output (nhánh đúng/sai, thành công/thất bại).

---

## Cấu trúc JSON mẫu của một block node

```json
{
  "id": "my-block-id",
  "label": "forms",
  "type": "BlockBasic",
  "position": { "x": 200, "y": 300 },
  "data": {
    "selector": "#username",
    "value": "{{loopData.testcases.username}}",
    "clearValue": true,
    "delay": 50,
    "waitForSelector": true,
    "waitSelectorTimeout": 10000
  }
}
```
