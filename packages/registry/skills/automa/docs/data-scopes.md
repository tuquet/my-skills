---
name: automa-data-scopes
description: Guide on Variable interpolation, Global Data, and Trigger Parameters for reusable workflows
---

# Automa Data Scopes & Best Practices

Understanding how data flows through an Automa workflow is crucial for building modular, reusable, and robust automations. This guide breaks down the core data scopes: **Trigger Parameters (Variables)** and **Global Data**.

## 1. Trigger Parameters (Variables)
**Dynamic, Per-Execution Input**

When you define parameters in the `trigger` block, you are declaring dynamic inputs that the user (or caller workflow) must provide at runtime.

### How it works under the hood
*   **1:1 Mapping:** Trigger Parameters are just **Variables**. When the engine starts or hits a `parameter-prompt`, whatever the user inputs is injected directly into `referenceData.variables`. 
*   **Variable Assignment:** If you define a parameter named `searchQuery`, it is stored in `variables["searchQuery"]`.
*   **Dynamic Creation:** Blocks like `get-text` or `javascript-code` (`automaSetVariable('name', value)`) can overwrite these variables or create new ones mid-execution.

### Syntax for Accessing
Use the Mustache syntax to read variables in any block field:
*   Standard evaluation: `{{variables.searchQuery}}`
*   In JavaScript expressions (prefix `!!`): `!!{{variables@searchQuery}} * 2` (The engine replaces `@` with `.` when evaluating).

### Best Practices for Variables
*   **Never Hardcode:** Use parameters for URLs, credentials, or search terms (`{{variables.targetUrl}}`).
*   **Naming Convention:** Avoid spaces or special characters in parameter names. Use camelCase or snake_case (e.g., `userEmail`).
*   **Modular Sub-workflows:** Use the `execute-workflow` block to call sub-workflows. By enabling **"Insert Variables"**, the parent workflow injects its current `variables` state into the child, acting like function arguments!

---

## 2. Global Data
**Static, Workflow-Level Configuration**

`globalData` is a static JSON store bound to a single workflow. It acts like an environment file (`.env`) for your workflow.

### How it works under the hood
*   **Preloaded Default Values:** In the Workflow Settings UI (Global Data section), you provide a valid JSON string (e.g., `{"baseUrl": "https://example.com"}`).
*   **Fresh on Every Run:** Each time the workflow runs, this JSON is parsed and injected into `referenceData.globalData`. It does *not* dynamically persist state across executions (it's not a database).
*   **Workflow Isolation:** It is isolated to the specific workflow, though a parent `execute-workflow` block can choose to merge or insert its `globalData` into a child workflow (`insertAllGlobalData`).

### Syntax for Accessing
*   Standard evaluation: `{{globalData.baseUrl}}`
*   In JavaScript expressions: `!!{{globalData@baseUrl}} + '/api/v1'`

### Best Practices for Global Data
*   **Configurations & Constants:** Use `globalData` to store API keys, base URLs, CSS selector prefixes, or static configurations that don't change per run but might need updating globally across the workflow later.

---

## Summary: When to use what?

| Feature | `globalData` | `trigger.parameters` (Variables) |
| :--- | :--- | :--- |
| **Purpose** | Configurations, Constants, Default States | User Inputs, Webhook Payloads, Mid-flow Data |
| **Lifecycle** | Static (Preloaded from Workflow Settings) | Dynamic (Injected per execution or mid-execution) |
| **Syntax** | `{{globalData.key}}` | `{{variables.key}}` |
| **Use Case** | `{"baseUrl": "api.example.com", "maxRetries": 3}` | Username, password, specific search term for this run |
