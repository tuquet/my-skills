# Q&A on Automa Workflow

## 1. JSON Structure

### Q: What is the structure of the .automa.json file?

### Q: What is the structure of the .automa.json file?

```json
{
  "id": "workflow-uuid",
  "name": "Workflow name",
  "drawflow": {
    "nodes": [],
    "edges": [],
    "position": [0, 0],
    "viewport": { "x": 0, "y": 0, "zoom": 1 },
    "zoom": 1
  },
  "settings": { "execContext": "popup", "onError": "stop-workflow" },
  "global_data": "{\"loggingUrl\":\"https://server.com/logs\"}"
}
```

**Formatting rules:**
- `drawflow`, `settings` → **object** (not stringified)
- `global_data` → **string** (JSON.stringify)
- Fields `table`, `version`, `extVersion`, `trigger`, `icon`, `description` → optional, see the template at `../assets/baseline.json`

### Q: What does a node consist of?

```json
{
  "id": "node-uuid",
  "label": "trigger",
  "type": "BlockBasic",
  "position": { "x": 100, "y": 200 },
  "data": { }
}
```

| Field | Required | Description |
|--------|----------|-------|
| `id` | Yes | Unique UUID in the workflow |
| `label` | Yes | Block name (kebab-case), determines functionality |
| `type` | Yes | Always `"BlockBasic"` (or `"BlockDelay"`, `"BlockLoopBreakpoint"`) |
| `position` | Yes | Canvas coordinates `{x, y}` |
| `data` | Yes | Parameter configuration. Varies by label |

### Q: How do edges connect nodes?

```json
{
  "source": "node-A-uuid",
  "sourceHandle": "-output-1",
  "target": "node-B-uuid",
  "targetHandle": "-input-1"
}
```

**Multiple output ports:**
- `conditions`: output-1 (true), output-2 (false / fallback)
- `webhook`: output-1 (success), output-2 (failure)
- `element-exists`: output-1 (exists), output-2 (does not exist)
- Other blocks: only output-1

---

## 2. Variables and Interpolation

### Q: What types of variables are there in a workflow?

| Syntax | Description | Example |
|---------|-------|-------|
| `{{variableName}}` | Standard variable | `{{username}}` |
| `{{$params.<id>}}` | Parameter from trigger | `{{$params.url}}` |
| `{{$tabUrl}}` | Current tab URL | `{{$tabUrl}}` |
| `{{$workflowName}}` | Workflow name | `{{$workflowName}}` |
| `{{$timestamp}}` | Execution time | `{{$timestamp}}` |
| `{{loopData.<loopId>.data}}` | Value inside a loop | `{{loopData.items.data}}` |
| `{{loopData@<loopId>}}` | Current DOM element | `{{loopData@items}} > div` |
| `{{$globalData.<key>}}` | Global data | `{{$globalData.loggingUrl}}` |

### Q: How is variable interpolation used in selectors?

Example with `loop-elements`:

```json
{
  "label": "get-text",
  "data": {
    "selector": "{{loopData@loop-items}} .title",
    "assignVariable": true,
    "variableName": "itemTitle"
  }
}
```

`loopData@loop-items` references the current DOM element within the loop.

---

## 3. Conditions (Branching)

### Q: How can I properly use the conditions block?

The `conditions` block allows branching the execution flow based on variable value checks.

```json
{
  "label": "conditions",
  "data": {
    "conditions": [
      { "id": "ok", "variable": "loginStatus", "comparison": "equals", "value": "success" }
    ]
  }
}
```

**Comparison operators:**

| `comparison` | Meaning | Example |
|-------------|---------|-------|
| `equals` | Equals | `"variable":"role","value":"admin"` |
| `not-equals` | Not equals | `"variable":"status","value":"error"` |
| `greater-than` | Greater than (number) | `"variable":"price","value":"100000"` |
| `less-than` | Less than (number) | `"variable":"count","value":"5"` |
| `contains` | Contains string | `"variable":"$tabUrl","value":"dashboard"` |
| `starts-with` | Starts with | `"variable":"email","value":"admin"` |
| `ends-with` | Ends with | `"variable":"file","value":".pdf"` |
| `empty` | Is empty | `"variable":"result","comparison":"empty"` |
| `not-empty` | Is not empty | `"variable":"errors","comparison":"not-empty"` |

**How to connect edges:**
- **output-1**: when at least 1 condition is true
- **output-2**: when no condition is true (else / fallback)

> **Always have a fallback branch.** Do not omit output-2 — otherwise, errors will not be handled.

### Q: How to check if an element exists for branching?

Use the `element-exists` block + `conditions`:

```json
[
  {
    "id": "n-check",
    "label": "element-exists",
    "data": { "selector": ".error-message", "timeout": 3000 }
  },
  {
    "id": "n-branch",
    "label": "conditions",
    "data": {
      "conditions": [
        { "id": "hasError", "variable": "$elementExist", "comparison": "equals", "value": "true" }
      ]
    }
  }
]
```

- output-1 (element-exists) → n-branch
  - output-1 (conditions): has error → handle error
  - output-2 (conditions): no error → continue

> **Important**: `element-exists` is only used for **branching** (has element → A, does not have element → B). You do not need `element-exists` before `element-scroll`, `forms`, `event-click` because those blocks already have `waitForSelector: true` to automatically check for the element before interacting.

### Q: How to create more than 2 branches?

Stack multiple `conditions` blocks in sequence:

```text
[conditions: price > 1M] ──output-1──→ [handle high price]
        │
        └──output-2──→ [conditions: price > 500k] ──output-1──→ [handle medium price]
                            │
                            └──output-2──→ [handle low price]
```

---

## 4. Execute Workflow (Sub-workflow)

### Q: What is execute-workflow and when to use it?

The `execute-workflow` block allows calling another Automa workflow as a **sub-routine**. This helps reuse logic without copy-pasting nodes.

```json
{
  "label": "execute-workflow",
  "data": {
    "workflowId": "child-workflow-uuid",
    "params": [
      { "name": "username", "value": "{{$params.fb_username}}" },
      { "name": "password", "value": "{{$params.fb_password}}" }
    ],
    "waitForResult": true,
    "assignVariable": true,
    "variableName": "loginResult"
  }
}
```

**How it works:**

```text
[parent workflow]            [child workflow]
     │                             │
     ├── call execute-workflow ───→ receive params
     │       │                     │
     │       │                     ├── process (login, scrape...)
     │       │                     │
     │       │                     └── return result
     │       │
     │   ←─── receive result
     │
     ├── use result to branch
     └── continue
```

**Use cases:**
- **Common login**: 1 shared login workflow used by multiple workflows
- **Send log**: send logs to a server
- **Export data**: export CSV/JSON to a file

**When NOT to use:**
- Sub-workflow has only 1-2 nodes (wasteful)
- Need immediate result → set `waitForResult: false`
- Child workflow needs to interact in the same tab as the parent workflow

---

## 5. Workflow Patterns

### Q: What is the basic login pattern?

```text
trigger → new-tab → forms(user) → forms(pass) → event-click → wait-connections → conditions
```

Each node needs a detailed `description`. Edges need a `label`.
The trigger must declare params `url`, `username`, `password` — do not hardcode.

Refer to the sample JSON in the `../assets/baseline.json` file.

### Q: What is the scrape (data extraction) pattern?

```text
trigger → new-tab → loop-elements → get-text → insert-data → loop-breakpoint → [back to loop]
```

- `loop-elements` iterates through a list of DOM elements
- `get-text` extracts text with dynamic selector `{{loopData@loopId}} .title`
- `insert-data` saves to a table
- `loop-breakpoint` loops back to the start

### Q: What is the form fill pattern?

```text
trigger → new-tab → forms(field1) → forms(field2) → ... → upload-file → event-click → wait-connections
```

Use a separate `forms` block for each field. Set `delay: 50` to avoid anti-bot detection. Use `clearValue: true` if the field already has a default value.

### Q: What is the test automation pattern — how to run automated test cases?

Convert test cases to workflows: each test step = 1+ blocks. Use `webhook` to send pass/fail results to a server.

```text
trigger(params) → new-tab → [test steps] → conditions(verify)
    → webhook({status:"pass", testCase:"TC-001"})
    └── webhook({status:"fail", testCase:"TC-001", error:"..."})
```

**Example: TC-001 login success → workflow**

```json
{
  "name": "TC-001 Login Success",
  "drawflow": {
    "nodes": [
      {
        "id": "n1", "label": "trigger", "type": "BlockBasic",
        "position": { "x": 100, "y": 100 },
        "data": {
          "type": "manual",
          "parameters": [
            { "id": "url", "label": "Login URL", "type": "text", "required": true },
            { "id": "email", "label": "Email", "type": "text", "required": true },
            { "id": "password", "label": "Password", "type": "text", "required": true },
            { "id": "logUrl", "label": "Report endpoint", "type": "text", "defaultValue": "https://api.test-runner.com/report" }
          ]
        }
      },
      {
        "id": "n2", "label": "new-tab", "type": "BlockBasic",
        "position": { "x": 300, "y": 100 },
        "data": { "url": "{{$params.url}}", "active": true, "waitTabLoaded": true }
      },
      {
        "id": "n3", "label": "forms", "type": "BlockBasic",
        "position": { "x": 500, "y": 100 },
        "data": { "selector": "#email", "value": "{{$params.email}}", "waitForSelector": true, "waitSelectorTimeout": 5000 }
      },
      {
        "id": "n4", "label": "forms", "type": "BlockBasic",
        "position": { "x": 500, "y": 250 },
        "data": { "selector": "#password", "value": "{{$params.password}}" }
      },
      {
        "id": "n5", "label": "event-click", "type": "BlockBasic",
        "position": { "x": 500, "y": 400 },
        "data": { "selector": "button[type='submit']", "waitForSelector": true, "waitSelectorTimeout": 5000 }
      },
      {
        "id": "n6", "label": "wait-connections", "type": "BlockBasic",
        "position": { "x": 700, "y": 400 },
        "data": { "timeout": 10000, "idleTime": 2000 }
      },
      {
        "id": "n7", "label": "conditions", "type": "BlockBasic",
        "position": { "x": 900, "y": 400 },
        "data": {
          "conditions": [
            { "id": "ok", "variable": "$tabUrl", "comparison": "contains", "value": "dashboard" }
          ]
        }
      },
      {
        "id": "n8", "label": "webhook", "type": "BlockBasic",
        "position": { "x": 1100, "y": 200 },
        "data": {
          "url": "{{$params.logUrl}}",
          "method": "POST",
          "headers": [{"name": "Content-Type", "value": "application/json"}],
          "body": "{\"testCase\":\"TC-001\",\"status\":\"pass\",\"url\":\"{{$params.url}}\"}"
        }
      },
      {
        "id": "n9", "label": "webhook", "type": "BlockBasic",
        "position": { "x": 1100, "y": 550 },
        "data": {
          "url": "{{$params.logUrl}}",
          "method": "POST",
          "headers": [{"name": "Content-Type", "value": "application/json"}],
          "body": "{\"testCase\":\"TC-001\",\"status\":\"fail\",\"error\":\"dashboard not found\"}"
        }
      }
    ],
    "edges": [
      { "source": "n1", "sourceHandle": "-output-1", "target": "n2", "targetHandle": "-input-1" },
      { "source": "n2", "sourceHandle": "-output-1", "target": "n3", "targetHandle": "-input-1" },
      { "source": "n3", "sourceHandle": "-output-1", "target": "n4", "targetHandle": "-input-1" },
      { "source": "n4", "sourceHandle": "-output-1", "target": "n5", "targetHandle": "-input-1" },
      { "source": "n5", "sourceHandle": "-output-1", "target": "n6", "targetHandle": "-input-1" },
      { "source": "n6", "sourceHandle": "-output-1", "target": "n7", "targetHandle": "-input-1" },
      { "source": "n7", "sourceHandle": "-output-1", "target": "n8", "targetHandle": "-input-1" },
      { "source": "n7", "sourceHandle": "-output-2", "target": "n9", "targetHandle": "-input-1" }
    ]
  }
}
```

**Connection with test-cases skill:** When creating test cases according to the `test-cases` skill, map the steps as follows:

| Step in Test Case | → Block |
|---|---|
| Enter email | `forms` `selector="#email"` |
| Enter password | `forms` `selector="#password"` |
| Click button | `event-click` |
| Check URL / text | `conditions` or `get-text` + `conditions` |
| Trigger params | `trigger.parameters` ← test data from Pre-conditions |

**Result:** Each test case runs as a separate workflow. The parent workflow calls `execute-workflow` for each TC. The results are sent to the server via a POST webhook.

---

## 6. Logging & Error Reporting via HTTP

### Q: How to send logs to a server when a workflow runs?

Use the `webhook` block. The endpoint URL can be configured via trigger params or globalData.

```json
{
  "label": "webhook",
  "data": {
    "url": "{{$params.logUrl}}/api/logs",
    "method": "POST",
    "headers": [{"name": "Content-Type", "value": "application/json"}],
    "body": "{\"workflow\":\"{{$workflowName}}\",\"status\":\"ok\",\"url\":\"{{$tabUrl}}\",\"time\":\"{{$timestamp}}\"}"
  }
}
```

**Webhook edge connections:**
- output-1: successful delivery → continue
- output-2: failed delivery → retry or skip

### Q: Where to store the logging URL so it's easy to change later?

**Method 1 — Trigger params (preferred):**
Declare a `logUrl` param in the trigger, default to the server URL.

**Method 2 — Global data:**
In workflow settings, set `globalData`:
```json
{ "loggingUrl": "https://your-server.com/api" }
```
Usage: `{{$globalData.loggingUrl}}`

### Q: What should a sample log payload contain?

```json
{
  "workflowName": "{{$workflowName}}",
  "status": "error",
  "error": "Selector timeout: #my-element",
  "url": "{{$tabUrl}}",
  "timestamp": "{{$timestamp}}",
  "variables": { "title": "{{title}}" }
}
```

---

## 7. Troubleshooting

### Q: Timeout error — how to handle it?

| Cause | Solution |
|-------------|-----------|
| Element has not loaded yet | Increase `waitSelectorTimeout` (5000 → 15000) |
| Page is slow due to network | Add `wait-connections` before the DOM block |
| Page uses lazy loading | Add `element-scroll` or `press-key` (PageDown) |
| Iframe hasn't loaded | Add `switch-to` before interacting |

```json
{
  "label": "wait-connections",
  "data": { "timeout": 20000, "idleTime": 3000 }
}
```

### Q: Selector fail — how to detect it?

DOM blocks (`element-scroll`, `forms`, `event-click`, `get-text`) already have `waitForSelector: true` to automatically check for elements.

If you need to **branch** when an element is not found (for example: if error message exists → report error, if not → continue), use `element-exists`:

```json
[
  {
    "id": "n1",
    "label": "element-exists",
    "data": { "selector": ".error-message", "timeout": 3000 }
  },
  {
    "id": "n2",
    "label": "log-data",
    "data": { "message": "Error detected: {{errorText}}", "level": "error" }
  }
]
```
- output-1 (exists) → handle error
- output-2 (does not exist) → continue

> If you only need to **wait** for an element to appear in order to interact with it, the `waitForSelector` of the block itself is sufficient. Do not add redundant `element-exists`.

### Q: Network / HTTP error — how to handle it?

The `webhook` block inherently has 2 output branches:
- output-1 (success): process data
- output-2 (failure): log error, retry

```json
{
  "label": "webhook",
  "data": {
    "url": "https://api.example.com/data",
    "method": "GET",
    "assignVariable": true,
    "variableName": "apiResult"
  }
}
```

### Q: Workflow hangs for unknown reasons — how to debug?

Add `log-data` at key points:

```json
[
  { "data": { "message": "Starting login...", "level": "info" } },
  { "data": { "message": "Opened tab: {{$tabUrl}}", "level": "info" } },
  { "data": { "message": "Filled user, preparing to submit", "level": "info" } }
]
```

### Q: Automatic retry on fail — how to implement?

Use `javascript-code`:

```json
{
  "label": "javascript-code",
  "data": {
    "code": "let maxRetry = 3;\nlet attempt = $retryCount || 0;\nif (attempt < maxRetry) {\n  automaSetVariable('$retryCount', attempt + 1);\n  automaNextBlock({ retry: true });\n} else {\n  automaNextBlock({ retry: false, error: 'Max retry' });\n}"
  }
}
```
- output-1: attempts remaining → return to the failed block
- output-2: no attempts remaining → log error

---

## 8. Best Practices

### Q: What does the workflow review checklist include?

1. **Structure Check**: Are the nodes appropriate for the business logic? Only add a loop if iteration is necessary.
2. **Logic Check**: Are edges following the correct flow? Are conditions/webhook branches fully connected?
3. **Documentation Check**: Does every node have a `description`, does every edge have a descriptive `label`?
4. **Reusability Check**: Are inputs declared in trigger params? Do not hardcode.
5. **Redundancy Check**: Do not add `element-exists` before blocks that already have `waitForSelector`.
6. **Condition Check**: `conditions` must always have both 2 output branches (true + false).
7. **Error Handling Check**: Do webhook, new-tab, and DOM blocks handle failures?

### Q: General advice when writing workflows?

- **Naming conventions**: Use `"node-"` + sequence number for node `id`. Use UUID for `loopId`. Use camelCase for `variableName`.
- **Error handling**: Always set `waitForSelector: true` + timeout. Webhook needs a fallback branch.
- **Optimization**: Use `loop-data` instead of `loop-elements` if an array is already available. Batch multiple DOM interactions within 1 `javascript-code` block.
- **Logging**: Send logs to the server on both success and failure branches.
- **Sub-workflow**: Extract common logic (login, export, send log) into separate workflows, and call them using `execute-workflow`.

---

## 9. How to Write Proper Descriptions for Nodes and Edges

### Q: What makes a good node description?

**NOKIA Rule:**
- **N**ame: what does this node do?
- **O**bject: which object does it interact with? (which page, element, API)
- **K**now: what does it need to know? (selector, URL, input variables)
- **I**ntent: why is this step necessary? (business purpose)
- **A**ction: what happens after this step? (result, redirect, log)

### Before-and-After Examples

| Node | Incorrect (Vague) | Correct (NOKIA) |
|------|-------------------|-------------|
| `new-tab` | `"Open new tab"` | `"Open tab navigating to login page {{$params.url}} to prepare for login with account {{$params.username}}"` |
| `forms` | `"Enter user"` | `"Fill username {{$params.username}} into field #username, using a 50ms delay to avoid anti-bot detection"` |
| `event-click` | `"Click button"` | `"Click the submit button to send the login form, then wait for redirect to dashboard"` |
| `conditions` | `"Check"` | `"Check if the URL has changed to dashboard. If true → successful login, if false → report wrong password error"` |
| `loop-data` | `"Loop"` | `"Loop {{$params.scroll_page}} times, scrolling down 1000px each time to load lazy content"` |
| `webhook` | `"Send log"` | `"Send success/fail log to server {{$params.logUrl}} for the team to monitor login success rate"` |
| `get-text` | `"Get text"` | `"Extract product title from selector .product-title in the current loop, save to itemTitle variable to insert into the table"` |
| `notification` | `"Notification"` | `"Display notification 'Finished processing {{count}} products' so the user knows the workflow has completed"` |

### Q: How to write labels for edges?

**Formula:** `[condition] → [next action]`

| Edge | Label (Incorrect) | Label (Correct) |
|------|------------|-------------|
| trigger → new-tab | `""` (empty) | `"Start opening page"` |
| forms → event-click | `""` | `"Finished filling → proceed to submit"` |
| conditions output-1 | `"True"` | `"Login successful → save session"` |
| conditions output-2 | `"False"` | `"Wrong password → report error and send log"` |
| loop → get-text | `""` | `"Finished scrolling → extract data for item {{loopIndex}}"` |
| webhook output-1 | `"OK"` | `"Log sent successfully → finish"` |
| webhook output-2 | `"Fail"` | `"Log failed to send → retry attempt {{retryCount}}"` |