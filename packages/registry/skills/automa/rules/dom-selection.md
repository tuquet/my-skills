# DOM Selection / XPath Guidelines

## Rules

- **Prioritize XPath** — more accurate, supports text, position, complex relationships
- If the selector is clean (has `id`, `data-testid`, `name`) → use CSS for brevity
- **Must be unique** — uniquely identifies 1 element
- **No guessing** — if it cannot be inspected, report back immediately

---

## How to inspect

1. `F12` → `Ctrl+Shift+C` → click the element
2. Copy: Right-click in Elements → **Copy → Copy XPath**
3. Verify in Console:
```js
$x("//*[@id='root']/div[2]/form/input[1]")
```

---

## When to use XPath / CSS?

| Situation | Use | Example |
|-----------|-----|---------|
| Has `id`, `data-testid`, `name` | CSS | `#username`, `[data-testid="btn"]` |
| Find by **text** | XPath | `//button[contains(text(),'Login')]` |
| Find by **position** | XPath | `(//div[@class='item'])[3]` |
| Attribute contains dynamic string | XPath | `//a[starts-with(@href, '/product/')]` |
| Distant parent-child relationship | XPath | `//form[@id='login']//input[@type='submit']` |
| Stable class | CSS | `.btn-primary` |
| Volatile class | XPath | `//*[contains(@class, 'btn') and contains(@class, 'primary')]` |

---

## Unique XPath Strategies

### Level 1: Parent ID + tag + attribute
```xpath
//*[@id='login-form']//input[@type='email']
//form[@id='search']//button[@type='submit']
```

### Level 2: Stable attribute
```xpath
//button[@data-testid='submit']
//input[@name='email']
//a[@href='/dashboard']
```

### Level 3: Text content
```xpath
//button[text()='Login']
//span[contains(text(),'Cart')]
```

### Level 4: Class + position
```xpath
(//div[@class='product-item'])[1]//a
//ul[@class='nav']/li[3]/a
```

### Level 5: Role / aria
```xpath
//*[@role='dialog']//button[@aria-label='Close']
```

---

## Quick Validation

```js
// CSS — must return 1 element, not null
document.querySelector('#my-id')

// XPath — must return 1 element
$x("//button[contains(text(),'Login')]")[0]
```

---

## How to report errors properly

If the actual DOM cannot be inspected:

> "Cannot determine the selector — need access to the page to inspect the DOM. Recommend using interaction-block or parameter-prompt for the user to input manually."

Always enable `waitForSelector: true` + `waitSelectorTimeout: 5000` on DOM blocks.