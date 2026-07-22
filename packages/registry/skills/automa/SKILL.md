---
name: automa
description: "Guidelines for creating, editing, and reviewing Automa JSON workflows. Trigger: automa, workflow json, automa json, review workflow, branching test, test package, multiple outputs."
---

# Automa Workflow Best Practices

Automa Workflows require absolute precision regarding Data Structure (Schema) and strict adherence to Business Logic. This SKILL is designed in Modules to help Agents easily look up knowledge.

## 1. Master Handbook (Knowledge Base)
- **[Automa Master Handbook](./references/automa-handbook.md)**: The single source of truth containing all Rules, Anti-Patterns, DOM Selection Strategies, Advanced Blocks, and Self-Healing principles. Agents MUST read this handbook if they are unsure about any Automa logic.

## 3. Schemas & Assets (Data Standards)
- **[Workflow Schema](./schemas/automa.schema.json)**: Source of Truth to ensure the output JSON format for Workflows is 100% valid.
- **[Package Schema](./schemas/package.schema.json)**: Source of Truth for generating reusable Automa Packages (Custom Blocks with multiple outputs).

## 4. Agent Workflow Guidelines (Recommended Flow)
When asked to create or modify an Automa Workflow, the Agent MUST follow this workflow:
1. **Design & Plan**:
   - Sketch out the workflow logic (use ASCII diagrams if complex).
   - Parameterize all inputs under `trigger.parameters`. Absolutely no hardcoded credentials or environment URLs.
   - Anticipate failures by using self-healing patterns (e.g. `onError: { enable: true, toDo: "fallback" }`, wait selectors).
2. **Generate JSON**:
   - Generate the workflow strictly following the `automa.schema.json`.
   - Never guess DOM selectors without actual HTML context. 
3. **Validate with Skill Linter**:
   - Before delivering the final JSON to the user, the Agent MUST run the local skill linter to statically validate nodes, edges, schemas, and variables.
   - Command: `node <skillPath>/scripts/lint_automa.js <target_json_file>`
4. **Deliver to User**:
   - Save the valid JSON to the user's requested path or provide it for import.

## 5. Prompt Templates (User Interfaces)
- **[Workflow Request Form](./templates/workflow_request.md)**: **STRICT RULE**: When a user asks you to create a workflow, you MUST ensure they have provided the information listed in this template. If they do not provide exact DOM selectors, you MUST ask them to fill out this template or provide the selectors before you generate the JSON. Never guess or hallucinate DOM selectors.