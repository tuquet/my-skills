# Sổ tay Đình chỉ (Deprecation & Obsolete Log)

Tài liệu này ghi chú lại những phương pháp, kiến trúc và mã nguồn cũ của gói `my-skills/automa` đã bị loại bỏ (Obsolete). Các Đặc vụ (Agents) đời sau **TUYỆT ĐỐI KHÔNG** được sử dụng lại những cách tiếp cận này để tránh làm hỏng hệ thống Linter V7 Ultimate.

## 1. Phương pháp "Regex Cào Giao Diện" (Regex UI Scraping) - [OBSOLETE]
- **Script cũ:** `generate_schema_from_ui.js` (Đã bị xóa).
- **Nguyên nhân loại bỏ:** Việc dùng Regex để quét các file `.vue` nhằm tìm thuộc tính `data` là cực kỳ rủi ro, dễ sinh ra "Ảo giác" (Hallucination) do không hiểu được bối cảnh của AST (Cây cú pháp). Nó làm Linter báo lỗi sai lệch.
- **Giải pháp thay thế:** Sử dụng kiến trúc: Đọc gốc tĩnh từ `shared.js` + Phân tích Động bằng Vue AST Compiler.

## 2. Linter cũ (V3/V4) - [DEPRECATED]
- **Script cũ:** `lint.js`
- **Nguyên nhân loại bỏ:** Hardcode quá nhiều logic kiểm tra Required/allOf bên trong lõi Linter, không tuân thủ chuẩn JSON Schema, khó bảo trì.
- **Giải pháp thay thế:** Sử dụng `lint_automa.js` (Phiên bản V5 Ultimate trở lên) đã được tích hợp thư viện `ajv` chuẩn công nghiệp để validate Layer 1, và dùng thuật toán Đồ thị (DFS) để phân tích Layer 3 (Variables, Topology).

## 3. Chỉnh sửa tay file `automa.schema.json` - [OBSOLETE]
- **Nguyên nhân loại bỏ:** Vi phạm nguyên tắc DRY (Don't Repeat Yourself) và "Single Source of Truth". Việc tự tay viết Schema dễ dẫn đến thiếu sót thuộc tính.
- **Giải pháp thay thế:** File Schema phải được **SINH TỰ ĐỘNG 100%** thông qua lệnh `node generate_schema.js`. Mọi tùy chỉnh phải được thực hiện thông qua việc nâng cấp các từ điển tri thức (`shared_blocks.json`, `common_validate.json`, `ui_rules.json`).

## 4. Hardcoded Linter Logic (V5/V6) - [DEPRECATED]
- **Nguyên nhân loại bỏ:** Việc nhét (hardcode) các luật kết nối cổng (Topology) và biến (Variables) trực tiếp vào mã nguồn JS khiến Linter trở thành một "khoản nợ kỹ thuật", khó bảo trì, vi phạm nguyên lý kiến trúc Data-Driven. 
- **Giải pháp thay thế:** Toàn bộ tri thức Tầng 3 (Variables, Topology, Mustache) phải được khai báo thuần túy trong `resources/semantic_rules.json`. Script `lint_automa.js` V7 hiện tại chỉ đóng vai trò là một "Dumb Runner" (cỗ máy đọc JSON) và BẮT BUỘC phải được chạy để kiểm tra Ngữ nghĩa Đồ thị (Semantic Graph) mà công cụ AJV CLI không thể làm được.
