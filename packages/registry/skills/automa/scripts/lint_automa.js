#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m'
};

const originalError = console.error;
console.error = (...args) => {
  if (typeof args[0] === 'string' && args[0].startsWith('[ERROR]')) {
    args[0] = args[0].replace('[ERROR]', `${colors.red}${colors.bold}[ERROR]${colors.reset}`);
  }
  originalError(...args);
};

const originalWarn = console.warn;
console.warn = (...args) => {
  if (typeof args[0] === 'string' && args[0].startsWith('[WARN]')) {
    args[0] = args[0].replace('[WARN]', `${colors.yellow}[WARN]${colors.reset}`);
  }
  originalWarn(...args);
};

const args = process.argv.slice(2);
const variablesDirArg = args.find(arg => arg.startsWith('--variables-dir='));
const VARIABLES_DIR = variablesDirArg ? path.resolve(variablesDirArg.split('=')[1]) : '';
const filesToLint = args.filter(arg => !arg.startsWith('--'));

let automaTasks = {};
try {
  automaTasks = require('../resources/automaTasks.json');
} catch (e) {
  console.warn(`[WARN] Could not load automaTasks.json:`, e.message);
}

let automaSchema = null;
try {
  automaSchema = require('../schemas/automa.schema.json');
} catch (e) {
  console.warn(`[WARN] Could not load automa.schema.json:`, e.message);
}



let hasError = false;

const globalVariables = new Set();
if (VARIABLES_DIR && fs.existsSync(VARIABLES_DIR)) {
  const files = fs.readdirSync(VARIABLES_DIR).filter(f => f.endsWith('.json'));
  for (const file of files) {
    try {
      const v = JSON.parse(fs.readFileSync(path.join(VARIABLES_DIR, file), 'utf8'));
      if (v.name) {
        globalVariables.add(v.name);
        globalVariables.add('$$' + v.name);
      }
    } catch (e) {}
  }
}

function validateNodeSchema(nodeData, expectedData, filePath, nodeId, label) {
  if (!expectedData || typeof expectedData !== 'object' || Array.isArray(expectedData)) return;
  if (!nodeData || typeof nodeData !== 'object' || Array.isArray(nodeData)) return;

  for (const key in expectedData) {
    if (!(key in nodeData)) {
      console.error(`[ERROR] [${path.basename(filePath)}] Node '${nodeId}' (${label}) is missing required property: 'data.${key}'. The correct schema requires this property.`);
      hasError = true;
    } else {
      const expectedType = Array.isArray(expectedData[key]) ? 'array' : typeof expectedData[key];
      const actualType = Array.isArray(nodeData[key]) ? 'array' : typeof nodeData[key];
      
      if (expectedType === 'array' && actualType !== 'array') {
        console.error(`[ERROR] [${path.basename(filePath)}] Node '${nodeId}' (${label}) property 'data.${key}' must be an array, but got ${actualType}.`);
        hasError = true;
      } else if (expectedType === 'object' && expectedData[key] !== null && actualType !== 'object') {
        console.error(`[ERROR] [${path.basename(filePath)}] Node '${nodeId}' (${label}) property 'data.${key}' must be an object, but got ${actualType}.`);
        hasError = true;
      }
    }
  }
}

function lintFile(filePath, type) {
  let content;
  try {
    content = fs.readFileSync(filePath, 'utf8');
  } catch (err) {
    console.error(`[ERROR] Cannot read file: ${filePath}`);
    hasError = true;
    return;
  }

  if (content.includes('Ã')) {
    console.error(`[ERROR] Mojibake (Encoding Error) detected in: ${filePath}`);
    hasError = true;
  }

  let data;
  try {
    data = JSON.parse(content);
  } catch (err) {
    console.error(`[ERROR] Invalid JSON format: ${filePath}`);
    hasError = true;
    return;
  }

  if (!data.description || data.description.trim() === '') {
    console.error(`[ERROR] [${path.basename(filePath)}] ${type} is missing a root 'description'.`);
    hasError = true;
  }

  const WORKFLOW_ICONS = new Set([
    'mdiPackageVariantClosed', 'riGlobalLine', 'riFileTextLine', 'riEqualizerLine',
    'riTimerLine', 'riCalendarLine', 'riFlashlightLine', 'riLightbulbFlashLine',
    'riDatabase2Line', 'riWindowLine', 'riCursorLine', 'riDownloadLine', 'riCommandLine'
  ]);

  if (!data.icon || data.icon.trim() === '') {
    console.error(`[ERROR] [${path.basename(filePath)}] Missing or empty 'icon' field.`);
    hasError = true;
  } else if (!WORKFLOW_ICONS.has(data.icon) && !data.icon.startsWith('http')) {
    console.error(`[ERROR] [${path.basename(filePath)}] Invalid icon '${data.icon}'. Must be a valid UI icon or HTTP URL.`);
    hasError = true;
  }

  let nodes, edges;
  if (type === 'Workflow') {
    if (!data.drawflow || !data.drawflow.nodes || !data.drawflow.edges) {
      console.warn(`[WARN] Missing drawflow/nodes/edges in: ${filePath}`);
      return;
    }
    nodes = data.drawflow.nodes;
    edges = data.drawflow.edges;
  } else if (type === 'Package') {
    if (!data.data || !data.data.nodes || !data.data.edges) {
      console.warn(`[WARN] Missing data/nodes/edges in: ${filePath}`);
      return;
    }
    nodes = data.data.nodes;
    edges = data.data.edges;
  }

  if (type === 'Workflow') {
    if (data.trigger && Array.isArray(data.trigger.parameters)) {
      const pNames = new Set();
      for (const p of data.trigger.parameters) {
        if (pNames.has(p.name)) {
          console.error(`[ERROR] [${path.basename(filePath)}] Duplicate parameter name '${p.name}' in trigger.parameters.`);
          hasError = true;
        }
        pNames.add(p.name);
      }
    }
    if (data.trigger) {
      const validTriggers = ['manual', 'interval', 'date', 'specific-day', 'visit-web', 'keyboard-shortcut', 'on-startup', 'context-menu'];
      if (data.trigger.type && !validTriggers.includes(data.trigger.type)) {
        console.error(`[ERROR] [${path.basename(filePath)}] Invalid trigger.type: '${data.trigger.type}'. Expected one of: ${validTriggers.join(', ')}`);
        hasError = true;
      }
      if (data.trigger.type === 'interval' && (!data.trigger.interval || data.trigger.interval <= 0)) {
        console.error(`[ERROR] [${path.basename(filePath)}] trigger.type is 'interval' but interval is invalid: ${data.trigger.interval}`);
        hasError = true;
      }
    }

    const triggerNode = nodes.find(n => n.label === 'trigger');
    const triggerParams = (triggerNode?.data?.parameters || []).map(p => p.name);
    const validLocals = new Set(triggerParams);
    
    const nodesStr = JSON.stringify(nodes);

    const setRegex = /automaSetVariable\s*\(\s*['"]([^'"]+)['"]/g;
    let setMatch;
    while ((setMatch = setRegex.exec(nodesStr)) !== null) {
      validLocals.add(setMatch[1]);
    }

    // NEW: Also check for variables assigned by nodes (like Webhook)
    nodes.forEach(n => {
      if (n.data?.assignVariable && n.data?.variableName) {
        validLocals.add(n.data.variableName);
      }
    });

    const regex = /\{\{variables\.([a-zA-Z0-9_$.-]+)\}\}/g;
    let match;
    while ((match = regex.exec(nodesStr)) !== null) {
      const varName = match[1];

      if (!validLocals.has(varName) && !globalVariables.has(varName)) {
        console.error(`[ERROR] [${path.basename(filePath)}] Undeclared variable used: '{{variables.${varName}}}'. It is neither in trigger.parameters nor global variables.`);
        hasError = true;
      }
    }

    const refRegex = /automaRefData\s*\(\s*['"]variables['"]\s*,\s*['"]([^'"]+)['"]/g;
    let refMatch;
    while ((refMatch = refRegex.exec(nodesStr)) !== null) {
      const varName = refMatch[1];
      if (!validLocals.has(varName) && !globalVariables.has(varName)) {
        console.error(`[ERROR] [${path.basename(filePath)}] Undeclared variable used in JS Block: automaRefData('variables', '${varName}'). It is neither in trigger.parameters nor global variables.`);
        hasError = true;
      }
    }
  }

  const nodeMap = new Map();
  let rootTriggerParams = null;
  if (type === 'Workflow') {
    rootTriggerParams = data.trigger?.parameters || [];
  }

  for (const node of nodes) {
    if (automaTasks[node.label] && automaTasks[node.label].data) {
      validateNodeSchema(node.data, automaTasks[node.label].data, filePath, node.id, node.label);
    }

    if (type === 'Workflow' && node.label === 'trigger') {
      const nodeParams = node.data?.parameters || [];
      const nodeParamsStr = JSON.stringify(nodeParams);
      const rootParamsStr = JSON.stringify(rootTriggerParams);
      if (nodeParamsStr !== rootParamsStr) {
        console.error(`[ERROR] [${path.basename(filePath)}] The Trigger Node (id: '${node.id}') must have 'data.parameters' perfectly synchronized with the workflow's root 'trigger.parameters'. Automa UI requires this to render the input form. Please copy 'trigger.parameters' into the Trigger node's 'data.parameters'.`);
        hasError = true;
      }
    }

    if (nodeMap.has(node.id)) {
      console.error(`[ERROR] [${path.basename(filePath)}] Duplicate Node ID detected: '${node.id}' (${node.label}). This will break Vue Flow and Edge connections.`);
      hasError = true;
    }
    if (!node.data?.description || node.data.description.trim() === '') {
      console.error(`[ERROR] [${path.basename(filePath)}] Node '${node.id}' (${node.label}) is missing a 'description' in its data.`);
      hasError = true;
    }

    const validNodeTypes = ['BlockBasic', 'BlockConditions', 'BlockDelay', 'BlockPackage', 'BlockElementExists', 'BlockNote', 'BlockLoopBreakpoint'];
    if (!validNodeTypes.includes(node.type)) {
      console.error(`[ERROR] [${path.basename(filePath)}] Node '${node.id}' (${node.label}) uses an invalid type '${node.type}'. Expected one of: ${validNodeTypes.join(', ')}`);
      hasError = true;
    }

    if (!node.position || typeof node.position.x !== 'number' || typeof node.position.y !== 'number') {
      console.error(`[ERROR] [${path.basename(filePath)}] Node '${node.id}' (${node.label}) is missing valid 'position' (x, y).`);
      hasError = true;
    }

    if (!node.data || typeof node.data !== 'object') {
      console.error(`[ERROR] [${path.basename(filePath)}] Node '${node.id}' (${node.label}) is missing a 'data' object.`);
      hasError = true;
    } else if (node.data.onError !== undefined) {
      if (typeof node.data.onError !== 'object' || node.data.onError === null) {
        console.error(`[ERROR] [${path.basename(filePath)}] Node '${node.id}' (${node.label}) has a malformed 'onError'. It MUST be an object (e.g. { enable: true, toDo: 'fallback' }). Got: ${typeof node.data.onError} (${node.data.onError}).`);
        hasError = true;
      }
    }

    // --- DYNAMIC SCHEMA VALIDATION ENGINE ---
    if (automaSchema && automaSchema.properties?.drawflow?.properties?.nodes?.items?.allOf) {
      const allOf = automaSchema.properties.drawflow.properties.nodes.items.allOf;
      for (const rule of allOf) {
        if (!rule.if || !rule.then) continue;
        
        let ifMatches = true;
        
        if (rule.if.properties?.label?.const && node.label !== rule.if.properties.label.const) ifMatches = false;
        
        if (ifMatches && rule.if.properties?.label?.enum && !rule.if.properties.label.enum.includes(node.label)) ifMatches = false;
        
        if (ifMatches && rule.if.properties?.data?.properties) {
          for (const key in rule.if.properties.data.properties) {
            const constraint = rule.if.properties.data.properties[key];
            if (constraint.const !== undefined && node.data?.[key] !== constraint.const) {
              ifMatches = false;
              break;
            }
            if (constraint.pattern) {
              const regex = new RegExp(constraint.pattern);
              if (typeof node.data?.[key] !== 'string' || !regex.test(node.data[key])) {
                ifMatches = false;
                break;
              }
            }
          }
        }
        
        if (ifMatches && rule.if.properties?.data?.required) {
           for (const req of rule.if.properties.data.required) {
             if (node.data?.[req] === undefined) {
               ifMatches = false;
               break;
             }
           }
        }

        if (ifMatches && rule.then.properties?.data) {
          const thenData = rule.then.properties.data;
          let failed = false;
          
          if (thenData.required) {
            for (const req of thenData.required) {
              if (node.data?.[req] === undefined || node.data[req] === '') {
                failed = true;
                break;
              }
            }
          }
          
          if (!failed && thenData.properties) {
            for (const key in thenData.properties) {
              const constraint = thenData.properties[key];
              if (constraint.const !== undefined && node.data?.[key] !== constraint.const) {
                failed = true;
                break;
              }
            }
          }
          
          if (failed) {
            const msg = rule.errorMessage || `Node '${node.id}' (${node.label}) failed dynamic schema validation logic.`;
            console.error(`[ERROR] [${path.basename(filePath)}] Schema Violation: ${msg}`);
            hasError = true;
          }
        }
      }
    }

    if (node.type === 'BlockPackage') {
      if (!node.data?.data?.nodes || !node.data?.data?.edges) {
        console.error(`[ERROR] [${path.basename(filePath)}] BlockPackage '${node.id}' is missing embedded 'data.nodes' and 'data.edges'. Automa requires the target package data to be embedded here.`);
        hasError = true;
      }
      if (!node.data?.icon) {
        console.error(`[ERROR] [${path.basename(filePath)}] BlockPackage '${node.id}' is missing 'data.icon'. Vue Flow component will CRASH without it.`);
        hasError = true;
      }
      const inputs = node.data?.inputs || [];
      const outputs = node.data?.outputs || [];
      const checkInOut = (arr, typeName) => {
        for (const io of arr) {
          if (!io.id || typeof io.name !== 'string' || !io.blockId || !io.handleId) {
            console.error(`[ERROR] [${path.basename(filePath)}] BlockPackage '${node.id}' has malformed ${typeName}. Each must contain 'id', 'name', 'blockId', 'handleId'. Found: ${JSON.stringify(io)}`);
            hasError = true;
          }
        }
      };
      checkInOut(inputs, 'inputs');
      checkInOut(outputs, 'outputs');
    }

    nodeMap.set(node.id, node);
  }

  for (const edge of edges) {
    

    const sourceNode = nodeMap.get(edge.source);
    const targetNode = nodeMap.get(edge.target);

    if (!sourceNode) {
      console.error(`[ERROR] [${path.basename(filePath)}] Edge '${edge.id}' has unknown source node: '${edge.source}'`);
      hasError = true;
    }
    if (!targetNode) {
      console.error(`[ERROR] [${path.basename(filePath)}] Edge '${edge.id}' has unknown target node: '${edge.target}'`);
      hasError = true;
    }

    const expectedId = `vueflow__edge-${edge.source}${edge.sourceHandle}-${edge.target}${edge.targetHandle}`;

    if (sourceNode && sourceNode.type === 'BlockPackage') {
      const outputs = sourceNode.data?.outputs || [];
      const validHandles = outputs.map(out => `${sourceNode.id}-output-${out.id}`);
      if (!validHandles.includes(edge.sourceHandle)) {
        console.error(`[ERROR] [${path.basename(filePath)}] Edge '${edge.id}' uses invalid sourceHandle '${edge.sourceHandle}' for BlockPackage '${sourceNode.id}'. Expected one of: ${validHandles.join(', ')}`);
        hasError = true;
      }
    }

    if (sourceNode && sourceNode.label === 'conditions') {
      if (sourceNode.type !== 'BlockConditions') {
        console.error(`[ERROR] [${path.basename(filePath)}] Node '${sourceNode.id}' with label 'conditions' MUST have type 'BlockConditions', but got '${sourceNode.type}'`);
        hasError = true;
      }
      const conditionIds = (sourceNode.data?.conditions || []).map(c => c.id);
      const validHandles = [
        ...conditionIds.map(id => `${sourceNode.id}-output-${id}`),
        `${sourceNode.id}-output-fallback`
      ];
      if (!validHandles.includes(edge.sourceHandle)) {
        console.error(`[ERROR] [${path.basename(filePath)}] Edge '${edge.id}' uses invalid sourceHandle '${edge.sourceHandle}' for Conditions block '${sourceNode.id}'. Expected one of: ${validHandles.join(', ')}`);
        hasError = true;
      }
    }

    if (targetNode && targetNode.type === 'BlockPackage') {
      const inputs = targetNode.data?.inputs || [];
      const validHandles = inputs.map(inp => `${targetNode.id}-input-${inp.id}`);
      if (!validHandles.includes(edge.targetHandle)) {
        console.error(`[ERROR] [${path.basename(filePath)}] Edge '${edge.id}' uses invalid targetHandle '${edge.targetHandle}' for BlockPackage '${targetNode.id}'. Expected one of: ${validHandles.join(', ')}`);
        hasError = true;
      }
    }

    if (sourceNode && automaTasks[sourceNode.label] && sourceNode.type !== 'BlockPackage' && sourceNode.type !== 'BlockConditions') {
      const task = automaTasks[sourceNode.label];
      const numOutputs = task.outputs || 0;
      const validHandles = [];
      for (let i = 1; i <= numOutputs; i++) {
        validHandles.push(`${sourceNode.id}-output-${i}`);
      }
      validHandles.push(`${sourceNode.id}-output-fallback`);
      if (numOutputs > 0 && !validHandles.includes(edge.sourceHandle)) {
        console.error(`[ERROR] [${path.basename(filePath)}] Edge '${edge.id}' uses invalid sourceHandle '${edge.sourceHandle}' for '${sourceNode.label}'. Expected one of: ${validHandles.join(', ')}`);
        hasError = true;
      }
    }

    if (targetNode && automaTasks[targetNode.label] && targetNode.type !== 'BlockPackage') {
      const task = automaTasks[targetNode.label];
      const numInputs = task.inputs || 0;
      const validHandles = [];
      for (let i = 1; i <= numInputs; i++) {
        validHandles.push(`${targetNode.id}-input-${i}`);
      }
      if (numInputs > 0 && !validHandles.includes(edge.targetHandle)) {
        console.error(`[ERROR] [${path.basename(filePath)}] Edge '${edge.id}' uses invalid targetHandle '${edge.targetHandle}' for '${targetNode.label}'. Expected one of: ${validHandles.join(', ')}`);
        hasError = true;
      }
    }
  }
}

function runLinter() {
  console.log(`${colors.cyan}Starting Automa Linter...${colors.reset}`);
  let filesLinted = 0;
  
  if (filesToLint.length === 0) {
    console.error(`\n${colors.red}${colors.bold}[ERROR] No input files provided. Usage: node lint_automa.js <file1.json> <file2.json>${colors.reset}`);
    process.exit(1);
  }

  for (const file of filesToLint) {
    const customFile = path.resolve(file);
    if(fs.existsSync(customFile)) {
       lintFile(customFile, 'Workflow');
       filesLinted++;
    } else {
       console.error(`[ERROR] File not found: ${customFile}`);
       hasError = true;
    }
  }

  if (filesLinted === 0 && !hasError) {
    console.warn(`${colors.yellow}No valid JSON files were processed.${colors.reset}`);
  }

  if (hasError) {
    console.error(`\n${colors.red}${colors.bold}Linting FAILED. Please fix the errors above.${colors.reset}`);
    process.exit(1);
  } else {
    console.log(`\n${colors.green}${colors.bold}Linting PASSED for ${filesLinted} files.${colors.reset}`);
  }
}

runLinter();
