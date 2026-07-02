---
name: automa-self-healing
description: Design patterns and best practices for building resilient, self-healing workflows
---

# Building Self-Healing Workflows

A production-grade Automa workflow must anticipate and gracefully handle failures (e.g., dynamic UI changes, missing DOM elements, network latency, or bad payloads) without crashing the entire automation pipeline. 

This guide details the core mechanisms available in Automa to build resilient, **self-healing** workflows.

---

## 1. Block-Level Error Handling (`onError`)

Every executable block in Automa contains an `onError` property. By default, most blocks are set to `"stop-workflow"`. To build a self-healing pipeline, you must override this behavior on critical or risky blocks (like web scraping or API calls).

### Available `onError` Strategies:
*   `"stop-workflow"` (Default): The workflow fails and stops immediately. Use this only for fatal errors where continuing would cause data corruption.
*   `"continue"`: Ignores the error and proceeds to the next block as if nothing happened.
    *   *Use Case*: Clicking a "Close Ad" popup button. If the ad isn't there, it errors out, but the workflow should just continue.
*   `"fallback"`: Routes execution to a secondary branch specifically designed to handle the error.
    *   *Use Case*: If `get-text` fails to find a price element on a product page, the `fallback` edge routes to a `javascript-code` block that manually inserts `null` or `0` into the data table, ensuring the final Google Sheets export remains structurally intact.

### How to use `fallback` routing:
When a block is configured with `onError: "fallback"`, a special output node (the red handle) becomes active. You **must** connect this handle to your recovery block (e.g., a `note`, a `javascript-code` block to reset variables, or an `execute-workflow` block to notify an admin).

---

## 2. Defensive DOM Operations (Wait & Verify)

Web pages are inherently unpredictable. A selector that worked yesterday might load 3 seconds slower today due to network latency.

### The Wait For Selector Pattern
**Never assume an element exists immediately.** On blocks that interact with the page (`event-click`, `get-text`, `forms`), always:
1.  Set `waitForSelector: true`
2.  Set a safe `waitSelectorTimeout` (e.g., `5000` to `10000` milliseconds).

### The "Check First" Pattern (`element-exists`)
If a workflow needs to perform a massive branch of logic depending on the UI state (e.g., "Is the user logged in or logged out?"):
1.  Use the `element-exists` block to check for the presence of the User Avatar.
2.  Route the `fallback` output to the Login Sub-workflow.
3.  Route the primary output to the Main Dashboard logic.

---

## 3. Conditional Fallbacks & Polling (`conditions`)

When checking the status of variables or the DOM, the `conditions` block acts as the traffic controller.

### Preventing Dead-Ends
A massive anti-pattern in Automa is failing to connect the `fallback` port on a `conditions` block. If no conditions match and `fallback` is disconnected, the workflow enters a "Dead-End" and hangs. **Always route the fallback**, even if it just points to a block that logs a safe warning.

### Retry Logic (Polling)
If a condition evaluates variables populated by a slow asynchronous webhook or page load, don't immediately route to fallback. 
*   Enable `retryConditions: true`.
*   Configure `retryCount` (e.g., 5).
*   Configure `retryTimeout` (e.g., 2000ms).
This forces the engine to repeatedly test the condition before finally giving up and taking the fallback path, effectively creating an auto-polling self-healing loop.

---

## 4. Sub-Workflow Recovery (`execute-workflow`)

For enterprise pipelines, failures should be logged and escalated rather than silently ignored.

If a critical pipeline (e.g., scraping a competitor's pricing) fails on the core logic:
1.  Set the parent block's `onError` to `"fallback"`.
2.  Route the fallback edge into an `execute-workflow` block.
3.  Have the `execute-workflow` block call a dedicated **"Alerting Workflow"**.
4.  Pass the error details into the Alerting Workflow via `Insert Variables` (e.g., `automaSetVariable('error_log', 'Failed on block X')`).
5.  The Alerting Workflow triggers a Slack Webhook or Email to notify the engineering team, while the parent workflow safely halts.

---

## 5. JavaScript Sandbox Recovery

When writing custom `javascript-code`, wrap risky logic in a `try...catch` block. If parsing JSON or manipulating strings fails, catch the error and route cleanly using `automaNextBlock`.

```javascript
try {
  const rawData = automaRefData('variables', 'api_response');
  const parsed = JSON.parse(rawData);
  automaSetVariable('extractedId', parsed.data.id);
  
  // Success, continue normally
  automaNextBlock(); 
} catch (error) {
  // Graceful degradation: Log the error and move to the fallback port
  console.error("Failed to parse API response", error);
  automaNextBlock({ $error: true, message: error.message });
}
```
*Note: Passing `{ $error: true }` to `automaNextBlock` forces the JS block to exit via its `fallback` connection.*
