# Quy tắc Git Commit chuẩn (Conventional Commits)

Áp dụng tiêu chuẩn Git commit để lịch sử dự án rõ ràng, dễ theo dõi và hỗ trợ tự động sinh changelog.

## Cú pháp Commit
Mỗi message commit bắt buộc phải có dạng:
```
<type>(<scope>): <description>

[body]
[footer]
```

## Các loại Type được chấp nhận:
* **feat**: Thêm một tính năng mới.
* **fix**: Vá lỗi.
* **docs**: Thay đổi liên quan đến tài liệu (README, rules, skills).
* **style**: Thay đổi về format code (khoảng trắng, dấu chấm phẩy, thụt lề) mà không làm thay đổi logic xử lý.
* **refactor**: Tái cấu trúc mã nguồn không sửa lỗi hay thêm tính năng.
* **perf**: Thay đổi mã nguồn nhằm cải thiện hiệu năng.
* **test**: Viết thêm hoặc sửa đổi các bộ test hiện tại.
* **chore**: Các tác vụ lặt vặt liên quan đến hệ thống build, dependencies (ví dụ: nâng cấp thư viện).

## Quy định chi tiết:
1. Tiêu đề commit (description) không viết hoa chữ cái đầu và không có dấu chấm ở cuối câu.
2. Tiêu đề nên giới hạn dưới 50 ký tự.
3. Sử dụng thì hiện tại (ví dụ: "fix typo" thay vì "fixed typo").
