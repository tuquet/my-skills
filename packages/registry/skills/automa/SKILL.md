---
name: automa-workflow-best-practices
description: Hướng dẫn tạo, sửa, review workflow Automa JSON. Trigger: automa, workflow json, automa json, review workflow.
crossSkills: [test-cases]
---

# Automa Workflow Best Practices

> **tl;dr** — Mỗi node phải có `description` chi tiết, mỗi edge có `label`. Không hardcode — tất cả input khai báo trong `trigger.parameters`. Đừng thêm loop nếu không cần. Đừng thêm `element-exists` trước block đã có `waitForSelector`. Conditions luôn có 2 nhánh. Selector ưu tiên XPath, inspect DOM thật. Webhook gửi log cả pass lẫn fail.

Khi được yêu cầu review, tạo hoặc sửa file workflow Automa JSON, phải tuân thủ các quy tắc sau.

## 1. Baseline Template (Tham khảo, không bắt buộc)

Template baseline (`references/baseline_template.automa.json`) là mẫu workflow có vòng lặp scroll. **Không bắt buộc phải có đủ 8 nodes** — chỉ dùng node phù hợp nghiệp vụ:

- `trigger` → luôn cần
- `new-tab` → nếu workflow cần mở trang web
- Các node loop (`loop-data`, `element-scroll`, `delay`, `loop-breakpoint`) → **chỉ thêm khi tác vụ cần lặp** (scroll nhiều lần, duyệt danh sách, retry). Tác vụ đơn giản (mở tab → click → lấy text → đóng) không cần loop.
- `notification` → optional
- `close-tab` → nếu cần dọn dẹp

> **Quan trọng**: Không áp đặt loop nếu nghiệp vụ không yêu cầu lặp.

## 2. Mô tả Nodes và Edges

- **Nodes**: MỖI node **bắt buộc** có `description` mô tả chi tiết hành động trong ngữ cảnh nghiệp vụ. Không để trống hoặc chung chung.
- **Edges**: MỖI edge nên có `label` mô tả điều kiện hoặc luồng (vd: "Tiến hành đăng nhập", "Kiểm tra thành công").
- **Edge Visuals**: Dùng `animated: true` hoặc màu sắc để phân biệt đường chính/phụ, đường chờ async.

## 3. Trigger Parameters — Bắt buộc để tái sử dụng

- Node `trigger` **PHẢI LUÔN** khai báo tham số (`parameters` array).
- Không hardcode giá trị. VD: login Facebook phải khai báo `fb_username`, `fb_password` trong trigger, tham chiếu bằng `{{variables.fb_username}}`.

## 4. Common Mistakes / Anti-patterns

| Sai | Tại sao sai | Đúng |
|-----|-------------|------|
| Bỏ trống edge `label` | Agent/người đọc không hiểu luồng | Luôn viết label: `"Đã điền xong → submit"` |
| Node `description` chung chung: `"Mở tab"` | Không biết node này làm gì trong nghiệp vụ | `"Mở tab login {{$params.url}} để bắt đầu đăng nhập"` |
| Hardcode password trong node | Lộ thông tin, không reuse được | Khai báo trong `trigger.parameters`, dùng `{{variables.password}}` |
| Thêm `element-exists` trước `event-click` | Block `event-click` đã có `waitForSelector` tự kiểm tra | Chỉ dùng `element-exists` khi cần **rẽ nhánh** (có → A, không → B) |
| Selector tự suy đoán: `input.emailll` | DOM thực tế thường khác với suy nghĩ | Inspect DOM thực tế, ưu tiên XPath |
| Conditions chỉ có 1 nhánh output | Lỗi không được xử lý, workflow treo | Luôn nối cả output-1 (đúng) và output-2 (sai) |
| `new-tab` không có `waitTabLoaded: true` | Các block sau chạy khi trang chưa load → fail | Luôn set `"waitTabLoaded": true` |
| `delay.time` là string `"1000"` | Engine có thể không parse đúng | Luôn là number: `1000` |
| `drawflow` là string (copy từ file export) | Workflow mới tạo không load được, chỉ có file export mới stringify | Khi tạo mới, `drawflow` là **object** `{ nodes, edges }` |

## 5. Review Checklist

1. **Structure Check**: Node có hợp lý với nghiệp vụ? Không áp đặt loop.
2. **Logic Check**: Edges đúng luồng? Nhánh conditions/webhook đã nối đủ?
3. **Documentation Check**: Mỗi node/edge có `description`/`label` chi tiết?
4. **Reusability Check**: Input khai báo trong trigger params? Không hardcode.
5. **Redundancy Check**: Không thêm `element-exists` trước `element-scroll`, `forms`, `event-click` — các block đó đã có `waitForSelector: true` tự kiểm tra phần tử. `element-exists` chỉ dùng để **rẽ nhánh** (có element → A, không → B).
6. **Selector Check**: Ưu tiên XPath, inspect thực tế, không suy đoán DOM. Xem [references/dom_selector_guide.md](./references/dom_selector_guide.md).
7. **Condition Check**: `conditions` luôn có đủ 2 nhánh output (đúng + sai). Không bỏ sót fallback.
8. **Error Handling Check**: Block webhook, new-tab, block DOM có xử lý khi thất bại? (onError, edge fallback)

## 6. Cross-Skill

Khi chuyển test case thành workflow: mỗi bước test = 1+ block Automa. Pre-condition → trigger params, expected result → conditions check, report → webhook. **Xem skill `test-cases`** để biết cách phân tích yêu cầu → sinh test case → convert sang workflow.

## 7. Reference Files

- **Chi tiết block I/O (Semantics)**: [references/blocks_usage.md](./references/blocks_usage.md) — Giải thích ý nghĩa nghiệp vụ của từng trường dữ liệu trong block.
- **JSON Schema chuẩn (Data Types)**: [references/automa.schema.json](./references/automa.schema.json) — Cấu trúc dữ liệu chính xác tuyệt đối (dùng làm Source of Truth khi sinh JSON).
- **Hỏi & Đáp về Workflow**: [references/qa_knowledge.md](./references/qa_knowledge.md) — JSON structure, variables, conditions, sub-workflow, patterns, logging, troubleshooting, test automation.
- **DOM Selector / XPath**: [references/dom_selector_guide.md](./references/dom_selector_guide.md) — inspect, ưu tiên XPath, kiểm tra, báo lỗi.
- **Cấu trúc thư mục**: [references/directoring_structure.md](./references/directoring_structure.md) — kiến trúc mã nguồn dự án.
- **Template baseline**: [references/baseline_template.automa.json](./references/baseline_template.automa.json) — workflow mẫu có vòng lặp scroll.

## Quick Reference

| Rule | Ghi nhớ |
|------|---------|
| Description | Node: chi tiết nghiệp vụ. Edge: `"hành động → hành động tiếp"` |
| Params | Tất cả input trong `trigger.parameters`, không hardcode |
| Loop | Chỉ thêm nếu cần lặp, không áp đặt |
| WaitForSelector | Block DOM tự có, không thêm `element-exists` thừa |
| Conditions | Luôn 2 nhánh: output-1 (đúng) + output-2 (sai) |
| XPath | Ưu tiên XPath, inspect DOM thật |
| Webhook | Gửi log cả pass lẫn fail |
| waitTabLoaded | Luôn `true` sau `new-tab` |
| drawflow | Khi tạo mới là **object** `{ nodes, edges }`. File export mới stringify |