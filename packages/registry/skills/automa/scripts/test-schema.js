const fs = require("fs");
const path = require("path");

let Ajv;
try {
  Ajv = require("ajv");
} catch (e) {
  console.error("Error: 'ajv' module not found.");
  console.error("Please run 'npm install ajv' in the scripts directory.");
  process.exit(1);
}

// Load schema
const schemaPath = path.resolve(__dirname, "../schemas/automa.schema.json");
const schema = JSON.parse(fs.readFileSync(schemaPath, "utf8"));

// Initialize Ajv
const ajv = new Ajv({ allErrors: true, strict: false });
const validate = ajv.compile(schema);

// Helper function to create a workflow object
function createWorkflow(nodes) {
  return {
    name: "Validation Test Workflow",
    settings: {},
    drawflow: {
      nodes: nodes.map((node, index) => ({
        id: node.id || `node-${index}`,
        label: node.label || "event-click",
        type: "BlockBasic",
        data: node.data,
      })),
      edges: [],
      position: { x: 0, y: 0 },
      zoom: 1,
    },
  };
}

let testPassed = true;

function runTest(testName, workflow, expectedValid) {
  const valid = validate(workflow);
  if (valid === expectedValid) {
    console.log(`[PASS] ${testName}`);
  } else {
    console.error(`[FAIL] ${testName}`);
    console.error(
      `Expected validation to be ${expectedValid}, but got ${valid}`,
    );
    if (!valid) {
      console.error(
        "Validation errors:",
        JSON.stringify(validate.errors, null, 2),
      );
    }
    testPassed = false;
  }
}

// 1. Test a valid workflow node (click node with selector starting with '//' and findBy set to 'xpath')
const test1 = createWorkflow([
  {
    data: {
      selector: "//button[@id='submit']",
      findBy: "xpath",
    },
  },
]);
runTest(
  "Valid XPath selector with findBy set to 'xpath' (starts with //)",
  test1,
  true,
);

// 1b. Test a valid workflow node (click node with selector starting with '(' and findBy set to 'xpath')
const test1b = createWorkflow([
  {
    data: {
      selector: "(//div)[1]",
      findBy: "xpath",
    },
  },
]);
runTest(
  "Valid XPath selector with findBy set to 'xpath' (starts with ()",
  test1b,
  true,
);

// 2. Test an invalid workflow node (click node with selector starting with '//' but findBy set to 'css')
const test2 = createWorkflow([
  {
    data: {
      selector: "//button[@id='submit']",
      findBy: "css",
    },
  },
]);
runTest(
  "Invalid XPath selector with findBy set to 'css' (should be rejected)",
  test2,
  false,
);

// 3. Test an invalid workflow node (click node with selector starting with '//' and findBy missing)
const test3 = createWorkflow([
  {
    data: {
      selector: "//button[@id='submit']",
    },
  },
]);
runTest(
  "Invalid XPath selector with findBy missing (should be rejected)",
  test3,
  false,
);

// 3b. Test an invalid workflow node (click node with selector starting with '(' and findBy missing)
const test3b = createWorkflow([
  {
    data: {
      selector: "(//div)[1]",
    },
  },
]);
runTest(
  "Invalid XPath selector starting with '(' with findBy missing (should be rejected)",
  test3b,
  false,
);

// 4. Assert that non-XPath selectors (like 'button.submit') pass with or without findBy.
const test4 = createWorkflow([
  {
    data: {
      selector: "button.submit",
    },
  },
]);
runTest("Non-XPath selector (CSS) without findBy (should pass)", test4, true);

const test5 = createWorkflow([
  {
    data: {
      selector: "button.submit",
      findBy: "css",
    },
  },
]);
runTest(
  "Non-XPath selector (CSS) with findBy: 'css' (should pass)",
  test5,
  true,
);

const test6 = createWorkflow([
  {
    data: {
      selector: "button.submit",
      findBy: "xpath",
    },
  },
]);
runTest(
  "Non-XPath selector (CSS) with findBy: 'xpath' (should pass)",
  test6,
  true,
);

// 5. Assert that selector with leading whitespace starting with XPath is rejected when findBy is missing
const test7 = createWorkflow([
  {
    data: {
      selector: "  //input",
    },
  },
]);
runTest(
  "XPath selector with leading whitespace and findBy missing (should be rejected)",
  test7,
  false,
);

// 6. Assert that selector starting with a dot like "./div" is rejected when findBy is missing
const test8 = createWorkflow([
  {
    data: {
      selector: "./div",
    },
  },
]);
runTest(
  "XPath selector starting with dot './div' and findBy missing (should be rejected)",
  test8,
  false,
);

// 7. Assert that selector starting with a dot like ".//span" is rejected when findBy is missing
const test9 = createWorkflow([
  {
    data: {
      selector: ".//span",
    },
  },
]);
runTest(
  "XPath selector starting with dot './/span' and findBy missing (should be rejected)",
  test9,
  false,
);

// 8. Assert that selector with leading whitespace and dot like "  ./div" is rejected when findBy is missing
const test10 = createWorkflow([
  {
    data: {
      selector: "  ./div",
    },
  },
]);
runTest(
  "XPath selector with leading whitespace and dot '  ./div' and findBy missing (should be rejected)",
  test10,
  false,
);

// 9. XPath selector with leading whitespace and findBy set to 'xpath' should pass
const test11 = createWorkflow([
  {
    data: {
      selector: "  //input",
      findBy: "xpath",
    },
  },
]);
runTest(
  "XPath selector with leading whitespace and findBy set to 'xpath' (should pass)",
  test11,
  true,
);

// 10. XPath selector starting with dot and findBy set to 'xpath' should pass
const test12 = createWorkflow([
  {
    data: {
      selector: "./div",
      findBy: "xpath",
    },
  },
]);
runTest(
  "XPath selector starting with dot and findBy set to 'xpath' (should pass)",
  test12,
  true,
);

// Exit process
if (testPassed) {
  console.log("\nAll schema validation assertions passed successfully!");
  process.exit(0);
} else {
  console.error("\nSome schema validation assertions failed!");
  process.exit(1);
}
