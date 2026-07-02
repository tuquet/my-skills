const fs = require('fs');
const filePath = 'D:/Repository/my-skills/packages/registry/skills/automa/references/blocks_usage.md';
let content = fs.readFileSync(filePath, 'utf8');

// Regex to match ```json ... ```
const jsonBlockRegex = /```json[\s\S]*?```/g;
const newContent = content.replace(jsonBlockRegex, '> _(Tham chiếu cấu trúc JSON chính xác tại file automa.schema.json)_');

// Also update the introductory text to mention the JSON Schema
const newIntro = 'Dưới đây là chi tiết các block trong Automa.\n\n> **Lưu ý quan trọng**: Mọi cấu trúc dữ liệu JSON chính xác (Data Schema) cho từng Block đã được chuyển vào file `automa.schema.json`. Hãy sử dụng file Schema đó làm nguồn chân lý (Source of Truth) khi lập trình, tài liệu này chỉ dùng để giải thích ý nghĩa logic của các trường dữ liệu.';
const finalContent = newContent.replace('Dưới đây là chi tiết cấu hình đầu vào (`data`) và đầu ra của tất cả các block trong Automa. Các tham số này được thiết lập trong thuộc tính `data` của mỗi block.', newIntro);

fs.writeFileSync(filePath, finalContent);
console.log('Successfully stripped JSON blocks from blocks_usage.md');
