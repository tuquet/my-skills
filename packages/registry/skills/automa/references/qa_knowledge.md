# Hỏi & Đáp về Workflow Automa

## 1. Cấu trúc JSON

### Hỏi: File .automa.json có cấu trúc thế nào?

```json
{
  "id": "uuid-của-workflow",
  "name": "Tên workflow",
  "drawflow": {
    "nodes": [],
    "edges": []
  }
}
```

### Hỏi: Một node gồm những gì?

```json
{
  "id": "uuid-node",
  "label": "trigger",
  "type": "BlockBasic",
  "position": { "x": 100, "y": 200 },
  "data": { }
}
```

| Trường | Bắt buộc | Mô tả |
|--------|----------|-------|
| `id` | Có | UUID duy nhất trong workflow |
| `label` | Có | Tên block (kebab-case), quyết định chức năng |
| `type` | Có | Luôn `"BlockBasic"` (hoặc `"BlockDelay"`, `"BlockLoopBreakpoint"`) |
| `position` | Có | Tọa độ canvas `{x, y}` |
| `data` | Có | Cấu hình tham số. Khác nhau theo từng label |

### Hỏi: Edge kết nối các node thế nào?

```json
{
  "source": "uuid-node-A",
  "sourceHandle": "-output-1",
  "target": "uuid-node-B",
  "targetHandle": "-input-1"
}
```

**Nhiều cổng output:**
- `conditions`: output-1 (đúng), output-2 (sai / fallback)
- `webhook`: output-1 (thành công), output-2 (thất bại)
- `element-exists`: output-1 (tồn tại), output-2 (không tồn tại)
- Các block khác: chỉ output-1

---

## 2. Biến và Nội suy

### Hỏi: Có những loại biến nào trong workflow?

| Cú pháp | Mô tả | Ví dụ |
|---------|-------|-------|
| `{{variableName}}` | Biến thường | `{{username}}` |
| `{{$params.<id>}}` | Tham số từ trigger | `{{$params.url}}` |
| `{{$tabUrl}}` | URL tab hiện tại | `{{$tabUrl}}` |
| `{{$workflowName}}` | Tên workflow | `{{$workflowName}}` |
| `{{$timestamp}}` | Thời gian chạy | `{{$timestamp}}` |
| `{{loopData.<loopId>.data}}` | Giá trị trong vòng lặp | `{{loopData.items.data}}` |
| `{{loopData@<loopId>}}` | Phần tử DOM hiện tại | `{{loopData@items}} > div` |
| `{{$globalData.<key>}}` | Global data | `{{$globalData.loggingUrl}}` |

### Hỏi: Nội suy biến dùng trong selector thế nào?

Ví dụ với `loop-elements`:

```json
{
  "label": "get-text",
  "data": {
    "selector": "{{loopData@loop-items}} .title",
    "assignVariable": true,
    "variableName": "itemTitle"
  }
}
```

`loopData@loop-items` tham chiếu đến phần tử DOM hiện tại trong vòng lặp.

---

## 3. Conditions (Rẽ nhánh)

### Hỏi: Tôi muốn hiểu cách dùng block conditions đúng?

Block `conditions` cho phép rẽ nhánh luồng xử lý dựa trên kiểm tra giá trị của biến.

```json
{
  "label": "conditions",
  "data": {
    "conditions": [
      { "id": "ok", "variable": "loginStatus", "comparison": "equals", "value": "success" }
    ]
  }
}
```

**Các phép so sánh:**

| `comparison` | Ý nghĩa | Ví dụ |
|-------------|---------|-------|
| `equals` | Bằng | `"variable":"role","value":"admin"` |
| `not-equals` | Không bằng | `"variable":"status","value":"error"` |
| `greater-than` | Lớn hơn (số) | `"variable":"price","value":"100000"` |
| `less-than` | Nhỏ hơn (số) | `"variable":"count","value":"5"` |
| `contains` | Chứa chuỗi | `"variable":"$tabUrl","value":"dashboard"` |
| `starts-with` | Bắt đầu bằng | `"variable":"email","value":"admin"` |
| `ends-with` | Kết thúc bằng | `"variable":"file","value":".pdf"` |
| `empty` | Rỗng | `"variable":"result","comparison":"empty"` |
| `not-empty` | Không rỗng | `"variable":"errors","comparison":"not-empty"` |

**Cách nối edge:**
- **output-1**: khi có ít nhất 1 điều kiện đúng
- **output-2**: khi không có điều kiện nào đúng (else / fallback)

> **Luôn có nhánh fallback.** Không bỏ sót output-2 — nếu không, lỗi sẽ không được xử lý.

### Hỏi: Làm sao kiểm tra element tồn tại để rẽ nhánh?

Dùng block `element-exists` + `conditions`:

```json
[
  {
    "id": "n-check",
    "label": "element-exists",
    "data": { "selector": ".error-message", "timeout": 3000 }
  },
  {
    "id": "n-branch",
    "label": "conditions",
    "data": {
      "conditions": [
        { "id": "hasError", "variable": "$elementExist", "comparison": "equals", "value": "true" }
      ]
    }
  }
]
```

- output-1 (element-exists) → n-branch
  - output-1 (conditions): có lỗi → xử lý lỗi
  - output-2 (conditions): không lỗi → tiếp tục

> **Quan trọng**: `element-exists` chỉ dùng để **rẽ nhánh** (có element → A, không → B). Không cần `element-exists` trước `element-scroll`, `forms`, `event-click` vì các block đó đã có `waitForSelector: true` tự kiểm tra phần tử trước khi thao tác.

### Hỏi: Làm sao tạo nhiều hơn 2 nhánh?

Xếp chồng nhiều block `conditions` nối tiếp:

```text
[conditions: giá > 1tr] ──output-1──→ [xử lý giá cao]
        │
        └──output-2──→ [conditions: giá > 500k] ──output-1──→ [xử lý giá trung bình]
                            │
                            └──output-2──→ [xử lý giá thấp]
```

---

## 4. Execute Workflow (Sub-workflow)

### Hỏi: execute-workflow là gì và dùng khi nào?

Block `execute-workflow` cho phép gọi một workflow Automa khác như **hàm con (sub-routine)**. Giúp tái sử dụng logic mà không copy-paste nodes.

```json
{
  "label": "execute-workflow",
  "data": {
    "workflowId": "uuid-của-workflow-con",
    "params": [
      { "name": "username", "value": "{{$params.fb_username}}" },
      { "name": "password", "value": "{{$params.fb_password}}" }
    ],
    "waitForResult": true,
    "assignVariable": true,
    "variableName": "loginResult"
  }
}
```

**Cách hoạt động:**

```text
[workflow cha]               [workflow con]
     │                             │
     ├── gọi execute-workflow ───→  nhận params
     │       │                     │
     │       │                     ├── xử lý (login, scrape...)
     │       │                     │
     │       │                     └── trả kết quả
     │       │
     │   ←─── nhận kết quả
     │
     ├── dùng kết quả để rẽ nhánh
     └── tiếp tục
```

**Use cases:**
- **Common login**: 1 workflow login dùng chung cho nhiều workflow
- **Send log**: gửi log về server
- **Export data**: xuất CSV/JSON ra file

**Khi KHÔNG nên dùng:**
- Sub-workflow chỉ 1-2 nodes (lãng phí)
- Cần kết quả tức thời → set `waitForResult: false`
- Workflow con cần tương tác cùng tab với workflow cha

---

## 5. Workflow Patterns

### Hỏi: Pattern login cơ bản thế nào?

```text
trigger → new-tab → forms(user) → forms(pass) → event-click → wait-connections → conditions
```

Mỗi node cần `description` mô tả chi tiết. Edge cần `label`.
Trigger phải khai báo params `url`, `username`, `password` — không hardcode.

Tham khảo JSON mẫu trong file `baseline_template.automa.json`.

### Hỏi: Pattern scrape (thu thập dữ liệu) thế nào?

```text
trigger → new-tab → loop-elements → get-text → insert-data → loop-breakpoint → [quay lại loop]
```

- `loop-elements` duyệt danh sách phần tử DOM
- `get-text` trích xuất text với selector động `{{loopData@loopId}} .title`
- `insert-data` lưu vào bảng
- `loop-breakpoint` nối ngược về đầu loop

### Hỏi: Pattern form fill (điền form) thế nào?

```text
trigger → new-tab → forms(field1) → forms(field2) → ... → upload-file → event-click → wait-connections
```

Mỗi field dùng 1 block `forms` riêng. Set `delay: 50` để tránh chống bot. Dùng `clearValue: true` nếu field đã có giá trị mặc định.

### Hỏi: Pattern test automation — chạy test case tự động thế nào?

Chuyển test case thành workflow: mỗi bước test = 1+ block. Dùng `webhook` gửi kết quả pass/fail về server.

```text
trigger(params) → new-tab → [test steps] → conditions(verify)
    → webhook({status:"pass", testCase:"TC-001"})
    └── webhook({status:"fail", testCase:"TC-001", error:"..."})
```

**Ví dụ: TC-001 login success → workflow**

```json
{
  "name": "TC-001 Login Success",
  "drawflow": {
    "nodes": [
      {
        "id": "n1", "label": "trigger", "type": "BlockBasic",
        "position": { "x": 100, "y": 100 },
        "data": {
          "type": "manual",
          "parameters": [
            { "id": "url", "label": "Login URL", "type": "text", "required": true },
            { "id": "email", "label": "Email", "type": "text", "required": true },
            { "id": "password", "label": "Password", "type": "text", "required": true },
            { "id": "logUrl", "label": "Report endpoint", "type": "text", "defaultValue": "https://api.test-runner.com/report" }
          ]
        }
      },
      {
        "id": "n2", "label": "new-tab", "type": "BlockBasic",
        "position": { "x": 300, "y": 100 },
        "data": { "url": "{{$params.url}}", "active": true, "waitTabLoaded": true }
      },
      {
        "id": "n3", "label": "forms", "type": "BlockBasic",
        "position": { "x": 500, "y": 100 },
        "data": { "selector": "#email", "value": "{{$params.email}}", "waitForSelector": true, "waitSelectorTimeout": 5000 }
      },
      {
        "id": "n4", "label": "forms", "type": "BlockBasic",
        "position": { "x": 500, "y": 250 },
        "data": { "selector": "#password", "value": "{{$params.password}}" }
      },
      {
        "id": "n5", "label": "event-click", "type": "BlockBasic",
        "position": { "x": 500, "y": 400 },
        "data": { "selector": "button[type='submit']", "waitForSelector": true, "waitSelectorTimeout": 5000 }
      },
      {
        "id": "n6", "label": "wait-connections", "type": "BlockBasic",
        "position": { "x": 700, "y": 400 },
        "data": { "timeout": 10000, "idleTime": 2000 }
      },
      {
        "id": "n7", "label": "conditions", "type": "BlockBasic",
        "position": { "x": 900, "y": 400 },
        "data": {
          "conditions": [
            { "id": "ok", "variable": "$tabUrl", "comparison": "contains", "value": "dashboard" }
          ]
        }
      },
      {
        "id": "n8", "label": "webhook", "type": "BlockBasic",
        "position": { "x": 1100, "y": 200 },
        "data": {
          "url": "{{$params.logUrl}}",
          "method": "POST",
          "headers": [{"name": "Content-Type", "value": "application/json"}],
          "body": "{\"testCase\":\"TC-001\",\"status\":\"pass\",\"url\":\"{{$params.url}}\"}"
        }
      },
      {
        "id": "n9", "label": "webhook", "type": "BlockBasic",
        "position": { "x": 1100, "y": 550 },
        "data": {
          "url": "{{$params.logUrl}}",
          "method": "POST",
          "headers": [{"name": "Content-Type", "value": "application/json"}],
          "body": "{\"testCase\":\"TC-001\",\"status\":\"fail\",\"error\":\"dashboard not found\"}"
        }
      }
    ],
    "edges": [
      { "source": "n1", "sourceHandle": "-output-1", "target": "n2", "targetHandle": "-input-1" },
      { "source": "n2", "sourceHandle": "-output-1", "target": "n3", "targetHandle": "-input-1" },
      { "source": "n3", "sourceHandle": "-output-1", "target": "n4", "targetHandle": "-input-1" },
      { "source": "n4", "sourceHandle": "-output-1", "target": "n5", "targetHandle": "-input-1" },
      { "source": "n5", "sourceHandle": "-output-1", "target": "n6", "targetHandle": "-input-1" },
      { "source": "n6", "sourceHandle": "-output-1", "target": "n7", "targetHandle": "-input-1" },
      { "source": "n7", "sourceHandle": "-output-1", "target": "n8", "targetHandle": "-input-1" },
      { "source": "n7", "sourceHandle": "-output-2", "target": "n9", "targetHandle": "-input-1" }
    ]
  }
}
```

**Kết nối với skill test-cases:** Khi tạo test case theo skill `test-cases`, mapping các bước như sau:

| Bước trong Test Case | → Block |
|---|---|
| Nhập email | `forms` `selector="#email"` |
| Nhập password | `forms` `selector="#password"` |
| Click nút | `event-click` |
| Kiểm tra URL / text | `conditions` hoặc `get-text` + `conditions` |
| Trigger params | `trigger.parameters` ← test data từ Pre-conditions |

**Kết quả:** Mỗi test case chạy riêng 1 workflow. Workflow cha gọi `execute-workflow` từng TC. Kết quả gửi về server qua webhook POST.

---

## 6. Logging & Báo lỗi qua HTTP

### Hỏi: Làm sao gửi log về server khi workflow chạy?

Dùng block `webhook`. URL endpoint có thể cấu hình qua trigger params hoặc globalData.

```json
{
  "label": "webhook",
  "data": {
    "url": "{{$params.logUrl}}/api/logs",
    "method": "POST",
    "headers": [{"name": "Content-Type", "value": "application/json"}],
    "body": "{\"workflow\":\"{{$workflowName}}\",\"status\":\"ok\",\"url\":\"{{$tabUrl}}\",\"time\":\"{{$timestamp}}\"}"
  }
}
```

**Kết nối edge của webhook:**
- output-1: gửi thành công → tiếp tục
- output-2: gửi thất bại → retry hoặc bỏ qua

### Hỏi: Lưu URL logging ở đâu để dễ đổi sau?

**Cách 1 — Trigger params (ưu tiên):**
Khai báo param `logUrl` trong trigger, mặc định URL server.

**Cách 2 — Global data:**
Trong workflow setting, set `globalData`:
```json
{ "loggingUrl": "https://your-server.com/api" }
```
Dùng: `{{$globalData.loggingUrl}}`

### Hỏi: Payload log mẫu nên có gì?

```json
{
  "workflowName": "{{$workflowName}}",
  "status": "error",
  "error": "Selector timeout: #my-element",
  "url": "{{$tabUrl}}",
  "timestamp": "{{$timestamp}}",
  "variables": { "title": "{{title}}" }
}
```

---

## 7. Troubleshooting

### Hỏi: Lỗi timeout — làm sao xử lý?

| Nguyên nhân | Giải pháp |
|-------------|-----------|
| Phần tử chưa load kịp | Tăng `waitSelectorTimeout` (5000 → 15000) |
| Trang chậm do network | Thêm `wait-connections` trước block DOM |
| Trang dùng lazy load | Thêm `element-scroll` hoặc `press-key` (PageDown) |
| Iframe chưa load | Thêm `switch-to` trước khi tương tác |

```json
{
  "label": "wait-connections",
  "data": { "timeout": 20000, "idleTime": 3000 }
}
```

### Hỏi: Selector fail — làm sao phát hiện?

Các block DOM (`element-scroll`, `forms`, `event-click`, `get-text`) đã có `waitForSelector: true` tự kiểm tra phần tử.

Nếu cần **rẽ nhánh** khi không tìm thấy element (ví dụ: có error message → báo lỗi, không có → tiếp tục), dùng `element-exists`:

```json
[
  {
    "id": "n1",
    "label": "element-exists",
    "data": { "selector": ".error-message", "timeout": 3000 }
  },
  {
    "id": "n2",
    "label": "log-data",
    "data": { "message": "Phát hiện lỗi: {{errorText}}", "level": "error" }
  }
]
```
- output-1 (tồn tại) → xử lý lỗi
- output-2 (không tồn tại) → tiếp tục

> Nếu chỉ cần **chờ** element xuất hiện để thao tác, `waitForSelector` của chính block đó đã đủ. Không thêm `element-exists` thừa.

### Hỏi: Lỗi network / HTTP — làm sao xử lý?

Block `webhook` có sẵn 2 nhánh output:
- output-1 (thành công): xử lý dữ liệu
- output-2 (thất bại): log lỗi, retry

```json
{
  "label": "webhook",
  "data": {
    "url": "https://api.example.com/data",
    "method": "GET",
    "assignVariable": true,
    "variableName": "apiResult"
  }
}
```

### Hỏi: Workflow treo không rõ nguyên nhân — debug thế nào?

Thêm `log-data` ở các điểm quan trọng:

```json
[
  { "data": { "message": "Bắt đầu login...", "level": "info" } },
  { "data": { "message": "Đã mở tab: {{$tabUrl}}", "level": "info" } },
  { "data": { "message": "Đã điền user, chuẩn bị submit", "level": "info" } }
]
```

### Hỏi: Retry tự động khi fail — làm sao?

Dùng `javascript-code`:

```json
{
  "label": "javascript-code",
  "data": {
    "code": "let maxRetry = 3;\nlet attempt = $retryCount || 0;\nif (attempt < maxRetry) {\n  automaSetVariable('$retryCount', attempt + 1);\n  automaNextBlock({ retry: true });\n} else {\n  automaNextBlock({ retry: false, error: 'Max retry' });\n}"
  }
}
```
- output-1: còn lượt → quay lại block bị lỗi
- output-2: hết lượt → log lỗi

---

## 8. Best Practices

### Hỏi: Checklist review workflow gồm những gì?

1. **Structure Check**: Các node có hợp lý với nghiệp vụ không? Chỉ thêm loop nếu cần lặp.
2. **Logic Check**: Edges có đúng luồng? Nhánh conditions/webhook đã nối đủ chưa?
3. **Documentation Check**: Mỗi node có `description`, edge có `label` mô tả?
4. **Reusability Check**: Input đã khai báo trong trigger params chưa? Không hardcode.
5. **Redundancy Check**: Không thêm `element-exists` trước các block đã có `waitForSelector`.
6. **Condition Check**: `conditions` luôn có đủ 2 nhánh output (đúng + sai).
7. **Error Handling Check**: Webhook, new-tab, block DOM có xử lý khi thất bại không?

### Hỏi: Lời khuyên chung khi viết workflow?

- **Đặt tên**: `id` node dùng `"node-"` + số thứ tự. `loopId` dùng UUID. `variableName` dùng camelCase.
- **Xử lý lỗi**: Luôn set `waitForSelector: true` + timeout. Webhook cần nhánh fallback.
- **Tối ưu**: Dùng `loop-data` thay `loop-elements` nếu đã có sẵn mảng. Batch nhiều thao tác DOM trong 1 block `javascript-code`.
- **Logging**: Gửi log về server ở cả 2 nhánh thành công và thất bại.
- **Sub-workflow**: Tách common logic (login, export, send log) thành workflow riêng, gọi bằng `execute-workflow`.

---

## 9. Cách viết Description chuẩn cho Nodes và Edges

### Hỏi: Viết description cho node thế nào là tốt?

**Quy tắc NOKIA:**
- **N**ame: node này làm gì?
- **O**bject: tương tác với đối tượng nào? (trang nào, phần tử nào, API nào)
- **K**now: cần biết điều gì? (selector, URL, biến đầu vào)
- **I**ntent: tại sao cần bước này? (mục đích trong nghiệp vụ)
- **A**ction: sau bước này chuyện gì xảy ra? (kết quả, redirect, log)

### Ví dụ trước-sau

| Node | Sai (chung chung) | Đúng (NOKIA) |
|------|-------------------|-------------|
| `new-tab` | `"Mở tab mới"` | `"Mở tab điều hướng đến trang login {{$params.url}} để chuẩn bị đăng nhập bằng tài khoản {{$params.username}}"` |
| `forms` | `"Nhập user"` | `"Điền username {{$params.username}} vào ô #username, dùng delay 50ms để tránh chống bot"` |
| `event-click` | `"Click nút"` | `"Click nút submit để gửi form đăng nhập, sau đó chờ redirect về dashboard"` |
| `conditions` | `"Kiểm tra"` | `"Kiểm tra URL đã đổi sang dashboard chưa. Nếu đúng → login thành công, nếu sai → báo lỗi sai mật khẩu"` |
| `loop-data` | `"Vòng lặp"` | `"Lặp {{$params.scroll_page}} lần, mỗi lần cuộn xuống 1000px để load thêm nội dung lazy"` |
| `webhook` | `"Gửi log"` | `"Gửi log success/fail về server {{$params.logUrl}} để team theo dõi tỷ lệ login thành công"` |
| `get-text` | `"Lấy text"` | `"Trích xuất tiêu đề sản phẩm từ selector .product-title trong vòng lặp hiện tại, lưu vào biến itemTitle để insert vào bảng"` |
| `notification` | `"Thông báo"` | `"Hiển thị thông báo 'Đã xử lý xong {{count}} sản phẩm' để người dùng biết workflow hoàn thành"` |

### Hỏi: Label cho edge viết thế nào?

**Công thức:** `[điều kiện] → [hành động tiếp theo]`

| Edge | Label (sai) | Label (đúng) |
|------|------------|-------------|
| trigger → new-tab | `""` (trống) | `"Bắt đầu mở trang"` |
| forms → event-click | `""` | `"Đã điền xong → tiến hành submit"` |
| conditions output-1 | `"Đúng"` | `"Login thành công → lưu session"` |
| conditions output-2 | `"Sai"` | `"Sai mật khẩu → báo lỗi và gửi log"` |
| loop → get-text | `""` | `"Đã cuộn xong → trích xuất dữ liệu item thứ {{loopIndex}}"` |
| webhook output-1 | `"OK"` | `"Log gửi thành công → kết thúc"` |
| webhook output-2 | `"Fail"` | `"Log gửi thất bại → retry lần {{retryCount}}"` |