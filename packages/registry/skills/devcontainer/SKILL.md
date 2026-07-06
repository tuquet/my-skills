---
name: devcontainer
description: Kiến thức và thủ thuật khi làm việc với môi trường Dev Container (VS Code), bao gồm CLI, Docker-in-Docker, xử lý CRLF, và tối ưu Cache pnpm.
---

# Dev Container Best Practices & Troubleshooting

Tài liệu này tổng hợp các kiến thức quan trọng khi thiết lập và làm việc với Dev Container.

## 1. Mở Dev Container bằng Dòng Lệnh (CLI)
Thay vì thao tác trên giao diện (`Ctrl + Shift + P`), bạn có thể gọi trực tiếp từ Terminal:
- **Sử dụng công cụ chính thức `@devcontainers/cli`**: Cài đặt bằng `npm install -g @devcontainers/cli`.
  - Mở thẳng VS Code trong container: `devcontainer open .`
  - Build và Start container ngầm: `devcontainer up --workspace-folder .`
  - Mở Terminal/bash chui thẳng vào container đang chạy: `devcontainer exec --workspace-folder . bash`
- **Sử dụng VS Code CLI thông thường**: 
  - Gõ `code .`, VS Code sẽ khởi động ở môi trường bình thường. Nó sẽ nhận diện thư mục `.devcontainer` và tự động hiển thị popup ở góc phải dưới hỏi "Reopen in Container". Nhấn nút đó để chuyển vào.

## 2. Cho phép Container sử dụng Docker của máy chủ (Docker-outside-of-Docker)
Nếu trong Dev Container bạn cần chạy các công cụ dùng đến Docker (như `npx supabase start`, `docker-compose`...), bạn sẽ gặp lỗi không kết nối được đến Docker daemon.
**Cách khắc phục:** Thêm tính năng chia sẻ socket Docker (mount docker.sock) vào file `devcontainer.json`:
```json
  "features": {
    "ghcr.io/devcontainers/features/docker-outside-of-docker:1": {}
  }
```

## 3. Lỗi Shell Script do định dạng xuống dòng (CRLF vs LF)
Khi clone code trên hệ điều hành Windows, các file có thể bị lưu dòng kết thúc bằng `CRLF` (`\r\n`). Nhưng khi các file bash script (`.sh`) chạy bên trong môi trường Linux của Dev Container, nó sẽ báo lỗi cú pháp do ký tự `\r` (carriage return).
**Cách khắc phục:**
Bắt buộc Git sử dụng LF cho tất cả các file mã nguồn (đặc biệt là script) bằng cách tạo file `.gitattributes` ở thư mục gốc:
```text
* text=auto eol=lf
*.bat text eol=crlf
```
*(Nếu file đã bị lỗi từ trước trên ổ cứng, cần dùng công cụ đổi thủ công định dạng dòng sang LF)*.

## 4. Tối ưu hóa Cache cài đặt Package (pnpm, npm)
Mặc định mọi thay đổi bên trong container sẽ bị biến mất khi bạn thao tác **Rebuild Container**. Điều này khiến `pnpm install` mất rất nhiều thời gian kéo lại thư viện.
**Cách khắc phục:** Tạo và gắn kết một Volume vật lý (độc lập với vòng đời của container) để chuyên lưu trữ store cache của trình quản lý gói.
Ví dụ cấu hình cho `pnpm` trong `devcontainer.json`:
```json
  "mounts": [
    "source=projectname-pnpm-store,target=/home/node/.local/share/pnpm/store,type=volume"
  ]
```
*(Lưu ý: Thay `projectname-pnpm-store` bằng tên volume tùy chỉnh cho dự án, và `target` trỏ đúng vào thư mục store chuẩn của user tương ứng trong container, ví dụ user `node`)*.

### Hiểu về cơ chế `.pnpm-store` (Tại sao lại có thư mục này?)
Khác với `npm` hay `yarn` truyền thống (copy toàn bộ thư viện vào từng thư mục `node_modules` gây lãng phí dung lượng rất lớn), `pnpm` sử dụng cơ chế **Global Store** (Kho lưu trữ toàn cục).
- Nó chỉ tải mỗi phiên bản thư viện về **đúng 1 lần duy nhất** và lưu vào thư mục store.
- Tại các thư mục dự án, nó tạo ra các "Shortcut" (Hard link / Symlink) trỏ xuyên qua ổ cứng tới thư viện gốc nằm trong store. Cơ chế này giúp tiết kiệm hàng chục GB dung lượng và tốc độ cài đặt diễn ra ngay lập tức vì không cần tải lại.
- Mặc định `pnpm` giấu thư mục store này ở sâu trong hệ điều hành. Tuy nhiên, hệ điều hành có một giới hạn là **không thể tạo phím tắt (hard link) xuyên qua 2 ổ đĩa/phân vùng khác nhau**. Do đó, nếu dự án của bạn nằm ở phân vùng khác, hoặc bị giới hạn môi trường cục bộ (như chạy qua script/container đặc biệt), `pnpm` buộc phải tạo thư mục `.pnpm-store` ngay tại rễ dự án để có thể tạo link.
- **Cách xử lý:** Chỉ cần thêm `.pnpm-store/` vào file `.gitignore` để giữ cho kho lưu trữ Git của bạn luôn sạch sẽ.
