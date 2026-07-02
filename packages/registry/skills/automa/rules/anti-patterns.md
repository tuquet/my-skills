---
name: automa-anti-patterns
description: Các lỗi sai thường gặp khi tạo workflow Automa
---

# Common Mistakes / Anti-patterns

Khi xây dựng workflow Automa, tuyệt đối tránh các lỗi sau:

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
| `drawflow` là string (copy từ file export) | Workflow mới tạo không load được | Khi tạo mới, `drawflow` là **object** `{ nodes, edges }` |
