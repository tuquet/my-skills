---
name: test-cases
description: "Xây dựng, quản lý test cases, và triển khai automation test workflows. Trigger: test case, automation test, branching test, test scenario, q&a test."
---
# Test Cases & Automation Strategies

Kỹ năng này cung cấp các nguyên tắc và pattern chuẩn để phân tích yêu cầu, xây dựng test case và chuyển đổi chúng thành Automation Workflows.

## 1. Test Case Branching Pattern (Automa Packages)
**Keywords to trigger this pattern:** `branching test`, `test package`, `multiple outputs`, `test outcomes`, `login test branching`, `test scenarios`.

Khi thiết kế Automation Test trên nền tảng Automa, thay vì sử dụng các chuỗi `Conditions` (If/Else) phức tạp và rối rắm để kiểm tra kết quả, hãy sử dụng **Custom Packages** như một **"Bộ chia luồng Test Case" (Test Case Branching Router)**.

### Cơ chế hoạt động:
1. **Đóng gói Logic:** Gói gọn toàn bộ logic của một Test Scenario (ví dụ: Submit form Login) vào một Custom Package Block duy nhất.
2. **Khai báo Multiple Outputs:** Định nghĩa nhiều cổng đầu ra (Source Handles) tương ứng với từng kết quả (Test Outcomes) có thể xảy ra của Test Case.
   - 🟢 `output-success`: Nối vào luồng "Test Passed / Ghi log thành công"
   - 🔴 `output-failed`: Nối vào luồng "Test Failed / Chụp ảnh màn hình lỗi"
   - 🟡 `output-wrong-pass`: Nối vào luồng "Validation Error Log"
   - 🟠 `output-network-error`: Nối vào luồng "Retry Logic"
3. **Trực quan hóa:** Trên giao diện Automa Workflow, tester có thể nhìn thấy rõ ràng các hướng rẽ của kịch bản test và dễ dàng kéo dây nối (edges) từ từng kết quả đến các hành động tương ứng.

Mô hình này giúp Workflow trở nên cực kỳ gọn gàng, dễ maintain và đúng bản chất của Visual Flow-based Testing.
