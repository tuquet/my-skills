---
name: automa-workflow-best-practices
description: Hướng dẫn tạo, sửa, review workflow Automa JSON. Trigger: automa, workflow json, automa json, review workflow.
crossSkills: [test-cases]
---

# Automa Workflow Best Practices

Automa Workflow đòi hỏi sự chính xác tuyệt đối về mặt Cấu trúc Dữ liệu (Schema) và chặt chẽ về mặt Nghiệp vụ. SKILL này được thiết kế theo các Modules để giúp Agent dễ dàng tra cứu kiến thức.

## 1. Core Rules (Quy tắc bắt buộc)
Khi tham gia xây dựng hoặc review workflow, phải TUÂN THỦ nghiêm ngặt các quy định sau:
- **[Anti-patterns](file:///D:/Repository/my-skills/packages/registry/skills/automa/rules/anti-patterns.md)**: Danh sách các lỗi sai cơ bản (thiếu label, dư element-exists, hardcode...) cần tuyệt đối tránh.
- **[DOM Selection](file:///D:/Repository/my-skills/packages/registry/skills/automa/rules/dom-selection.md)**: Hướng dẫn lấy Selector chuẩn xác (ưu tiên XPath).
- **[Workflow Review Checklist](file:///D:/Repository/my-skills/packages/registry/skills/automa/rules/workflow-review.md)**: Các bước bắt buộc tự kiểm tra trước khi hoàn thiện một workflow.

## 2. Documentation (Tài liệu kiến thức)
- **[Blocks Usage (Semantics)](file:///D:/Repository/my-skills/packages/registry/skills/automa/docs/blocks-usage.md)**: Giải nghĩa vai trò và cách dùng của từng block trong nghiệp vụ.
- **[Knowledge Base (Q&A)](file:///D:/Repository/my-skills/packages/registry/skills/automa/docs/qa-knowledge.md)**: Các pattern phổ biến, sub-workflow, loop, variable injection, logging.
- **[Architecture](file:///D:/Repository/my-skills/packages/registry/skills/automa/docs/architecture.md)**: Kiến trúc tổ chức mã nguồn của một dự án workflow lớn.

## 3. Schemas & Assets (Chuẩn dữ liệu)
- **[JSON Schema (Data Types)](file:///D:/Repository/my-skills/packages/registry/skills/automa/schemas/automa.schema.json)**: Source of Truth để đảm bảo định dạng JSON xuất ra là 100% hợp lệ.
- **[Baseline Template](file:///D:/Repository/my-skills/packages/registry/skills/automa/assets/baseline.json)**: Khuôn mẫu (boilerplate) tiêu chuẩn để bắt đầu khởi tạo mọi workflow mới.

## 4. Agents (Mẫu cấu hình Agent)
- **[Workflow Generator Prompt](file:///D:/Repository/my-skills/packages/registry/skills/automa/agents/workflow-generator.yml)**: Hướng dẫn tư duy (System prompt) chuyên biệt cho Agent đảm nhiệm vai trò sản xuất workflow từ mô tả kịch bản.

## 5. Cross-Skill
Khi chuyển đổi từ Test Case thành Workflow, hãy xem skill `test-cases` để hiểu cách phân tích yêu cầu → sinh test case → convert sang workflow.