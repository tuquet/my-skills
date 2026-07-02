---
name: automa-workflow-review
description: Detailed review checklist for an Automa Workflow draft
---

# Review Checklist

When reviewing a Workflow (or before completing the initialization), the Agent must self-check against the following criteria:

1. **Structure Check**: Are the nodes logical for the business requirement? Do not enforce a loop if it is not truly necessary (a one-time task does not need a loop block).
2. **Logic Check**: Are the edges following the correct flow? Are the conditions/webhook branches fully connected?
3. **Documentation Check**: Does every node/edge have a detailed `description`/`label`?
4. **Reusability Check**: Are all inputs fully declared in `trigger.parameters`? Absolutely no hardcoding.
5. **Redundancy Check**: Do not add `element-exists` before `element-scroll`, `forms`, `event-click` — those blocks already have `waitForSelector: true` to self-check the element. `element-exists` is only used to **branch logic** (e.g., element exists → do A, does not exist → do B).
6. **Selector Check**: Prioritize XPath, inspect actual DOM, do not guess DOM (read `dom-selection.md`).
7. **Condition Check**: `conditions` must always have both output branches (true + false). Do not miss the fallback.
8. **Error Handling Check**: Are blocks prone to errors (webhook, new-tab, DOM blocks) handled upon failure? (Use onError in the block or an edge fallback).
