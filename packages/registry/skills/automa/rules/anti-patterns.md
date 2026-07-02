---
name: automa-anti-patterns
description: Common mistakes when creating Automa workflows
---

# Common Mistakes / Anti-patterns

When building Automa workflows, strictly avoid the following mistakes:

| Mistake | Why it is wrong | Correct approach |
|---------|-----------------|------------------|
| Leaving edge `label` empty | Agent/reader cannot understand the flow | Always write a label: `"Finished filling → submit"` |
| Generic node `description`: `"Open tab"` | Unclear what this node does in the business logic | `"Open login tab {{$params.url}} to start logging in"` |
| Hardcode password in node | Exposes information, cannot be reused | Declare in `trigger.parameters`, use `{{variables.password}}` |
| Adding `element-exists` before `event-click` | The `event-click` block already has `waitForSelector` to self-check | Only use `element-exists` when needing to **branch** (exists → A, does not exist → B) |
| Guessed selector: `input.emailll` | Actual DOM often differs from expectation | Inspect actual DOM, prioritize XPath |
| Conditions only have 1 output branch | Errors are unhandled, workflow hangs | Always connect both output-1 (true) and output-2 (false) |
| `new-tab` without `waitTabLoaded: true` | Subsequent blocks run when the page hasn't loaded → fail | Always set `"waitTabLoaded": true` |
| `delay.time` is string `"1000"` | Engine might not parse it correctly | Must always be a number: `1000` |
| `drawflow` is a string (copied from export file) | Newly created workflows cannot load | When creating new, `drawflow` is an **object** `{ nodes, edges }` |
