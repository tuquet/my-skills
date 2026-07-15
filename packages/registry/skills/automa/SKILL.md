---
name: automa
description: "Guidelines for creating, editing, and reviewing Automa JSON workflows. Trigger: automa, workflow json, automa json, review workflow, branching test, test package, multiple outputs."
---

# Automa Workflow Best Practices

Automa Workflows require absolute precision regarding Data Structure (Schema) and strict adherence to Business Logic. This SKILL is designed in Modules to help Agents easily look up knowledge.

## 1. Core Rules (Mandatory Rules)
- **[Anti-Patterns](./rules/anti-patterns.md)**: Common logical mistakes to avoid.
- **[DOM Selection Rules](./rules/dom-selection.md)**: Strategy for resolving exact UI elements.
- **[Single Node Generation](./rules/single-node-generation.md)**: Rules for answering requests that ask for exactly 1 workflow node.
- **[Workflow Review Checklist](./rules/workflow-review.md)**: Quality assurance step.
- **[Programmatic Injection](./docs/programmatic-injection.md)**: Guide on how to dynamically inject visual node blocks into existing workflows using Node.js.

## 2. Documentation (Knowledge Base)
- **[Blocks Usage (Semantics)](./docs/blocks-usage.md)**: Explains the role and usage of each block in business logic.
- **[Advanced Blocks](./docs/advanced-blocks.md)**: Guide on Loops (`loop-elements`, `loop-data`), Data Tables, Google Sheets syncing, and Branching Logic (`conditions`).
- **[Ant Design Vue & SPA Interaction](./docs/ant-design-vue-interaction.md)**: Vital techniques for interacting with Virtual DOM, robust UI selection, bypassing framework interception, and dealing with complex elements like `ant-select`, `ant-picker`, and `ant-drawer`.
- **[Self-Healing Workflows](./docs/self-healing.md)**: Design patterns for error recovery, retries, fallbacks, and defensive DOM operations.

## 3. Schemas & Assets (Data Standards)
- **[Workflow Schema](./schemas/automa.schema.json)**: Source of Truth to ensure the output JSON format for Workflows is 100% valid.
- **[Package Schema](./schemas/package.schema.json)**: Source of Truth for generating reusable Automa Packages (Custom Blocks with multiple outputs).
- **[Baseline Template](./assets/baseline.json)**: Standard boilerplate to start initializing every new workflow.
- **[Block Examples](./assets/block-examples.json)**: Exact real-world data structures for all node blocks to prevent missing fields.

## 4. Agent Workflow Guidelines (Recommended Flow)
When asked to create or modify an Automa Workflow, the Agent MUST follow this workflow:
1. **Design Reuse & Resilience**:
   - Sketch out the workflow logic (use ASCII diagrams).
   - Parameterize all inputs under `trigger.parameters`. Absolutely no hardcoded credentials or environment URLs.
   - Anticipate failures by using self-healing patterns (e.g. `onError: "fallback"`, wait selectors).
2. **Implement in Local Vault**:
   - Write/edit JSON files inside `<vaultPath>/<projectName>/workflows/` or `/packages/`.
   - Use standard selectors (refer to `dom-selection.md`). Do not guess selectors without actual HTML.
3. **Validate with CLI Linter**:
   - Run `npx automa-cli lint --project=<projectName>` (or `npm run lint` inside the vault) to statically validate nodes, edges, schemas, and verify that all interpolated variables are declared.
4. **Auto-Align & Push**:
   - Run `npx automa-cli push --project=<projectName>` (or `npm run push` inside the vault) to automatically calculate node positions (using Dagre) and seed/synchronize files with the target Database.

## 5. Prompt Templates (User Interfaces)
- **[Workflow Request Form](./templates/workflow_request.md)**: **STRICT RULE**: When a user asks you to create a workflow, you MUST ensure they have provided the information listed in this template. If they do not provide exact DOM selectors, you MUST ask them to fill out this template or provide the selectors before you generate the JSON. Never guess or hallucinate DOM selectors.

## 6. Cross-Skill
When converting from Test Case to Workflow, please refer to the `test-cases` skill to understand how to analyze requirements → generate test cases → convert to workflows.