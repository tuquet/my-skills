# Cấu trúc Thư mục (Directory Structure) - Omni Extension / Automa

Dự án Omni Extension kế thừa cấu trúc từ dự án gốc Automa. Dưới đây là cây thư mục (Directory tree) mô tả tổng quan các thành phần quan trọng trong mã nguồn Extension:

```text
└── omni-extension/
    ├── package.json
    ├── tailwind.config.js
    ├── webpack.config.js
    ├── src/
    │   ├── assets/                # Chứa file CSS (tailwind, drawflow, style.css) và Fonts
    │   ├── background/            # Các file chạy ngầm của Service Worker
    │   │   ├── BackgroundEventsListeners.js
    │   │   ├── BackgroundWorkflowTriggers.js
    │   │   └── index.js
    │   ├── components/            # Vue components chính chia theo Giao diện
    │   │   ├── block/             # Các khối Node cơ bản (BlockBasic.vue, BlockGroup.vue...)
    │   │   ├── content/           # Component hiển thị trực tiếp lên DOM (ElementSelector...)
    │   │   ├── newtab/            # Giao diện Dashboard/Editor (WorkflowEditor, EditBlocks...)
    │   │   └── ui/                # Các UI Component dùng chung (UiButton, UiInput...)
    │   ├── composable/            # Reusable Vue Composables (theme, blockValidation, dialog...)
    │   ├── content/               # Content Script: tiêm vào web để tương tác DOM
    │   │   ├── blocksHandler.js   # Module quản lý việc xử lý các block trên giao diện web
    │   │   ├── elementObserver.js # Lắng nghe sự kiện DOM
    │   │   └── blocksHandler/     # Từng handler thao tác DOM (Forms, GetText, EventClick...)
    │   ├── db/                    # Chứa logic lưu trữ IndexedDB/Storage (logs.js, storage.js)
    │   ├── execute/               # File dùng để khởi chạy execution.
    │   ├── lib/                   # Thư viện ngoài (dayjs, pinia, vueI18n...)
    │   ├── locales/               # Đa ngôn ngữ (i18n: en, vi, zh,...)
    │   ├── newtab/                # Các trang chính của Extension Dashboard (Pages, Router)
    │   ├── offscreen/             # Offscreen API (cho background tab)
    │   ├── popup/                 # Giao diện Popup extension khi click icon trình duyệt
    │   ├── service/               # Tầng dịch vụ giao tiếp (Browser API, API Backend)
    │   ├── stores/                # Pinia State Management (Workflow, User, Folder...)
    │   ├── utils/                 # Hàm hỗ trợ tiện ích (helper, api, constants...)
    │   └── workflowEngine/        # Cốt lõi của Workflow (Thực thi ngầm độc lập với DOM)
    │       ├── WorkflowEngine.js  # Engine quản lý chu kỳ sống của 1 Workflow
    │       ├── WorkflowState.js   # Lưu State dữ liệu (Variables, Table, GlobalData)
    │       └── blocksHandler/     # Các handler xử lý block ngầm (Delay, JSCode, API, Tab...)
    └── utils/                     # Script tiện ích cho việc Build (build.js, webserver.js)
```

## Các Vị trí Quan trọng để Mod / Sửa lỗi
- **Thêm/sửa tính năng của một Block hiện có**: Bạn cần can thiệp ở 2 tầng:
  1. Giao diện thiết lập thông số (Settings form): Nằm ở `src/components/newtab/workflow/edit/Edit[TênBlock].vue`.
  2. Logic xử lý tính năng: Nằm tại `src/workflowEngine/blocksHandler/` (những xử lý ngầm) hoặc `src/content/blocksHandler/` (những xử lý yêu cầu tương tác DOM web).
- **Tùy biến UI/UX của Workflow Editor**: Tìm trong thư mục `src/components/newtab/workflow/`.
- **Cập nhật CSS**: `src/assets/css/` chứa các cấu hình Tailwind và CSS gốc (như css cho Node graph - `drawflow.css`).
