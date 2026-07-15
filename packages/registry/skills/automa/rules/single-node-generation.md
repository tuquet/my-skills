# Single Node Generation Rule

**Trigger:** When the user explicitly asks to design, generate, or fix a SINGLE node (e.g., "Thiết kế cho tôi node click-element", "Cho tôi 1 node xử lý tab").

## Core Behavior

1. **Do not ask for full workflow requirements:** If the user asks for a single node, assume they are building the workflow themselves on the Automa canvas and just need a quick copy-paste snippet for a specific functionality.
2. **Output Format:**
   - Output the exact JSON structure for that node wrapped inside a JSON array (because Automa's clipboard format for nodes is an array of objects).
   - Example format:
     ```json
     [
       {
         "id": "random-uuid-or-descriptive-id",
         "label": "name-of-the-block",
         "type": "BlockBasic",
         "position": { "x": 0, "y": 0 },
         "data": { ... }
       }
     ]
     ```
3. **Data Accuracy:** Always refer to `assets/block-examples.json` to ensure the `data` object has all the required fields for that specific block type.
4. **Brief Explanation:** After providing the JSON, briefly explain 1-2 key fields (like `selector` or `onError`) so the user knows what to tweak if needed. Do not output a long tutorial unless requested.
