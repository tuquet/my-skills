---
name: automa-workflow-best-practices
description: Guidelines for creating, editing, and reviewing Automa JSON workflows. Trigger: automa, workflow json, automa json, review workflow.
crossSkills: [test-cases]
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
- **[Knowledge Base (Q&A)](./docs/qa-knowledge.md)**: Common patterns, sub-workflow, loop, variable injection, logging.

## 3. Schemas & Assets (Data Standards)
- **[JSON Schema (Data Types)](./schemas/automa.schema.json)**: Source of Truth to ensure the output JSON format is 100% valid.
- **[Baseline Template](./assets/baseline.json)**: Standard boilerplate to start initializing every new workflow.
- **[Block Examples](./assets/block-examples.json)**: Exact real-world data structures for all node blocks to prevent missing fields.

## 4. Agents (Agent Configuration Templates)
- **[Workflow Generator Prompt](./agents/workflow-generator.yml)**: Specialized System prompt for the Agent in charge of producing workflows from scenario descriptions.

## 5. Cross-Skill
When converting from Test Case to Workflow, please refer to the `test-cases` skill to understand how to analyze requirements → generate test cases → convert to workflows.