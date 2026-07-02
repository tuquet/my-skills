---
name: automa-workflow-best-practices
description: Guidelines for creating, editing, and reviewing Automa JSON workflows. Trigger: automa, workflow json, automa json, review workflow.
crossSkills: [test-cases]
---

# Automa Workflow Best Practices

Automa Workflows require absolute precision regarding Data Structure (Schema) and strict adherence to Business Logic. This SKILL is designed in Modules to help Agents easily look up knowledge.

## 1. Core Rules (Mandatory Rules)
When participating in building or reviewing a workflow, you MUST strictly COMPLY with the following rules:
- **[Anti-patterns](file:///D:/Repository/my-skills/packages/registry/skills/automa/rules/anti-patterns.md)**: A list of basic mistakes (missing label, redundant element-exists, hardcode...) that must be strictly avoided.
- **[DOM Selection](file:///D:/Repository/my-skills/packages/registry/skills/automa/rules/dom-selection.md)**: Guidelines for accurate Selector extraction (prioritizing XPath).
- **[Workflow Review Checklist](file:///D:/Repository/my-skills/packages/registry/skills/automa/rules/workflow-review.md)**: Mandatory self-check steps before finalizing a workflow.

## 2. Documentation (Knowledge Base)
- **[Blocks Usage (Semantics)](file:///D:/Repository/my-skills/packages/registry/skills/automa/docs/blocks-usage.md)**: Explains the role and usage of each block in business logic.
- **[Knowledge Base (Q&A)](file:///D:/Repository/my-skills/packages/registry/skills/automa/docs/qa-knowledge.md)**: Common patterns, sub-workflow, loop, variable injection, logging.

## 3. Schemas & Assets (Data Standards)
- **[JSON Schema (Data Types)](file:///D:/Repository/my-skills/packages/registry/skills/automa/schemas/automa.schema.json)**: Source of Truth to ensure the output JSON format is 100% valid.
- **[Baseline Template](file:///D:/Repository/my-skills/packages/registry/skills/automa/assets/baseline.json)**: Standard boilerplate to start initializing every new workflow.
- **[Block Examples](file:///D:/Repository/my-skills/packages/registry/skills/automa/assets/block-examples.json)**: Exact real-world data structures for all node blocks to prevent missing fields.

## 4. Agents (Agent Configuration Templates)
- **[Workflow Generator Prompt](file:///D:/Repository/my-skills/packages/registry/skills/automa/agents/workflow-generator.yml)**: Specialized System prompt for the Agent in charge of producing workflows from scenario descriptions.

## 5. Cross-Skill
When converting from Test Case to Workflow, please refer to the `test-cases` skill to understand how to analyze requirements → generate test cases → convert to workflows.