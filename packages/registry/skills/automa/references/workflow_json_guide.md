# Hướng dẫn viết JSON Workflow Automa chuẩn

## 1. Cấu trúc tổng quan

Một file `*.automa.json` là một object JSON với cấu trúc:

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

## 2. Cấu trúc Node (`drawflow.nodes`)

Mỗi node trong mảng `nodes` là một object:

```json
{
  "id": "node-001",
  "label": "trigger",
  "type": "BlockBasic",
  "position": { "x": 100, "y": 200 },
  "data": {
    "description": "Ghi chú cho block này",
    "disableBlock": false,
    "selected": false,
    "inGroup": false,
    "onError": "stop-workflow"
  }
}
```

| Trường | Bắt buộc | Mô tả |
|--------|----------|-------|
| `id` | Có | Định danh duy nhất của node (thường là UUID) |
| `label` | Có | Tên block (kebab-case), quyết định chức năng |
| `type` | Có | Luôn là `"BlockBasic"` |
| `position` | Có | Tọa độ trên canvas `{x, y}` |
| `data` | Có | Cấu hình tham số của block |

### Các trường chung trong `data`

| Trường | Kiểu | Mô tả |
|--------|------|-------|
| `description` | string | Ghi chú mô tả block |
| `disableBlock` | boolean | Tạm tắt block |
| `selected` | boolean | Trạng thái chọn trên UI |
| `inGroup` | boolean | Thuộc nhóm |
| `onError` | string | `"stop-workflow"`, `"continue"`, `"retry"` |

## 3. Cấu trúc Edge (`drawflow.edges`)

Mỗi edge định nghĩa kết nối giữa 2 node:

```json
{
  "source": "node-001",
  "sourceHandle": "-output-1",
  "target": "node-002",
  "targetHandle": "-input-1"
}
```

| Trường | Mô tả |
|--------|-------|
| `source` | `id` của node nguồn |
| `sourceHandle` | Cổng ra: `"-output-1"` (mặc định), hoặc `"-output-2"`, `"-output-3"` cho block có nhiều nhánh |
| `target` | `id` của node đích |
| `targetHandle` | Cổng vào: luôn `"-input-1"` |

### Nhiều cổng output

Một số block có nhiều hơn 1 cổng ra:
- **`conditions`**: `"-output-1"` (nhánh đúng), `"-output-2"` (nhánh sai)
- **`webhook`**: `"-output-1"` (thành công), `"-output-2"` (thất bại)
- **`element-exists`**: `"-output-1"` (tồn tại), `"-output-2"` (không tồn tại)

## 4. Quy tắc đặt ID

- `id` của workflow: UUID (32 ký tự hex, 8-4-4-4-12)
- `id` của node: UUID, không trùng nhau trong cùng workflow
- `loopId` trong block loop: UUID riêng biệt

```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "name": "My Workflow"
}
```

## 5. Nội suy biến (Variable Interpolation)

Workflow hỗ trợ cú pháp `{{ }}` để tham chiếu dữ liệu động:

| Cú pháp | Ví dụ | Mô tả |
|---------|-------|-------|
| `{{variableName}}` | `{{username}}` | Tham chiếu biến |
| `{{loopData.<loopId>.data}}` | `{{loopData.items.data}}` | Giá trị hiện tại trong loop |
| `{{loopData@<loopId>}}` | `{{loopData@items}}` | Phần tử hiện tại (dùng trong selector) |
| `{{$params.<name>}}` | `{{$params.url}}` | Tham số nhập từ popup |
| `{{variables@$ctxTextSelection}}` | | Text bôi đen từ context menu |
| `{{$tabUrl}}` | | URL của tab hiện tại |

```json
{
  "label": "forms",
  "data": {
    "selector": "#{{loopData@items}}",
    "value": "{{$params.url}}",
    "clearValue": true
  }
}
```

## 6. Mẫu workflow hoàn chỉnh

### Ví dụ: Mở tab, click, lấy text

```json
{
  "id": "d5f8e3a2-b1c4-4e6f-8a7b-9c0d1e2f3a4b",
  "name": "Get page title",
  "drawflow": {
    "nodes": [
      {
        "id": "node-001",
        "label": "trigger",
        "type": "BlockBasic",
        "position": { "x": 100, "y": 100 },
        "data": {
          "type": "manual",
          "description": "Start workflow manually"
        }
      },
      {
        "id": "node-002",
        "label": "new-tab",
        "type": "BlockBasic",
        "position": { "x": 300, "y": 100 },
        "data": {
          "url": "https://example.com",
          "active": true,
          "waitTabLoaded": true
        }
      },
      {
        "id": "node-003",
        "label": "get-text",
        "type": "BlockBasic",
        "position": { "x": 500, "y": 100 },
        "data": {
          "selector": "h1",
          "multiple": false,
          "assignVariable": true,
          "variableName": "pageTitle",
          "waitForSelector": true,
          "waitSelectorTimeout": 5000
        }
      }
    ],
    "edges": [
      {
        "source": "node-001",
        "sourceHandle": "-output-1",
        "target": "node-002",
        "targetHandle": "-input-1"
      },
      {
        "source": "node-002",
        "sourceHandle": "-output-1",
        "target": "node-003",
        "targetHandle": "-input-1"
      }
    ]
  }
}
```

### Ví dụ: Loop qua danh sách, có điều kiện

```json
{
  "id": "b7c8d9e0-f1a2-4b3c-8d5e-6f7a8b9c0d1e",
  "name": "Scrape with loop",
  "drawflow": {
    "nodes": [
      {
        "id": "n1",
        "label": "trigger",
        "type": "BlockBasic",
        "position": { "x": 100, "y": 100 },
        "data": { "type": "manual" }
      },
      {
        "id": "n2",
        "label": "new-tab",
        "type": "BlockBasic",
        "position": { "x": 300, "y": 100 },
        "data": {
          "url": "{{$params.url}}",
          "active": true,
          "waitTabLoaded": true
        }
      },
      {
        "id": "n3",
        "label": "loop-elements",
        "type": "BlockBasic",
        "position": { "x": 300, "y": 300 },
        "data": {
          "loopId": "b3a2c1d4-e5f6-4789-abcd-ef1234567890",
          "selector": ".item",
          "maxLoop": 10,
          "waitForSelector": true,
          "waitSelectorTimeout": 5000
        }
      },
      {
        "id": "n4",
        "label": "get-text",
        "type": "BlockBasic",
        "position": { "x": 500, "y": 300 },
        "data": {
          "selector": "{{loopData@b3a2c1d4-e5f6-4789-abcd-ef1234567890}} .title",
          "assignVariable": true,
          "variableName": "itemTitle"
        }
      },
      {
        "id": "n5",
        "label": "insert-data",
        "type": "BlockBasic",
        "position": { "x": 700, "y": 300 },
        "data": {
          "dataList": [
            { "column": "col_title", "value": "{{itemTitle}}" }
          ]
        }
      },
      {
        "id": "n6",
        "label": "loop-breakpoint",
        "type": "BlockBasic",
        "position": { "x": 700, "y": 500 },
        "data": {
          "loopId": "b3a2c1d4-e5f6-4789-abcd-ef1234567890",
          "clearLoop": false
        }
      }
    ],
    "edges": [
      { "source": "n1", "sourceHandle": "-output-1", "target": "n2", "targetHandle": "-input-1" },
      { "source": "n2", "sourceHandle": "-output-1", "target": "n3", "targetHandle": "-input-1" },
      { "source": "n3", "sourceHandle": "-output-1", "target": "n4", "targetHandle": "-input-1" },
      { "source": "n4", "sourceHandle": "-output-1", "target": "n5", "targetHandle": "-input-1" },
      { "source": "n5", "sourceHandle": "-output-1", "target": "n6", "targetHandle": "-input-1" },
      { "source": "n6", "sourceHandle": "-output-1", "target": "n3", "targetHandle": "-input-1" }
    ]
  }
}
```

## 7. Best Practices

### Luồng chạy
- Mọi workflow đều bắt đầu từ block `trigger`
- Dùng edges để xác định thứ tự: `source` → `target`
- Block `loop-breakpoint` nối ngược về đầu loop để tạo vòng lặp

### Đặt tên
- `id` node: dùng tiền tố `"node-"` + số thứ tự (dễ debug)
- `loopId`: dùng UUID riêng biệt, không trùng lặp
- `variableName`: dùng camelCase, mô tả rõ nội dung

### Xử lý lỗi
- Luôn set `waitForSelector: true` + `waitSelectorTimeout` cho block tương tác DOM
- Block `webhook` nối edge lỗi vào nhánh xử lý fallback
- Dùng block `log-data` ở các nhánh lỗi để debug

### Tối ưu
- Dùng `loop-data` thay `loop-elements` nếu đã có sẵn dữ liệu dạng mảng
- Set `maxLoop` để tránh infinite loop
- Batch nhiều thao tác DOM trong 1 block `javascript-code` thay vì nhiều block riêng lẻ