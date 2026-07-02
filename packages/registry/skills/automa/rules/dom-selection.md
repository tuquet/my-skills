# Hướng dẫn tìm Selector / XPath

## Quy tắc

- **Ưu tiên XPath** — chính xác hơn, hỗ trợ text, position, quan hệ phức tạp
- Nếu selector đẹp (có `id`, `data-testid`, `name`) → dùng CSS cho gọn
- **Phải unique** — xác định duy nhất 1 phần tử
- **Không suy đoán** — nếu không inspect được, báo lại ngay

---

## Cách inspect

1. `F12` → `Ctrl+Shift+C` → click phần tử
2. Copy: chuột phải Elements → **Copy → Copy XPath**
3. Kiểm tra Console:
```js
$x("//*[@id='root']/div[2]/form/input[1]")
```

---

## Khi nào dùng XPath / CSS?

| Tình huống | Dùng | Ví dụ |
|-----------|------|-------|
| Có `id`, `data-testid`, `name` | CSS | `#username`, `[data-testid="btn"]` |
| Tìm theo **text** | XPath | `//button[contains(text(),'Login')]` |
| Tìm theo **vị trí** | XPath | `(//div[@class='item'])[3]` |
| Attribute chứa chuỗi động | XPath | `//a[starts-with(@href, '/product/')]` |
| Quan hệ cha-con xa | XPath | `//form[@id='login']//input[@type='submit']` |
| Class ổn định | CSS | `.btn-primary` |
| Class dễ thay đổi | XPath | `//*[contains(@class, 'btn') and contains(@class, 'primary')]` |

---

## Chiến lược tìm Unique XPath

### Cấp 1: ID cha + tag + attribute
```xpath
//*[@id='login-form']//input[@type='email']
//form[@id='search']//button[@type='submit']
```

### Cấp 2: Attribute ổn định
```xpath
//button[@data-testid='submit']
//input[@name='email']
//a[@href='/dashboard']
```

### Cấp 3: Text content
```xpath
//button[text()='Đăng nhập']
//span[contains(text(),'Giỏ hàng')]
```

### Cấp 4: Class + vị trí
```xpath
(//div[@class='product-item'])[1]//a
//ul[@class='nav']/li[3]/a
```

### Cấp 5: Role / aria
```xpath
//*[@role='dialog']//button[@aria-label='Close']
```

---

## Kiểm tra nhanh

```js
// CSS — phải ra 1 element, không null
document.querySelector('#my-id')

// XPath — phải ra 1 element
$x("//button[contains(text(),'Login')]")[0]
```

---

## Báo lỗi đúng cách

Nếu không inspect được DOM thực tế:

> "Không thể xác định selector — cần truy cập trang để inspect DOM. Đề xuất dùng interaction-block hoặc parameter-prompt để người dùng tự nhập."

Luôn bật `waitForSelector: true` + `waitSelectorTimeout: 5000` trên các block DOM.