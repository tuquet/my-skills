# Programmatic Workflow Injection

When you need to dynamically inject a package or a block into an existing Automa workflow or package JSON file, it is highly recommended to use the provided Node.js script rather than manually parsing and replacing coordinates and edges. Automa JSON utilizes absolute `position` coordinates (`x`, `y`) and strictly formed `edges` array elements to connect node handles.

## Using `inject-automa-node.js`

The script `scripts/inject-automa-node.js` allows you to split an existing edge and inject one or more nodes sequentially. 

**Command:**
```bash
node scripts/inject-automa-node.js <file> <sourceNodeId> <targetNodeId|null> <nodesJsonString>
```

**Parameters:**
- `file`: The path to the Automa JSON file (either a workflow or a package).
- `sourceNodeId`: The ID of the node from which the edge originates.
- `targetNodeId`: The ID of the destination node. Set to `null` if you are injecting at the very end of the flow.
- `nodesJsonString`: A JSON string representing an array of Node objects to be injected sequentially.

### Example: Injecting a Package

To inject a package block between node `n6` and `n7`:

```bash
node scripts/inject-automa-node.js "supabase/seeds/workflows/My Workflow.json" "n6" "n7" '[{
  "type": "BlockPackage",
  "label": "block-package",
  "data": {
    "id": "pkg-action-capture-html",
    "name": "[action] Capture HTML to DB"
  }
}]'
```

### Supported Injection Nodes
You can inject any valid Automa node type. 
- For an `insert-data` block (setting variables):
  ```json
  {
    "type": "BlockInsertData",
    "label": "insert-data",
    "data": {
      "dataToInsert": [
        { "type": "variable", "name": "snapshotName", "value": "Drawer: My Drawer" }
      ]
    }
  }
  ```

Always ensure the `nodesJsonString` is correctly escaped when passing via CLI. For complex node arrays, it's recommended to write a wrapper JS script that `require`s the `injectNodes` function directly instead of passing massive strings in bash.
