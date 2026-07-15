# Interaction with Ant Design Vue (UI Automation)

When creating or fixing Automa workflows that interact with modern SPA frameworks (especially Vue.js + Ant Design Vue), agents must apply specific patterns. Native browser methods like `element.click()` or `element.value = 'abc'` frequently fail or get ignored by the Virtual DOM event listeners.

## 1. The `simulateClick` Pattern

Ant Design Vue buttons and UI components often bind listeners to `mousedown` or `pointerdown` rather than standard `click`. Always use the following `simulateClick` pattern in `javascript-code` blocks:

```javascript
const simulateClick = (element) => {
  if (!element) return;
  element.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, cancelable: true, view: window }));
  element.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true, view: window }));
  element.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, cancelable: true, view: window }));
  element.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true, view: window }));
  element.click();
};
```

**Pro-tip for Buttons:** If a button contains an inner `span` (e.g., `<button><span>Move</span></button>`), Vue sometimes registers the click on the `span`. If a click fails, ensure the button is scrolled into view and click BOTH the button and the inner `span`:
```javascript
btn.scrollIntoView({ behavior: 'smooth', block: 'center' });
setTimeout(() => {
  simulateClick(btn);
  const innerSpan = btn.querySelector('span');
  if (innerSpan) simulateClick(innerSpan);
}, 200);
```

## 2. The `simulateInput` Pattern

When you need to force a value into an `input` and ensure Vue reacts to it (e.g. updating the `v-model`), bypassing the framework's property interception is necessary:

```javascript
const simulateInput = (element, text) => {
  element.focus();
  // Bypass framework setter overrides
  const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
  if (setter) setter.call(element, text);
  else element.value = text;
  
  // Force framework reaction
  element.dispatchEvent(new Event('input', { bubbles: true }));
  element.dispatchEvent(new Event('change', { bubbles: true })); 
};
```

## 3. Working with Ant Design Select (`ant-select`)

Never try to interact with hidden, native `<select>` tags in Ant Design. You must interact with the complex DOM structure:

1. Click the selector box to open the dropdown.
2. Wait for the popup animation.
3. Fill the hidden input (if searchable).
4. Find the correct `.ant-select-item-option` from the visible dropdown.
5. Click it.

```javascript
// 1. Open Dropdown
const teamSelector = document.querySelector('.ant-select-selector');
const teamInput = document.querySelector('.ant-select-selection-search-input'); // or just 'input'
if (teamSelector && teamInput) {
  simulateClick(teamSelector);
  await sleep(1000); // Wait for popup animation
  
  // 2. Search
  simulateInput(teamInput, targetValue);
  await sleep(1000); // Wait for filter
  
  // 3. Select Option
  const options = Array.from(document.querySelectorAll('.ant-select-dropdown:not(.ant-select-dropdown-hidden) .ant-select-item-option'));
  const match = options.find(o => o.innerText.toLowerCase().includes(targetValue.toLowerCase())) || options[0];
  if (match) { 
    simulateClick(match); 
    await sleep(500); 
  }
}
```

## 4. Working with Ant Design DatePicker (`ant-picker`)

To pick "Today":
```javascript
const dateInput = document.querySelector('.ant-picker-input input');
if (dateInput) {
  simulateClick(dateInput);
  await sleep(1000); // Wait for popup
  
  const todayBtn = document.querySelector('.ant-picker-today-btn');
  if (todayBtn) { 
    simulateClick(todayBtn); 
    await sleep(500); 
  } else {
    // Fallback: Type directly
    const today = new Date().toISOString().split('T')[0];
    simulateInput(dateInput, today);
    simulateClick(document.body); // Click outside to close
  }
}
```

## 5. Drawers and Modals Animation Timing

If a workflow involves opening an `ant-drawer` or `ant-modal` and taking an action inside it (or capturing an HTML snapshot), **never** execute immediately.
You must insert a `delay` block (or `await sleep(...)`) of **at least 1500ms - 2500ms** after clicking the trigger button to ensure the DOM tree has fully mounted and transitions are complete before attempting to interact with the modal's contents.
