# Cấu trúc Thư mục (Directory Structure) - Automa

Dự án Automa là một browser extension. Dưới đây là cây thư mục (Directory tree) mô tả tổng quan các thành phần quan trọng trong mã nguồn:

```text
├── src/
│   ├── assets/                # Chứa file CSS và Fonts
│   ├── background/            # Các file chạy ngầm của Service Worker
│   ├── components/            # Vue components chính chia theo Giao diện
│   ├── composable/            # Reusable Vue Composables
│   ├── content/               # Content Script: tiêm vào web để tương tác DOM
│   ├── db/                    # Chứa logic lưu trữ IndexedDB/Storage
│   ├── execute/               # File dùng để khởi chạy execution
│   ├── lib/                   # Thư viện ngoài
│   ├── locales/               # Đa ngôn ngữ (i18n)
│   ├── popup/                 # Giao diện Popup extension
│   ├── service/               # Tầng dịch vụ giao tiếp
│   ├── stores/                # State Management
│   ├── utils/                 # Hàm hỗ trợ tiện ích
│   └── workflowEngine/        # Cốt lõi của Workflow
└── utils/                     # Script tiện ích cho việc Build
```

## Các Vị trí Quan trọng để Mod / Sửa lỗi
- **Thêm/sửa tính năng của một Block hiện có**: Bạn cần can thiệp ở 2 tầng:
  1. Giao diện thiết lập thông số (Settings form): Tìm trong thư mục chứa Vue components của workflow editor.
  2. Logic xử lý tính năng: Nằm tại workflow engine handler (xử lý ngầm) hoặc content blocks handler (tương tác DOM web).
- **Tùy biến UI/UX của Workflow Editor**: Tìm trong thư mục workflow components của editor.
