---
name: automa-advanced-blocks
description: Guide on Advanced Blocks including Loops, Data Tables, Google Sheets, and Conditions
---

# Advanced Blocks: Loops, Tables & Conditions

To build resilient, scalable data extraction pipelines in Automa, you must master branching (`conditions`), iteration (`loop-data`, `loop-elements`), and data management (`insert-data`, `google-sheets`).

---

## 1. Branching with Conditions (`conditions`)

The `conditions` block dynamically routes the workflow based on logical expressions. It evaluates an array of branches (e.g., `output-1`, `output-2`) from top to bottom.

### Core Mechanics
*   **First Match Wins**: The engine stops evaluating at the first branch that evaluates to `true` and routes the execution specifically to that block's output port.
*   **Logical AND**: Inside a single branch, you can have multiple items (e.g., `value` and `compare`). They are evaluated sequentially and all must pass.
*   **The Fallback Edge**: If NO conditions are met, Automa routes to the `fallback` output ID. **CRITICAL: You must always connect a block to the fallback node.** If there is no connection on the fallback port, the workflow will reach a dead-end and silently hang or crash.

### Best Practices
*   **Retry Logic**: For asynchronous checks (e.g., waiting for a dynamically rendered element to exist), utilize `retryConditions: true`, `retryCount`, and `retryTimeout` rather than instantly failing over to the fallback.
*   **Type Coercion**: Ensure you compare apples to apples by using type casting prefixes (e.g., `"number::100"`) when evaluating variables.

---

## 2. Iteration (Loops)

Automa manages loops through a triad of blocks, managed via a unique `loopId`. 

### `loop-data` & `loop-elements`
*   **`loop-data`**: Iterates through structured arrays (JSON data, numbers, internal table, Google Sheets rows).
*   **`loop-elements`**: Iterates through a physical NodeList of DOM elements on the active tab. It natively supports lazy-loading (pagination) via the `loadMoreAction` (scroll/click) property.

### `loop-breakpoint`
*   **Mandatory Closing Block**: Every loop branch must end with a `loop-breakpoint` block that references the same `loopId`. 
*   This block signals the engine to either `continue` (increment index and loop again) or `break` (exit the loop and clear state). 
*   **Flow Structure**: You must connect an edge *from* the `loop-breakpoint` *back* to the original `loop-data`/`loop-elements` block to physically close the loop.

### Interpolation Variables
During a loop, the engine injects state variables:
*   `{{loopData.myLoop.data}}`: Retrieves the raw value of the current iteration.
*   `{{loopData.myLoop.$index}}`: Retrieves the current iteration index (0-based).
*   `{{loopData@myLoop}}`: A special syntax used in CSS selectors during `loop-elements`. Instead of querying the whole document (`document.querySelector`), this restricts the selector context strictly to the current DOM element being iterated over (e.g., `{{loopData@myLoop}} > h2.title`).

---

## 3. Data Extraction Pipeline (Tables & Sheets)

Automa uses an internal **Table (Data Columns)** as a temporary database for the lifecycle of a workflow execution. 

### Inserting Data
1.  **Automatic Extraction**: Blocks like `get-text` or `attribute-value` have a `saveData: true` parameter. When enabled, you specify a `dataColumn` name, and the scraped value is instantly appended to the current row.
2.  **Explicit Insertion**: The `insert-data` block allows you to construct a completely custom row (using `{ column, value }` pairs) and append it to the table manually.

### Data Cleanup
If you need to sanitize data (e.g., stripping '$' signs or whitespace) before inserting:
*   Use `get-text` to assign the raw text to a variable (`assignVariable: true`).
*   Format the variable using `regex-variable` or `javascript-code`.
*   Finally, use `insert-data` to save the clean variable into the Table.

### Exporting & Syncing
*   **`export-data`**: Exports the internal table to disk (CSV, JSON). Enables `addBOMHeader` for Excel compatibility.
*   **`google-sheets`**: Appends or overwrites the internal table (`data-columns`) directly to a remote spreadsheet using `insertDataOption: "INSERT_ROWS"`.

### 🚨 Critical Anti-Pattern: Network Calls Inside Loops
**NEVER** place an `export-data` or `google-sheets` block *inside* your extraction loop. 
*   Doing so will fire an API call for every single row you scrape, leading to heavy rate-limiting and incredibly slow execution.
*   **Correct Pattern**: Use the loop exclusively to scrape and populate the internal Table (`insert-data`). Connect the `google-sheets` block *after* the `loop-breakpoint` exits, allowing you to bulk-upload the entire table array in one single, fast API request.
