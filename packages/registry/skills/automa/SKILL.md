---
name: automa-workflow-best-practices
description: Hướng dẫn tạo, sửa, review workflow Automa JSON. Trigger: automa, workflow json, automa json, review workflow.
---

# Automa Workflow Best Practices

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

## 4. Review Checklist

1. **Structure Check**: Node có hợp lý với nghiệp vụ? Không áp đặt loop.
2. **Logic Check**: Edges đúng luồng? Nhánh conditions/webhook đã nối đủ?
3. **Documentation Check**: Mỗi node/edge có `description`/`label` chi tiết?
4. **Reusability Check**: Input khai báo trong trigger params? Không hardcode.
5. **Redundancy Check**: Không thêm `element-exists` trước `element-scroll`, `forms`, `event-click` — các block đó đã có `waitForSelector: true` tự kiểm tra phần tử. `element-exists` chỉ dùng để **rẽ nhánh** (có element → A, không → B).
6. **Selector Check**: Ưu tiên XPath, inspect thực tế, không suy đoán DOM. Xem [references/dom_selector_guide.md](./references/dom_selector_guide.md).
7. **Condition Check**: `conditions` luôn có đủ 2 nhánh output (đúng + sai). Không bỏ sót fallback.
8. **Error Handling Check**: Block webhook, new-tab, block DOM có xử lý khi thất bại? (onError, edge fallback)

## 5. Reference Files

- **Chi tiết block I/O**: [references/blocks_usage.md](./references/blocks_usage.md) — cấu trúc `data` của từng block, tra cứu nhanh.
- **Hỏi & Đáp về Workflow**: [references/qa_knowledge.md](./references/qa_knowledge.md) — JSON structure, variables, conditions, sub-workflow, patterns, logging, troubleshooting.
- **DOM Selector / XPath**: [references/dom_selector_guide.md](./references/dom_selector_guide.md) — inspect, ưu tiên XPath, kiểm tra, báo lỗi.
- **Cấu trúc thư mục**: [references/directoring_structure.md](./references/directoring_structure.md) — kiến trúc mã nguồn dự án.
- **Template baseline**: [references/baseline_template.automa.json](./references/baseline_template.automa.json) — workflow mẫu có vòng lặp scroll.