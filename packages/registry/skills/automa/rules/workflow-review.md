---
name: automa-workflow-review
description: Detailed review checklist for an Automa Workflow draft
---

# Review Checklist

When reviewing a Workflow (or before completing the initialization), the Agent must self-check against the following criteria:

1. **Structure Check**: Are the nodes logical for the business requirement? Do not enforce a loop if it is not truly necessary (a one-time task does not need a loop block).
2. **Logic Check**: Are the edges following the correct flow? Are the conditions/webhook branches fully connected?
3. **Documentation Check**: Does every node/edge have a detailed `description`/`label`?
3.1. **Package Edge Check**: If using `BlockPackage`, are the handles correctly mapped to the embedded package's `inputs` and `outputs` IDs (e.g., `<nodeId>-input-<inputId>`) instead of generic `-input-1`?
3.2. **Execute Workflow Context Check**: When using `execute-workflow`, you MUST inspect the target workflow's JSON to determine if it relies on `globalData` (e.g., `{{globalData.startUrl}}`) or `variables` (e.g., `{{variables.team_id}}`). Then, explicitly pass the correct context using `insertAllGlobalData: true` or `insertAllVars: true` in the block data. NEVER hallucinate or hardcode values inside the block's `globalData` string unless explicitly required.
4. **Reusability Check**: Are all inputs fully declared in `trigger.parameters`? Absolutely no hardcoding.
5. **Redundancy Check**: Do not add `element-exists` before `element-scroll`, `forms`, `event-click` — those blocks already have `waitForSelector: true` to self-check the element. `element-exists` is only used to **branch logic** (e.g., element exists → do A, does not exist → do B).
6. **Selector Check**: Prioritize XPath, inspect actual DOM, do not guess DOM (read `dom-selection.md`).
7. **Condition Check**: `conditions` must always have both output branches (true + false). Do not miss the fallback.
8. **Resiliency & Self-Healing Check**: Does the workflow anticipate failures?
   - Are `onError: "fallback"` paths explicitly defined for critical network or DOM operations (and connected to a recovery block)?
   - Are `waitForSelector` and safe `waitSelectorTimeout` (e.g., 5000ms+) configured for dynamic elements?
   - If using `conditions`, are `retryConditions`, `retryCount`, and `retryTimeout` appropriately configured to poll for async events rather than failing instantly?
   - Do `javascript-code` blocks wrap risky parsing in `try...catch` and exit via `automaNextBlock({ $error: true })`?
