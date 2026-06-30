---
type: rule
project: my-skills
status: active
tags: #cli, #nodejs, #monorepo, #rule
---

# Quy tắc Phát triển Dự án `my-skills` (OmniAgent Skills CLI & Registry)

## Tài liệu liên quan (Related Documents)
- [[my_skills_rules_proposal]]
- [[implementation_plan]]

---

## 1. Tiêu chuẩn Phát triển Mã nguồn (Code Styling & Standards)

* **Node.js ES Modules (ESM)**:
  * Dự án sử dụng cú pháp ES Modules (`import`/`export`). Tuyệt đối không sử dụng CommonJS (`require`/`module.exports`).
  * Tất cả các file import nội bộ phải có phần mở rộng tệp đầy đủ (ví dụ: `import { installSkill } from '../src/commands/install.js';` - phải có `.js`).
* **Không sử dụng TypeScript**:
  * Các packages CLI và Registry hiện tại được viết bằng Javascript thuần. Có thể sử dụng JSDoc `@ts-check` ở đầu file để hỗ trợ kiểm tra kiểu dữ liệu tĩnh nếu cần.
* **Dependencies**:
  * Hạn chế thêm các dependencies mới để giữ CLI cực kỳ nhẹ. Các thư viện CLI hiện tại: `commander`, `chalk`, `ora`.

---

## 2. Quy trình và Cách thức Chạy Thử nghiệm (Local Development)

* **Cài đặt Dependencies**:
  * Sử dụng lệnh `npm install` tại thư mục gốc của monorepo. Hệ thống sẽ tự động cài đặt dependency cho cả `packages/cli` và `packages/registry` nhờ cấu trúc npm workspaces.
* **Chạy thử nghiệm CLI cục bộ**:
  * Tránh chạy qua package đã build, hãy chạy trực tiếp file thực thi bằng Node.js:
    ```bash
    node packages/cli/bin/index.js <command> [options]
    ```
  * Ví dụ chạy lệnh cài đặt:
    ```bash
    node packages/cli/bin/index.js install automa --force
    ```
  * Ví dụ chạy lệnh danh sách:
    ```bash
    node packages/cli/bin/index.js list
    ```

---

## 3. Quy trình Đóng gói và Phát hành (Publishing)

* Đảm bảo kiểm tra kỹ các thay đổi trước khi release.
* Cả hai package (`@opencode-skills/cli` và `@opencode-skills/registry`) phải được đồng bộ phiên bản hoặc phát hành cùng lúc thông qua script:
  ```bash
  npm run publish:all
  ```
  *(Luôn cập nhật `packages/registry` trước rồi mới đến `packages/cli` để tránh lỗi thiếu phụ thuộc khi cài đặt).*

---

## 4. Quy chuẩn Commit (Conventional Commits)

Mọi commit đẩy lên repository cần tuân theo chuẩn Conventional Commits với cấu trúc:
`<type>(<scope>): <description>`

* **`feat`**: Tính năng mới (ví dụ: thêm subcommand mới cho CLI).
* **`fix`**: Sửa lỗi.
* **`docs`**: Cập nhật tài liệu (bao gồm cả các file quy tắc và kỹ năng).
* **`chore`**: Thay đổi lặt vặt liên quan đến build tool, dependencies, v.v.

---

## 5. Quy tắc Đồng bộ Obsidian
* Bất kỳ khi nào tạo mới hoặc cập nhật các tài liệu thiết kế hoặc kế hoạch triển khai dưới dạng artifact (`.md`), hãy thực hiện sao chép chúng sang thư mục Obsidian tương ứng của người dùng:
  `C:\Users\Admin\OneDrive\Documents\Obsidian Vault\OmniDesk\milestones\`
* Các tệp tin quy tắc (`rules/AGENTS.md`) sao chép sang:
  `C:\Users\Admin\OneDrive\Documents\Obsidian Vault\OmniDesk\rules\`


---

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



---

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

