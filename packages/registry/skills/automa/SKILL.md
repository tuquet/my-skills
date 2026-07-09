---
name: automa
description: "Guidelines for creating, editing, and reviewing Automa JSON workflows. Trigger: automa, workflow json, automa json, review workflow, branching test, test package, multiple outputs."
---

# Automa Workflow Best Practices

Automa Workflows require absolute precision regarding Data Structure (Schema) and strict adherence to Business Logic. This SKILL is designed in Modules to help Agents easily look up knowledge.

## 1. Core Rules (Mandatory Rules)
- **[Anti-Patterns](./rules/anti-patterns.md)**: Common logical mistakes to avoid.
- **[DOM Selection Rules](./rules/dom-selection.md)**: Strategy for resolving exact UI elements.
- **[Workflow Review Checklist](./rules/workflow-review.md)**: Quality assurance step.
- **[Data Scopes & Parameters](./docs/data-scopes.md)**: Guide on how `globalData` and `trigger.parameters` are interpolated for reusable workflows.

## 2. Documentation (Knowledge Base)
- **[Blocks Usage (Semantics)](./docs/blocks-usage.md)**: Explains the role and usage of each block in business logic.
- **[Advanced Blocks](./docs/advanced-blocks.md)**: Guide on Loops (`loop-elements`, `loop-data`), Data Tables, Google Sheets syncing, and Branching Logic (`conditions`).
- **[Self-Healing Workflows](./docs/self-healing.md)**: Design patterns for error recovery, retries, fallbacks, and defensive DOM operations.
- **[Knowledge Base (Q&A)](./docs/qa-knowledge.md)**: Common patterns, sub-workflow, loop, variable injection, logging.

## 3. Schemas & Assets (Data Standards)
- **[Workflow Schema](./schemas/automa.schema.json)**: Source of Truth to ensure the output JSON format for Workflows is 100% valid.
- **[Package Schema](./schemas/package.schema.json)**: Source of Truth for generating reusable Automa Packages (Custom Blocks with multiple outputs).
- **[Baseline Template](./assets/baseline.json)**: Standard boilerplate to start initializing every new workflow.
- **[Block Examples](./assets/block-examples.json)**: Exact real-world data structures for all node blocks to prevent missing fields.

## 4. Agents (Agent Configuration Templates)
- **[Workflow Generator Prompt](./agents/workflow-generator.yml)**: Specialized System prompt for the Agent in charge of producing workflows from scenario descriptions.

## 6. Prompt Templates (User Interfaces)
- **[Workflow Request Form](./templates/workflow_request.md)**: **STRICT RULE**: When a user asks you to create a workflow, you MUST ensure they have provided the information listed in this template. If they do not provide exact DOM selectors, you MUST ask them to fill out this template or provide the selectors before you generate the JSON. Never guess or hallucinate DOM selectors.

## 7. Cross-Skill
When converting from Test Case to Workflow, please refer to the `test-cases` skill to understand how to analyze requirements → generate test cases → convert to workflows.