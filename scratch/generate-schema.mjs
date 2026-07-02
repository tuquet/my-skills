import fs from 'fs';
import path from 'path';

// Resolve paths
const sourcePath = 'D:/Repository/omnidesk/apps/omni-extension/src/utils/shared.js';
const tempPath = 'D:/Repository/my-skills/packages/registry/skills/automa/scripts/temp-shared.cjs';
const outputPath = 'D:/Repository/my-skills/packages/registry/skills/automa/references/automa.schema.json';

// Read shared.js
const content = fs.readFileSync(sourcePath, 'utf8');

// Convert export const to exports.
const cjsContent = content.replace(/export\s+const\s+/g, 'exports.');
fs.writeFileSync(tempPath, cjsContent);

// Load the tasks object
let tasks;
try {
  const shared = await import('file://' + tempPath);
  tasks = shared.default ? shared.default.tasks : shared.tasks;
} catch (e) {
  console.error("Error loading shared.js:", e);
  process.exit(1);
}

// Ensure cleanup
fs.unlinkSync(tempPath);

const blockCount = Object.keys(tasks).length;
console.log(`Validated block count: ${blockCount} blocks found.`);

if (blockCount === 0) {
  console.error("Error: No blocks found in tasks object.");
  process.exit(1);
}

function getType(value) {
  if (Array.isArray(value)) return 'array';
  if (value === null) return 'null';
  return typeof value;
}

function generateProperties(obj) {
  if (!obj || typeof obj !== 'object') return {};
  const properties = {};
  for (const [key, value] of Object.entries(obj)) {
    const type = getType(value);
    if (type === 'object') {
      properties[key] = { type: 'object', properties: generateProperties(value) };
    } else if (type === 'array') {
      properties[key] = { type: 'array' };
    } else {
      properties[key] = { type: type };
    }
  }
  return properties;
}

// Build the schema
const schema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  title: 'Automa Workflow Schema',
  type: 'object',
  properties: {
    name: { type: 'string' },
    description: { type: 'string' },
    version: { type: 'string' },
    extVersion: { type: 'string' },
    drawflow: {
      type: 'object',
      properties: {
        nodes: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              label: { 
                type: 'string', 
                enum: Object.keys(tasks),
                description: 'The identifier for the block type'
              },
              type: { type: 'string' },
              data: {
                type: 'object',
                description: 'Data payload varies by block label'
              }
            },
            required: ['id', 'label', 'data'],
            allOf: Object.entries(tasks).map(([label, taskMeta]) => ({
              if: {
                properties: { label: { const: label } }
              },
              then: {
                properties: {
                  data: {
                    type: 'object',
                    properties: generateProperties(taskMeta.data)
                  }
                }
              }
            }))
          }
        },
        edges: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              source: { type: 'string' },
              target: { type: 'string' },
              label: { type: 'string' }
            }
          }
        }
      }
    }
  }
};

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, JSON.stringify(schema, null, 2));

console.log(`Successfully generated JSON Schema with ${blockCount} blocks mapping at ${outputPath}.`);
