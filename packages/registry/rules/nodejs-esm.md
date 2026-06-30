# Quy tắc Phát triển Node.js ES Modules (ESM)

Các quy định và tiêu chuẩn khi viết mã nguồn Node.js sử dụng cú pháp ES Modules hiện đại.

## 1. Import và Cấu trúc tệp
* Luôn sử dụng cú pháp `import`/`export` thay vì `require()`/`module.exports`.
* Khi import các module cục bộ (file tự viết), bắt buộc phải ghi rõ phần mở rộng tệp `.js` (ví dụ: `import { helper } from './utils.js';`).
* Khi sử dụng các thư viện tích hợp sẵn của Node.js, nên sử dụng tiền tố `node:` (ví dụ: `import fs from 'node:fs';`).

## 2. Xử lý Bất đồng bộ (Asynchronous)
* Ưu tiên sử dụng cú pháp `async`/`await` và tránh sử dụng Callback lồng nhau.
* Khi viết các tác vụ đọc/ghi file, luôn sử dụng phiên bản Promise (ví dụ: `import { readFile } from 'node:fs/promises';`).
* Luôn bao bọc các lời gọi bất đồng bộ trong các khối `try`/`catch` để kiểm soát lỗi tốt nhất.

## 3. Quản lý trạng thái và Biến môi trường
* Không viết cứng (hardcode) các khóa bí mật hay cấu hình môi trường vào mã nguồn. Sử dụng `process.env`.
* Khai báo rõ ràng các biến hằng số ở đầu tệp với dạng viết hoa toàn bộ (UPPER_CASE).
