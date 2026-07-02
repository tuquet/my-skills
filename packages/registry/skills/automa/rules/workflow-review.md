---
name: automa-workflow-review
description: Checklist review chi tiết một bản nháp Automa Workflow
---

# Review Checklist

Khi review một Workflow (hoặc trước khi hoàn thành việc khởi tạo), Agent bắt buộc phải tự kiểm tra qua các tiêu chí sau:

1. **Structure Check**: Node có hợp lý với nghiệp vụ? Không áp đặt loop nếu không thực sự cần thiết (tác vụ 1 lần không cần block loop).
2. **Logic Check**: Edges đúng luồng? Nhánh conditions/webhook đã nối đủ?
3. **Documentation Check**: Mỗi node/edge có `description`/`label` chi tiết?
4. **Reusability Check**: Input có được khai báo đầy đủ trong `trigger.parameters`? Tuyệt đối không hardcode.
5. **Redundancy Check**: Không thêm `element-exists` trước `element-scroll`, `forms`, `event-click` — các block đó đã có `waitForSelector: true` tự kiểm tra phần tử. `element-exists` chỉ dùng để **rẽ nhánh logic** (ví dụ: có element → làm A, không → làm B).
6. **Selector Check**: Ưu tiên XPath, inspect thực tế, không suy đoán DOM (đọc `dom-selection.md`).
7. **Condition Check**: `conditions` luôn có đủ 2 nhánh output (đúng + sai). Không bỏ sót fallback.
8. **Error Handling Check**: Các block dễ gây lỗi (webhook, new-tab, block DOM) có được xử lý khi thất bại không? (Sử dụng onError trong block hoặc edge fallback).
